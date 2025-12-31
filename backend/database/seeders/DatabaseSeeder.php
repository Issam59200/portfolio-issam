<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer un utilisateur admin par défaut
        User::create([
            'name' => 'Issam Atrari',
            'email' => 'admin@portfolio.test',
            'password' => Hash::make('password'),
        ]);

        // Seeder tous les contenus
        $this->call([
            EnhancedProjectSeeder::class,
            SkillSeeder::class,
            GameSeeder::class,
            YouTubeVideoSeeder::class,
        ]);
    }
}
