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
        Schema::create('biodata', function (Blueprint $table) {
            $table->id();
            $table->string("nim_nidn")->unique();
            $table->string("nama");
            $table->text("deskripsi")->nullable();
            $table->string("no_telepon")->nullable();
            $table->enum("jenis_kelamin",["L","P"])->nullable();
            $table->enum("agama",["I","H","B","C","P","K"])->nullable();
            $table->string("alamat")->nullable();
            $table->string("kel_id")->nullable();
            $table->string("kec_id")->nullable();
            $table->string("kab_id")->nullable();
            $table->string("prov_id")->nullable();
            $table->foreignId('user_id')->constrained("user")->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biodata');
    }
};
