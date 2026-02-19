<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Project;
use App\Models\ProjectAssignment;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // Get dashboard stats
    public function dashboard()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_developers' => User::whereIn('role', ['frontend', 'backend', 'server'])->count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_projects' => Project::count(),
            'total_tasks' => Task::count(),
            'active_projects' => Project::where('status', 'active')->count(),
        ]);
    }

    // Get all users
    public function getUsers()
    {
        $users = User::select('id', 'name', 'email', 'role', 'is_active', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($users);
    }

    // Create developer account
    public function createDeveloper(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:frontend,backend,server',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'created_by' => $request->user()->id,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Developer account created successfully',
            'user' => $user,
        ], 201);
    }

    // Toggle user active status
    public function toggleUserStatus($id)
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'message' => 'User status updated',
            'user' => $user,
        ]);
    }

    // Get all projects with assignment status
    public function getProjects()
    {
        $projects = Project::with(['customer', 'assignments.user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($projects);
    }

    // Assign developers to project
    public function assignDevelopers(Request $request, $projectId)
    {
        $validated = $request->validate([
            'frontend_id' => 'required|exists:users,id',
            'backend_id' => 'required|exists:users,id',
            'server_id' => 'required|exists:users,id',
        ]);

        $project = Project::findOrFail($projectId);
        $adminId = $request->user()->id;

        // Remove existing assignments
        ProjectAssignment::where('project_id', $projectId)->delete();

        // Create new assignments
        ProjectAssignment::create([
            'project_id' => $projectId,
            'user_id' => $validated['frontend_id'],
            'role' => 'frontend',
        ]);

        ProjectAssignment::create([
            'project_id' => $projectId,
            'user_id' => $validated['backend_id'],
            'role' => 'backend',
        ]);

        ProjectAssignment::create([
            'project_id' => $projectId,
            'user_id' => $validated['server_id'],
            'role' => 'server',
        ]);

        // Update project status
        $project->status = 'active';
        $project->save();

        return response()->json([
            'message' => 'Developers assigned successfully',
            'project' => $project->load('assignments.user'),
        ]);
    }

    // Get available developers by role
    public function getAvailableDevelopers($role)
    {
        $developers = User::where('role', $role)
            ->where('is_active', true)
            ->select('id', 'name', 'email')
            ->get();

        return response()->json($developers);
    }
}
