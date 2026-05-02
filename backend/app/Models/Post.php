<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'category', 'author', 'excerpt',
        'content', 'image', 'reading_time', 'is_featured',
        'is_published', 'published_at',
    ];

    protected $casts = [
        'is_featured'  => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    // Slugify auto
    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }
        });
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                     ->whereNotNull('published_at')
                     ->orderByDesc('published_at');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // Accessors
    public function getReadingTimeTextAttribute(): string
    {
        return $this->reading_time . ' min de lecture';
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
