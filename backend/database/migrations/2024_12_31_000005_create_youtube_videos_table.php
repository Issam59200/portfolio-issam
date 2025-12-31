<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('youtube_videos', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('video_id'); // ID YouTube (ex: odb8rPl6JTE)
            $table->string('video_url'); // URL complète
            $table->string('thumbnail')->nullable(); // Miniature locale ou URL YouTube
            $table->string('category')->default('essay'); // essay, tutorial, gaming, etc.
            $table->date('published_at')->nullable();
            $table->integer('views')->default(0);
            $table->integer('likes')->default(0);
            $table->boolean('featured')->default(false);
            $table->integer('order')->default(0);
            $table->json('tags')->nullable(); // ['IA', 'Fake News', 'Art', etc.]
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('youtube_videos');
    }
};
