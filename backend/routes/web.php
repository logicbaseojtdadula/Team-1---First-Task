<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Admin view to see all users
Route::get('/admin/users', function () {
    $users = User::orderBy('created_at', 'desc')->get();
    return view('admin-users', ['users' => $users]);
});

// Serve React App for all routes except API
Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '^(?!api|admin).*$');

