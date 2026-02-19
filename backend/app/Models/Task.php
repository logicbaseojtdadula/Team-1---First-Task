<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'category', // frontend, backend, server
        'priority', // low, medium, high
        'status', // pending, in-progress, completed
        'created_by',
        'assigned_to',
    ];

    protected $with = ['project'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function submissions()
    {
        return $this->hasMany(TaskSubmission::class);
    }
}
