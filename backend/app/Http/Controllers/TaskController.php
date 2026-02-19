<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'customer') {
            // Customer sees only tasks they created
            $tasks = Task::where('created_by', $user->id)
                ->with(['project'])
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            // Developers see only tasks assigned to them
            $tasks = Task::where('assigned_to', $user->id)
                ->with(['project', 'creator'])
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        // Only customers can create tasks
        if ($user->role !== 'customer') {
            return response()->json(['message' => 'Only customers can create tasks'], 403);
        }

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|in:frontend,backend,server',
            'priority' => 'required|in:low,medium,high',
        ]);

        // Verify customer owns the project
        $project = Project::findOrFail($validated['project_id']);
        if ($project->customer_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Get the assigned developer based on category
        $assignedUser = $project->getDeveloper($validated['category']);

        if (!$assignedUser) {
            return response()->json([
                'message' => "No {$validated['category']} developer assigned to this project"
            ], 400);
        }

        $task = Task::create([
            'project_id' => $validated['project_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'priority' => $validated['priority'],
            'status' => 'pending',
            'created_by' => $user->id,
            'assigned_to' => $assignedUser->id,
        ]);

        return response()->json($task->load('project'), 201);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $user = $request->user();

        // Customers can edit their own tasks
        if ($user->role === 'customer') {
            if ($task->created_by !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'category' => 'sometimes|in:frontend,backend,server',
                'priority' => 'sometimes|in:low,medium,high',
            ]);

            // If category changed, reassign the task
            if (isset($validated['category']) && $validated['category'] !== $task->category) {
                $project = $task->project;
                $newAssignee = $project->getDeveloper($validated['category']);
                if ($newAssignee) {
                    $validated['assigned_to'] = $newAssignee->id;
                }
            }

            $task->update($validated);
        } else {
            // Developers can only update status
            if ($task->assigned_to !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $validated = $request->validate([
                'status' => 'required|in:pending,in-progress,completed',
            ]);

            $task->update($validated);
        }

        return response()->json($task->load('project'));
    }

    public function destroy(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $user = $request->user();

        // Customers can delete any of their tasks
        // Developers can only delete completed tasks assigned to them
        if ($user->role === 'customer') {
            if ($task->created_by !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } else {
            // Developer can only delete completed tasks
            if ($task->assigned_to !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            if ($task->status !== 'completed') {
                return response()->json(['message' => 'Only completed tasks can be deleted'], 403);
            }
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function addSubmission(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $user = $request->user();

        // Only assigned developer can add submissions
        if ($task->assigned_to !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'type' => 'required|in:file,image,link',
            'file' => 'required_if:type,file,image|file|max:10240', // 10MB max
            'link_url' => 'required_if:type,link|url',
            'description' => 'nullable|string',
        ]);

        $submission = new \App\Models\TaskSubmission();
        $submission->task_id = $task->id;
        $submission->user_id = $user->id;
        $submission->type = $validated['type'];
        $submission->description = $validated['description'] ?? null;

        if (in_array($validated['type'], ['file', 'image'])) {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('submissions', $filename, 'public');
            $submission->file_path = $path;
            $submission->file_name = $file->getClientOriginalName();
        } else {
            $submission->link_url = $validated['link_url'];
        }

        $submission->save();

        return response()->json($submission, 201);
    }

    public function getSubmissions($id)
    {
        $task = Task::findOrFail($id);
        $submissions = $task->submissions()->with('user')->orderBy('created_at', 'desc')->get();
        return response()->json($submissions);
    }

    public function deleteSubmission(Request $request, $taskId, $submissionId)
    {
        $submission = \App\Models\TaskSubmission::findOrFail($submissionId);
        $user = $request->user();

        // Only the user who created the submission can delete it
        if ($submission->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete file if exists
        if ($submission->file_path) {
            \Storage::disk('public')->delete($submission->file_path);
        }

        $submission->delete();

        return response()->json(['message' => 'Submission deleted successfully']);
    }
}
