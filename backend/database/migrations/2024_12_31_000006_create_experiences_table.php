<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('company'); // Nom de l'entreprise
            $table->string('position'); // Poste occupé
            $table->string('location')->nullable(); // Ville, pays
            $table->string('type'); // cdi, cdd, stage, freelance, projet
            $table->date('start_date');
            $table->date('end_date')->nullable(); // Null si en cours
            $table->boolean('current')->default(false); // Toujours en poste
            $table->text('description'); // Missions et responsabilités
            $table->json('technologies')->nullable(); // Technologies utilisées
            $table->json('achievements')->nullable(); // Réalisations clés
            $table->string('logo')->nullable(); // Logo entreprise
            $table->string('website')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};
