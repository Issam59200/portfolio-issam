<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Ex: "React", "Laravel", "Montage vidéo"
            $table->string('category'); // frontend, backend, database, devops, design, montage, etc.
            $table->integer('level')->default(1); // 1-5 ou 1-100
            $table->string('icon')->nullable(); // Chemin vers icône
            $table->text('description')->nullable();
            $table->integer('years_experience')->nullable(); // Années d'expérience
            $table->boolean('featured')->default(false); // Mise en avant
            $table->integer('order')->default(0); // Ordre d'affichage
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
