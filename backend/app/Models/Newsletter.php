<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Newsletter extends Model
{
    use HasFactory;
    protected $fillable = ['email']; //On cite toutes les colonnes
    //protected $guarded =[];  //inserer toutes les valeurs sauf celles du tableau
}
