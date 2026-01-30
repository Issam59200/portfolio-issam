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
            $table->longText('detailed_description')->nullable()->after('description');
            $table->json('objectives')->nullable()->after('detailed_description');
            $table->json('technologies_details')->nullable()->after('objectives');
            $table->json('challenges')->nullable()->after('technologies_details');
            $table->json('achievements')->nullable()->after('challenges');
            $table->string('report_pdf')->nullable()->after('achievements');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['detailed_description', 'objectives', 'technologies_details', 'challenges', 'achievements', 'report_pdf']);
        });
    }
};
