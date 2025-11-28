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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('stack')->nullable(); // Technologies utilisées
            $table->string('link')->nullable(); // URL du projet
            $table->string('github')->nullable(); // Lien GitHub
            $table->string('image')->nullable(); // Image du projet
            $table->boolean('featured')->default(false); // Mis en avant
            $table->integer('order')->default(0); // Ordre d'affichage
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
