<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectAssignment;
use App\Models\User;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            // Admin sees all projects
            $projects = Project::with(['tasks', 'assignments.user', 'customer'])
                ->orderBy('created_at', 'desc')
                ->get();
        } elseif ($user->role === 'customer') {
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'customer_id' => 'required_if:role,admin|exists:users,id', // Admin must specify customer
        ]);

        $user = $request->user();

        // Admin or customer can create projects
        if ($user->role === 'admin') {
            // Admin creates project for a customer
            $customerId = $validated['customer_id'];
        } elseif ($user->role === 'customer') {
            // Customer creates their own project
            $customerId = $user->id;
        } else {
            return response()->json(['message' => 'Only customers and admins can create projects'], 403);
        }

        // Create project
        $project = Project::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'customer_id' => $customerId,
            'status' => 'active', // Automatically active
        ]);

        // Auto-assign developers (round-robin)
        $this->autoAssignDevelopers($project);

        return response()->json($project->load('assignments.user', 'customer'), 201);
    }

    private function autoAssignDevelopers($project)
    {
        // Get the least assigned developers for each role
        $frontendDev = $this->getLeastAssignedDeveloper('frontend');
        $backendDev = $this->getLeastAssignedDeveloper('backend');
        $serverAdmin = $this->getLeastAssignedDeveloper('server');

        if ($frontendDev) {
            ProjectAssignment::create([
                'project_id' => $project->id,
                'user_id' => $frontendDev->id,
                'role' => 'frontend',
            ]);
        }

        if ($backendDev) {
            ProjectAssignment::create([
                'project_id' => $project->id,
                'user_id' => $backendDev->id,
                'role' => 'backend',
            ]);
        }

        if ($serverAdmin) {
            ProjectAssignment::create([
                'project_id' => $project->id,
                'user_id' => $serverAdmin->id,
                'role' => 'server',
            ]);
        }
    }

    private function getLeastAssignedDeveloper($role)
    {
        // Get all active developers of this role
        $developers = User::where('role', $role)
            ->where('is_active', true)
            ->withCount('assignments')
            ->orderBy('assignments_count', 'asc')
            ->get();

        if ($developers->isEmpty()) {
            return null;
        }

        // Return the developer with least assignments (round-robin)
        return $developers->first();
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

