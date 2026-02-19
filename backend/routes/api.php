<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\AdminController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); // Only for customers

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/upload-profile-photo', [AuthController::class, 'uploadProfilePhoto']);
    
    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::post('/developers', [AdminController::class, 'createDeveloper']);
        Route::patch('/users/{id}/toggle-status', [AdminController::class, 'toggleUserStatus']);
        Route::get('/projects', [AdminController::class, 'getProjects']);
        Route::post('/projects/{id}/assign', [AdminController::class, 'assignDevelopers']);
        Route::get('/developers/{role}', [AdminController::class, 'getAvailableDevelopers']);
    });
    
    // Projects
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    
    // Tasks
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
    
    // Task Submissions
    Route::post('/tasks/{id}/submissions', [TaskController::class, 'addSubmission']);
    Route::get('/tasks/{id}/submissions', [TaskController::class, 'getSubmissions']);
    Route::delete('/tasks/{taskId}/submissions/{submissionId}', [TaskController::class, 'deleteSubmission']);
});
