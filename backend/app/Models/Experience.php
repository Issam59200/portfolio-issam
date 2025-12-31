<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = [
        'company',
        'position',
        'location',
        'type',
        'start_date',
        'end_date',
        'current',
        'description',
        'technologies',
        'achievements',
        'logo',
        'website',
        'order',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'current' => 'boolean',
        'technologies' => 'array',
        'achievements' => 'array',
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

    // Accessor pour la durée
    public function getDurationAttribute()
    {
        $start = $this->start_date;
        $end = $this->current ? now() : $this->end_date;
        
        if (!$end) {
            return null;
        }

        $diff = $start->diff($end);
        $years = $diff->y;
        $months = $diff->m;

        if ($years > 0 && $months > 0) {
            return "{$years} an" . ($years > 1 ? 's' : '') . " {$months} mois";
        } elseif ($years > 0) {
            return "{$years} an" . ($years > 1 ? 's' : '');
        } else {
            return "{$months} mois";
        }
    }
}
