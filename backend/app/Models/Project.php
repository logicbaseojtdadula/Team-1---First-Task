<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'customer_id',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function assignments()
    {
        return $this->hasMany(ProjectAssignment::class);
    }

    // Get developer by role for this project
    public function getDeveloper($role)
    {
        return $this->assignments()
            ->where('role', $role)
            ->with('user')
            ->first()?->user;
    }

    public function frontendDeveloper()
    {
        return $this->getDeveloper('frontend');
    }

    public function backendDeveloper()
    {
        return $this->getDeveloper('backend');
    }

    public function serverAdmin()
    {
        return $this->getDeveloper('server');
    }
}
