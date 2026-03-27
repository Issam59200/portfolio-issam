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
            $table->string('title_en')->nullable()->after('title');
            $table->string('role_en')->nullable()->after('role');
            $table->text('technologies_details_en')->nullable()->after('technologies_details');
        });
        Schema::table('youtube_videos', function (Blueprint $table) {
            $table->string('title_en')->nullable()->after('title');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['title_en', 'role_en', 'technologies_details_en']);
        });
        Schema::table('youtube_videos', function (Blueprint $table) {
            $table->dropColumn('title_en');
        });
    }
};
