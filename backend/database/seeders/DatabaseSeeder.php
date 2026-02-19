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
        // Create Admin
        $admin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@structask.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create Customer
        $customer = User::create([
            'name' => 'Customer User',
            'email' => 'customer@project.com',
            'password' => Hash::make('customer123'),
            'role' => 'customer',
            'is_active' => true,
        ]);

        // Create 5 Frontend Developers
        $frontendDevs = [];
        for ($i = 1; $i <= 5; $i++) {
            $frontendDevs[] = User::create([
                'name' => "Frontend Developer $i",
                'email' => "frontend$i@structask.com",
                'password' => Hash::make('frontend123'),
                'role' => 'frontend',
                'created_by' => $admin->id,
                'is_active' => true,
            ]);
        }

        // Create 5 Backend Developers
        $backendDevs = [];
        for ($i = 1; $i <= 5; $i++) {
            $backendDevs[] = User::create([
                'name' => "Backend Developer $i",
                'email' => "backend$i@structask.com",
                'password' => Hash::make('backend123'),
                'role' => 'backend',
                'created_by' => $admin->id,
                'is_active' => true,
            ]);
        }

        // Create 5 Server Administrators
        $serverAdmins = [];
        for ($i = 1; $i <= 5; $i++) {
            $serverAdmins[] = User::create([
                'name' => "Server Admin $i",
                'email' => "server$i@structask.com",
                'password' => Hash::make('server123'),
                'role' => 'server',
                'created_by' => $admin->id,
                'is_active' => true,
            ]);
        }

        // Create a sample project (status: pending until admin assigns developers)
        $project1 = Project::create([
            'name' => 'E-Commerce Platform',
            'description' => 'Online shopping platform with payment integration',
            'customer_id' => $customer->id,
            'status' => 'pending',
        ]);

        // Admin assigns developers to Project 1 (you can change these assignments)
        ProjectAssignment::create([
            'project_id' => $project1->id,
            'user_id' => $frontendDevs[0]->id, // Frontend Developer 1
            'role' => 'frontend',
        ]);

        ProjectAssignment::create([
            'project_id' => $project1->id,
            'user_id' => $backendDevs[0]->id, // Backend Developer 1
            'role' => 'backend',
        ]);

        ProjectAssignment::create([
            'project_id' => $project1->id,
            'user_id' => $serverAdmins[0]->id, // Server Admin 1
            'role' => 'server',
        ]);

        // Update project status to active
        $project1->status = 'active';
        $project1->save();

        // Customer creates tasks (automatically assigned to developers)
        Task::create([
            'project_id' => $project1->id,
            'title' => 'Design product listing page',
            'description' => 'Create responsive product grid with filters',
            'category' => 'frontend',
            'priority' => 'high',
            'status' => 'pending',
            'created_by' => $customer->id,
            'assigned_to' => $frontendDevs[0]->id,
        ]);

        Task::create([
            'project_id' => $project1->id,
            'title' => 'Implement payment API',
            'description' => 'Integrate Stripe payment gateway',
            'category' => 'backend',
            'priority' => 'high',
            'status' => 'pending',
            'created_by' => $customer->id,
            'assigned_to' => $backendDevs[0]->id,
        ]);

        Task::create([
            'project_id' => $project1->id,
            'title' => 'Setup SSL certificate',
            'description' => 'Configure HTTPS for production server',
            'category' => 'server',
            'priority' => 'medium',
            'status' => 'pending',
            'created_by' => $customer->id,
            'assigned_to' => $serverAdmins[0]->id,
        ]);

        echo "Database seeded successfully!\n\n";
        echo "=== LOGIN CREDENTIALS ===\n";
        echo "Admin: admin@structask.com / admin123\n\n";
        echo "Customer: customer@project.com / customer123\n\n";
        echo "Frontend Developers:\n";
        for ($i = 1; $i <= 5; $i++) {
            echo "  frontend$i@structask.com / frontend123\n";
        }
        echo "\nBackend Developers:\n";
        for ($i = 1; $i <= 5; $i++) {
            echo "  backend$i@structask.com / backend123\n";
        }
        echo "\nServer Administrators:\n";
        for ($i = 1; $i <= 5; $i++) {
            echo "  server$i@structask.com / server123\n";
        }
        echo "\n=== ADMIN INSTRUCTIONS ===\n";
        echo "As admin, you can assign any developer to any project.\n";
        echo "Developers don't know which tasks they'll get until they login!\n";
    }
}
