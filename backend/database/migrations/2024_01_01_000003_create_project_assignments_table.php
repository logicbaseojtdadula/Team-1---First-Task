<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['frontend', 'backend', 'server']);
            $table->timestamps();
            
            // Ensure one developer per role per project
            $table->unique(['project_id', 'role']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_assignments');
    }
};
