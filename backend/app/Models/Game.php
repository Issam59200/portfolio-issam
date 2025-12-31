<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $fillable = [
        'title',
        'description',
        'game_type',
        'technology',
        'thumbnail',
        'screenshots',
        'video_url',
        'play_url',
        'repository_url',
        'release_date',
        'featured',
        'order',
    ];

    protected $casts = [
        'screenshots' => 'array',
        'release_date' => 'date',
        'featured' => 'boolean',
        'order' => 'integer',
    ];

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('release_date', 'desc');
    }
}
