<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    protected $fillable = [
        'school',
        'degree',
        'field',
        'location',
        'start_date',
        'end_date',
        'current',
        'description',
        'skills_acquired',
        'logo',
        'grade',
        'order',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'current' => 'boolean',
        'skills_acquired' => 'array',
        'order' => 'integer',
    ];

    public function scopeCurrent($query)
    {
        return $query->where('current', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('start_date', 'desc');
    }

    // Accessor pour la période
    public function getPeriodAttribute()
    {
        $start = $this->start_date->format('Y');
        
        if ($this->current) {
            return $start . ' - Présent';
        }
        
        $end = $this->end_date ? $this->end_date->format('Y') : 'Présent';
        return $start . ' - ' . $end;
    }
}
