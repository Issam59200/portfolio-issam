<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->text('description_en')->nullable()->after('description');
        });

        Schema::table('games', function (Blueprint $table) {
            $table->text('description_en')->nullable()->after('description');
        });

        Schema::table('youtube_videos', function (Blueprint $table) {
            $table->text('description_en')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('description_en');
        });
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn('description_en');
        });
        Schema::table('youtube_videos', function (Blueprint $table) {
            $table->dropColumn('description_en');
        });
    }
};
