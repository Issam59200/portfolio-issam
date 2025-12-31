<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = [
        'name',
        'category',
        'level',
        'icon',
        'description',
        'years_experience',
        'featured',
        'order',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'level' => 'integer',
        'years_experience' => 'integer',
        'order' => 'integer',
    ];

    // Scope pour les compétences mises en avant
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    // Scope pour trier par ordre
    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('name');
    }

    // Scope par catégorie
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}
