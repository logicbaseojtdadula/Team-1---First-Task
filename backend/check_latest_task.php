<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== CHECKING LATEST TASKS ===\n\n";

$frontendDev = App\Models\User::where('email', 'frontend@project.com')->first();
echo "Frontend Developer ID: {$frontendDev->id}\n\n";

$allFrontendTasks = App\Models\Task::where('category', 'frontend')->orderBy('created_at', 'desc')->get();
echo "Total frontend category tasks: {$allFrontendTasks->count()}\n";
echo "-----------------------------------\n";

foreach ($allFrontendTasks as $task) {
    echo "ID: {$task->id} | Title: {$task->title} | Assigned to: {$task->assigned_to} | Created: {$task->created_at}\n";
}

echo "\n=== TASKS ASSIGNED TO FRONTEND DEV (ID: {$frontendDev->id}) ===\n";
$assignedTasks = App\Models\Task::where('assigned_to', $frontendDev->id)->orderBy('created_at', 'desc')->get();
echo "Count: {$assignedTasks->count()}\n";
echo "-----------------------------------\n";

foreach ($assignedTasks as $task) {
    echo "ID: {$task->id} | Title: {$task->title} | Category: {$task->category} | Created: {$task->created_at}\n";
}
