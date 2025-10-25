<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'role';
    protected $guarded = ['id'];

    public function user()
    {   
        return $this->belongsToMany(User::class, 'role_user', 'role_id', 'user_id');
    }

    public function menu()
    {
        return $this->hasMany(Menu::class,'role_id');
    }
}
