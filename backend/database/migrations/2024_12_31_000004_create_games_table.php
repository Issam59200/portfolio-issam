<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // "Autoclicker", "Jeu de plateforme", "Angry Birds Like"
            $table->text('description');
            $table->string('game_type'); // autoclicker, platformer, physics, etc.
            $table->string('technology'); // Unity, Godot, JavaScript, etc.
            $table->string('thumbnail')->nullable(); // Image principale
            $table->json('screenshots')->nullable(); // Autres images
            $table->string('video_url')->nullable(); // Lien vidéo de démo
            $table->string('play_url')->nullable(); // Lien pour jouer
            $table->string('repository_url')->nullable(); // GitHub
            $table->date('release_date')->nullable();
            $table->boolean('featured')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
