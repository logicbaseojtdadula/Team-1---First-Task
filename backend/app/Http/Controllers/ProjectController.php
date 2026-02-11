<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'customer') {
            // Customer sees their own projects
            $projects = Project::where('customer_id', $user->id)
                ->with(['tasks', 'assignments.user'])
                ->get();
        } else {
            // Developers see projects they're assigned to
            $projects = Project::whereHas('assignments', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->with(['tasks', 'assignments.user'])->get();
        }

        return response()->json($projects);
    }

    public function show(Request $request, $id)
    {
        $project = Project::with(['tasks', 'assignments.user'])->findOrFail($id);
        
        // Check access
        $user = $request->user();
        if ($user->role === 'customer' && $project->customer_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($user->role !== 'customer') {
            $hasAccess = $project->assignments()->where('user_id', $user->id)->exists();
            if (!$hasAccess) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        return response()->json($project);
    }
}
