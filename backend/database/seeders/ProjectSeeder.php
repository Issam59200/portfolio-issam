<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
                'title' => 'Portfolio Personnel',
                'description' => 'Site portfolio fullstack avec Laravel (API REST) et React (Vite). Authentification via Sanctum, gestion de projets et formulaire de contact.',
                'stack' => ['Laravel', 'React', 'Vite', 'MySQL', 'Sanctum'],
                'link' => null,
                'github' => 'https://github.com/Issam59200/portfolio-issam',
                'image' => null,
                'featured' => true,
                'order' => 1,
            ],
            [
                'title' => 'API REST Laravel',
                'description' => 'API RESTful complète avec authentification JWT, CRUD, pagination et validation des données.',
                'stack' => ['Laravel', 'PHP', 'MySQL', 'JWT'],
                'link' => null,
                'github' => null,
                'image' => null,
                'featured' => true,
                'order' => 2,
            ],
            [
                'title' => 'Application React SPA',
                'description' => 'Single Page Application moderne avec React Router, state management et composants réutilisables.',
                'stack' => ['React', 'JavaScript', 'CSS3', 'React Router'],
                'link' => null,
                'github' => null,
                'image' => null,
                'featured' => false,
                'order' => 3,
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
