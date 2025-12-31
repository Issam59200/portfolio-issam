<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'stack',
        'link',
        'github',
        'image',
        'featured',
        'order',
        'category',
        'status',
        'thumbnail',
        'screenshots',
        'video_url',
        'demo_url',
        'repository_url',
        'start_date',
        'end_date',
        'team_size',
        'role',
    ];

    protected $casts = [
        'stack' => 'array',
        'featured' => 'boolean',
        'screenshots' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'team_size' => 'integer',
        'order' => 'integer',
    ];

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('created_at', 'desc');
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
