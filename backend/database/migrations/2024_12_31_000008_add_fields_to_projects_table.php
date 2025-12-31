<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'category')) {
                $table->string('category')->after('description')->default('web'); // web, mobile, game, desktop
            }
            if (!Schema::hasColumn('projects', 'status')) {
                $table->string('status')->after('category')->default('completed'); // in-progress, completed, archived
            }
            if (!Schema::hasColumn('projects', 'thumbnail')) {
                $table->string('thumbnail')->nullable()->after('image');
            }
            if (!Schema::hasColumn('projects', 'screenshots')) {
                $table->json('screenshots')->nullable()->after('thumbnail'); // Images supplémentaires
            }
            if (!Schema::hasColumn('projects', 'video_url')) {
                $table->string('video_url')->nullable()->after('screenshots'); // Vidéo de démo
            }
            if (!Schema::hasColumn('projects', 'demo_url')) {
                $table->string('demo_url')->nullable()->after('video_url'); // Demo live
            }
            if (!Schema::hasColumn('projects', 'repository_url')) {
                $table->string('repository_url')->nullable()->after('demo_url'); // GitHub
            }
            if (!Schema::hasColumn('projects', 'start_date')) {
                $table->date('start_date')->nullable()->after('repository_url');
            }
            if (!Schema::hasColumn('projects', 'end_date')) {
                $table->date('end_date')->nullable()->after('start_date');
            }
            if (!Schema::hasColumn('projects', 'team_size')) {
                $table->integer('team_size')->nullable()->after('end_date'); // Nombre de personnes
            }
            if (!Schema::hasColumn('projects', 'role')) {
                $table->string('role')->nullable()->after('team_size'); // Rôle dans le projet
            }
            if (!Schema::hasColumn('projects', 'order')) {
                $table->integer('order')->default(0)->after('featured');
            }
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'category', 'status', 'thumbnail', 'screenshots', 'video_url',
                'demo_url', 'repository_url', 'start_date', 'end_date',
                'team_size', 'role', 'order'
            ]);
        });
    }
};
