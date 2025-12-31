<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        $games = [
            [
                'title' => 'Autoclicker Game',
                'description' => 'Jeu d\'autoclicker interactif développé pour apprendre les mécaniques de jeu incrémentales. Le joueur collecte des ressources automatiquement et peut acheter des améliorations pour progresser plus rapidement. Interface intuitive avec système de progression et d\'achievements.',
                'game_type' => 'idle',
                'technology' => 'JavaScript, HTML5, CSS3',
                'thumbnail' => 'storage/games/Jeux.JPG',
                'screenshots' => ['storage/games/Jeux.JPG'],
                'video_url' => null,
                'play_url' => null,
                'repository_url' => null,
                'release_date' => '2023-12-15',
                'featured' => true,
                'order' => 1,
            ],
            [
                'title' => 'Jeu de Plateforme 2D',
                'description' => 'Platformer 2D avec physique réaliste et level design créatif. Le joueur doit naviguer à travers différents niveaux avec des obstacles, des ennemis et des puzzles. Système de collectibles et de checkpoints. Développé avec un moteur de jeu moderne et des assets personnalisés.',
                'game_type' => 'platformer',
                'technology' => 'Unity, C#',
                'thumbnail' => 'storage/games/Jeux 2.JPG',
                'screenshots' => ['storage/games/Jeux 2.JPG', 'storage/games/Jeux 2.1.JPG', 'storage/games/Jeux 2.2.JPG'],
                'video_url' => null,
                'play_url' => null,
                'repository_url' => null,
                'release_date' => '2024-05-20',
                'featured' => true,
                'order' => 2,
            ],
            [
                'title' => 'Angry Birds Like',
                'description' => 'Clone d\'Angry Birds mettant l\'accent sur la physique. Le joueur utilise une fronde pour lancer des projectiles et détruire des structures. Moteur physique avancé avec destructions réalistes, différents types de projectiles avec des capacités uniques, et système de score basé sur la destruction et l\'efficacité.',
                'game_type' => 'physics',
                'technology' => 'Godot Engine, GDScript',
                'thumbnail' => 'storage/games/Jeux 3.JPG',
                'screenshots' => ['storage/games/Jeux 3.JPG'],
                'video_url' => null,
                'play_url' => null,
                'repository_url' => null,
                'release_date' => '2024-12-10',
                'featured' => true,
                'order' => 3,
            ],
        ];

        foreach ($games as $game) {
            Game::create($game);
        }
    }
}
