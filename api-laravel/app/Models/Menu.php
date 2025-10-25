<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $table = 'menu';
    protected $guarded = ['id'];
    protected $casts = ['akses' => 'string'];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
