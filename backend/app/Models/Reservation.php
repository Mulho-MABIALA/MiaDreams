<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'phone', 'service',
        'preferred_date', 'preferred_time',
        'message', 'status', 'is_read',
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'is_read'        => 'boolean',
    ];

    public static function services(): array
    {
        return [
            'coaching'          => 'Coaching personnel',
            'personal-branding' => 'Personal Branding',
            'fashion-program'   => 'Fashion Program',
            'confection'        => 'Confection sur mesure',
            'consulting'        => 'Consulting mode',
            'autre'             => 'Autre demande',
        ];
    }
}
