<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class YouTubeVideo extends Model
{
    protected $table = 'youtube_videos';

    protected $fillable = [
        'title',
        'description',
        'video_id',
        'video_url',
        'thumbnail',
        'category',
        'published_at',
        'views',
        'likes',
        'featured',
        'order',
        'tags',
    ];

    protected $casts = [
        'published_at' => 'date',
        'views' => 'integer',
        'likes' => 'integer',
        'featured' => 'boolean',
        'order' => 'integer',
        'tags' => 'array',
    ];

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('published_at', 'desc');
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Accessor pour l'URL de la miniature YouTube par défaut
    public function getYoutubeThumbnailAttribute()
    {
        return "https://img.youtube.com/vi/{$this->video_id}/maxresdefault.jpg";
    }
}
