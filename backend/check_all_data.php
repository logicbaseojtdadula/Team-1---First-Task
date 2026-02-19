<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== COMPLETE DATABASE CHECK ===\n\n";

// Check all users
$users = \App\Models\User::all();
echo "Total Users: " . $users->count() . "\n";
echo "Customers: " . $users->where('role', 'customer')->count() . "\n";
echo "Frontend Devs: " . $users->where('role', 'frontend')->count() . "\n";
echo "Backend Devs: " . $users->where('role', 'backend')->count() . "\n";
echo "Server Admins: " . $users->where('role', 'server')->count() . "\n\n";

// List all customers
echo "=== ALL CUSTOMERS ===\n";
foreach ($users->where('role', 'customer') as $customer) {
    echo "- {$customer->name} ({$customer->email}) - Active: " . ($customer->is_active ?? 'N/A') . "\n";
}
echo "\n";

// Check all projects
$projects = \App\Models\Project::with('assignments.user', 'tasks', 'customer')->get();
echo "=== ALL PROJECTS ===\n";
echo "Total Projects: " . $projects->count() . "\n\n";

foreach ($projects as $project) {
    echo "Project #{$project->id}: {$project->name}\n";
    echo "  Customer: {$project->customer->name} ({$project->customer->email})\n";
    echo "  Assignments: " . $project->assignments->count() . "\n";
    foreach ($project->assignments as $assignment) {
        echo "    - {$assignment->role}: {$assignment->user->name}\n";
    }
    echo "  Tasks: " . $project->tasks->count() . "\n";
    foreach ($project->tasks as $task) {
        echo "    - {$task->title} (Category: {$task->category}, Assigned to: {$task->assigned_to})\n";
    }
    echo "\n";
}

// Check developers' is_active status
echo "=== DEVELOPER STATUS ===\n";
$developers = \App\Models\User::whereIn('role', ['frontend', 'backend', 'server'])->get();
foreach ($developers as $dev) {
    $activeStatus = $dev->is_active ?? 'NULL';
    echo "{$dev->role}: {$dev->name} - is_active: {$activeStatus}\n";
}
