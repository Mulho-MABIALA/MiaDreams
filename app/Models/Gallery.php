<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'image',
        'caption',
        'collection_id',
        'brand_id',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
}
