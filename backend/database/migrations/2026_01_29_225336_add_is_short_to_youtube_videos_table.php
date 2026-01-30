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
        Schema::table('youtube_videos', function (Blueprint $table) {
            $table->boolean('is_short')->default(false)->after('video_url');
            $table->integer('duration_seconds')->nullable()->after('is_short');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('youtube_videos', function (Blueprint $table) {
            $table->dropColumn(['is_short', 'duration_seconds']);
        });
    }
};
