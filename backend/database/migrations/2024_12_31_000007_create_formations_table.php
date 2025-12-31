<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->string('school'); // Établissement
            $table->string('degree'); // Diplôme (DUT, Licence, Master, etc.)
            $table->string('field'); // Domaine d'études
            $table->string('location')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('current')->default(false);
            $table->text('description')->nullable();
            $table->json('skills_acquired')->nullable(); // Compétences acquises
            $table->string('logo')->nullable();
            $table->string('grade')->nullable(); // Mention
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formations');
    }
};
