<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Podcast extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'episode_number', 'season', 'description',
        'thumbnail', 'duration', 'audio_url', 'spotify_url',
        'apple_url', 'youtube_url', 'guest', 'is_published', 'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true)->orderByDesc('episode_number');
    }

    public function getEpisodeLabelAttribute(): string
    {
        $s = $this->season ? 'S' . $this->season . ' ' : '';
        return $s . 'EP.' . str_pad($this->episode_number, 2, '0', STR_PAD_LEFT);
    }

    public function getFormattedDateAttribute(): string
    {
        if (!$this->published_at) return '';
        $months = ['', 'Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin',
                   'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
        return $this->published_at->day . ' ' .
               $months[$this->published_at->month] . ' ' .
               $this->published_at->year;
    }
}
