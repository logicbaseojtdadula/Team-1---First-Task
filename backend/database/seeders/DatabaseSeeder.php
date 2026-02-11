<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Project;
use App\Models\ProjectAssignment;
use App\Models\Task;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Users
        $customer = User::create([
            'name' => 'Customer User',
            'email' => 'customer@project.com',
            'password' => Hash::make('customer123'),
            'role' => 'customer',
        ]);

        $frontend = User::create([
            'name' => 'Frontend Developer',
            'email' => 'frontend@project.com',
            'password' => Hash::make('frontend123'),
            'role' => 'frontend',
        ]);

        $backend = User::create([
            'name' => 'Backend Developer',
            'email' => 'backend@project.com',
            'password' => Hash::make('backend123'),
            'role' => 'backend',
        ]);

        $server = User::create([
            'name' => 'Server Administrator',
            'email' => 'server@project.com',
            'password' => Hash::make('server123'),
            'role' => 'server',
        ]);

        // Create additional developers for other projects
        $frontend2 = User::create([
            'name' => 'Alice Frontend',
            'email' => 'alice@project.com',
            'password' => Hash::make('alice123'),
            'role' => 'frontend',
        ]);

        $backend2 = User::create([
            'name' => 'Bob Backend',
            'email' => 'bob@project.com',
            'password' => Hash::make('bob123'),
            'role' => 'backend',
        ]);

        $server2 = User::create([
            'name' => 'Charlie Server',
            'email' => 'charlie@project.com',
            'password' => Hash::make('charlie123'),
            'role' => 'server',
        ]);

        // Create 5 Projects
        $projects = [];
        
        $project1 = Project::create([
            'name' => 'E-Commerce Platform',
            'description' => 'Online shopping platform with payment integration',
            'customer_id' => $customer->id,
        ]);
        $projects[] = $project1;

        $project2 = Project::create([
            'name' => 'Mobile Banking App',
            'description' => 'Secure banking application for mobile devices',
            'customer_id' => $customer->id,
        ]);
        $projects[] = $project2;

        $project3 = Project::create([
            'name' => 'Learning Management System',
            'description' => 'Educational platform for online courses',
            'customer_id' => $customer->id,
        ]);
        $projects[] = $project3;

        $project4 = Project::create([
            'name' => 'Healthcare Portal',
            'description' => 'Patient management and appointment system',
            'customer_id' => $customer->id,
        ]);
        $projects[] = $project4;

        $project5 = Project::create([
            'name' => 'Real Estate Listing',
            'description' => 'Property listing and management platform',
            'customer_id' => $customer->id,
        ]);
        $projects[] = $project5;

        // Assign developers to Project 1
        ProjectAssignment::create([
            'project_id' => $project1->id,
            'user_id' => $frontend->id,
            'role' => 'frontend',
        ]);

        ProjectAssignment::create([
            'project_id' => $project1->id,
            'user_id' => $backend->id,
            'role' => 'backend',
        ]);

        ProjectAssignment::create([
            'project_id' => $project1->id,
            'user_id' => $server->id,
            'role' => 'server',
        ]);

        // Assign developers to Project 2
        ProjectAssignment::create([
            'project_id' => $project2->id,
            'user_id' => $frontend2->id,
            'role' => 'frontend',
        ]);

        ProjectAssignment::create([
            'project_id' => $project2->id,
            'user_id' => $backend2->id,
            'role' => 'backend',
        ]);

        ProjectAssignment::create([
            'project_id' => $project2->id,
            'user_id' => $server2->id,
            'role' => 'server',
        ]);

        // Assign same developers to remaining projects (developers can work on multiple projects)
        foreach ([$project3, $project4, $project5] as $project) {
            ProjectAssignment::create([
                'project_id' => $project->id,
                'user_id' => $frontend->id,
                'role' => 'frontend',
            ]);

            ProjectAssignment::create([
                'project_id' => $project->id,
                'user_id' => $backend->id,
                'role' => 'backend',
            ]);

            ProjectAssignment::create([
                'project_id' => $project->id,
                'user_id' => $server->id,
                'role' => 'server',
            ]);
        }

        // Create sample tasks for Project 1
        Task::create([
            'project_id' => $project1->id,
            'title' => 'Design product listing page',
            'description' => 'Create responsive product grid with filters',
            'category' => 'frontend',
            'priority' => 'high',
            'status' => 'completed',
            'created_by' => $customer->id,
            'assigned_to' => $frontend->id,
        ]);

        Task::create([
            'project_id' => $project1->id,
            'title' => 'Implement payment API',
            'description' => 'Integrate Stripe payment gateway',
            'category' => 'backend',
            'priority' => 'high',
            'status' => 'in-progress',
            'created_by' => $customer->id,
            'assigned_to' => $backend->id,
        ]);

        Task::create([
            'project_id' => $project1->id,
            'title' => 'Setup SSL certificate',
            'description' => 'Configure HTTPS for production server',
            'category' => 'server',
            'priority' => 'medium',
            'status' => 'pending',
            'created_by' => $customer->id,
            'assigned_to' => $server->id,
        ]);

        Task::create([
            'project_id' => $project1->id,
            'title' => 'Create shopping cart component',
            'description' => 'Build interactive cart with add/remove functionality',
            'category' => 'frontend',
            'priority' => 'medium',
            'status' => 'pending',
            'created_by' => $customer->id,
            'assigned_to' => $frontend->id,
        ]);

        // Create tasks for Project 2
        Task::create([
            'project_id' => $project2->id,
            'title' => 'Design login screen',
            'description' => 'Create modern banking login UI',
            'category' => 'frontend',
            'priority' => 'high',
            'status' => 'completed',
            'created_by' => $customer->id,
            'assigned_to' => $frontend2->id,
        ]);

        echo "Database seeded successfully!\n\n";
        echo "Login credentials:\n";
        echo "Customer: customer@project.com / customer123\n";
        echo "Frontend: frontend@project.com / frontend123\n";
        echo "Backend: backend@project.com / backend123\n";
        echo "Server: server@project.com / server123\n";
    }
}
