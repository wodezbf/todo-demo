<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    protected $fillable = [
        'title',
        'description',
        'completed',
        'priority'
    ];

    protected $casts = [
        'completed' => 'boolean'
    ];
} 