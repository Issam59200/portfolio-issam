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
            'name' => 'Issam Admin',
            'email' => 'admin@portfolio.test',
            'password' => Hash::make('password'),
        ]);

        // Seeder les projets
        $this->call([
            ProjectSeeder::class,
        ]);
    }
}
