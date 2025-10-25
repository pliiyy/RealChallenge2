<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Menu;
use App\Models\Biodata;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $role = Role::firstOrCreate([
            "nama" => "Developer",
            "status" => "AKTIF"
        ]);
        $menus = [
            [
                "nama" => "Dashboard",
                "path" => "/",
                "akses" => "lihat",
                "role_id" => $role->id
            ],
            [
                "nama" => "Data Role",
                "path" => "/role",
                "akses" => "lihat,tambah,edit,hapus",
                "role_id" => $role->id
            ],
            [
                "nama" => "Data Pengguna",
                "path" => "/user",
                "akses" => "lihat,tambah,edit,hapus",
                "role_id" => $role->id
            ]
        ];
        foreach ($menus as $m) {
            Menu::create($m);
        }

        $user = User::create([
            'email' => 'developer@gmail.com',
            'password' => Hash::make('Tsani182'),
            "status" => "AKTIF"
        ]);
        $user->role()->sync($role->id);
        Biodata::create([
            "nim_nidn" => "0010101",
            "nama" => "Developer",
            "user_id" => $user->id
        ]);
    }
}
