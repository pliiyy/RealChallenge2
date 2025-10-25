<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('role', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->enum('status',["AKTIF","NONAKTIF"])->default("AKTIF");
            $table->timestamps();
        });
        Schema::create('role_user', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained("user")->cascadeOnDelete();
            $table->foreignId('role_id')->constrained("role")->cascadeOnDelete();
            $table->primary(['user_id', 'role_id']);
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role');
        Schema::dropIfExists('role_user');
    }
};
