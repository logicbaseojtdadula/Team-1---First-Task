<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== DATABASE CHECK ===\n\n";

$projects = \App\Models\Project::with('assignments.user', 'tasks')->get();

echo "Total Projects: " . $projects->count() . "\n";
echo "Total Assignments: " . \App\Models\ProjectAssignment::count() . "\n";
echo "Total Tasks: " . \App\Models\Task::count() . "\n\n";

foreach ($projects as $project) {
    echo "Project: {$project->name} (ID: {$project->id})\n";
    echo "  Customer: {$project->customer->name}\n";
    echo "  Assignments:\n";
    foreach ($project->assignments as $assignment) {
        echo "    - {$assignment->role}: {$assignment->user->name} (ID: {$assignment->user->id})\n";
    }
    echo "  Tasks:\n";
    foreach ($project->tasks as $task) {
        echo "    - {$task->title} (Category: {$task->category}, Assigned to: {$task->assigned_to})\n";
    }
    echo "\n";
}
