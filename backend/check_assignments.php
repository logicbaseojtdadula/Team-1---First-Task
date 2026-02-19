<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== PROJECT ASSIGNMENTS ===\n\n";

$projects = \App\Models\Project::with(['assignments.user', 'tasks'])->get();

foreach ($projects as $project) {
    echo "Project: {$project->name}\n";
    echo "  Developers assigned:\n";
    foreach ($project->assignments as $assignment) {
        echo "    - {$assignment->role}: {$assignment->user->email}\n";
    }
    echo "  Tasks: " . $project->tasks->count() . "\n";
    foreach ($project->tasks as $task) {
        $assignee = \App\Models\User::find($task->assigned_to);
        echo "    - {$task->title} ({$task->category}) → {$assignee->email}\n";
    }
    echo "\n";
}
