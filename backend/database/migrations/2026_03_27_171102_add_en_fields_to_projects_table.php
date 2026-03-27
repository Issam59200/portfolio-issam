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
        Schema::table('projects', function (Blueprint $table) {
            $table->text('objectives_en')->nullable()->after('objectives');
            $table->text('challenges_en')->nullable()->after('challenges');
            $table->text('achievements_en')->nullable()->after('achievements');
            $table->text('detailed_description_en')->nullable()->after('detailed_description');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['objectives_en', 'challenges_en', 'achievements_en', 'detailed_description_en']);
        });
    }
};
