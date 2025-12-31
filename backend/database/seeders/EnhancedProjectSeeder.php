<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class EnhancedProjectSeeder extends Seeder
{
    public function run(): void
    {
        // Supprimer les anciens projets de démo si existants
        Project::truncate();

        $projects = [
            [
                'title' => 'Arbre Phylogénétique',
                'description' => 'Application en C permettant de programmer et visualiser des arbres phylogénétiques à partir de données existantes. Implémentation d\'algorithmes de reconstruction phylogénétique, parsing de fichiers de données biologiques, et génération de représentations graphiques des arbres. Projet académique démontrant la maîtrise des structures de données complexes et de la programmation système.',
                'stack' => ['C', 'Structures de données', 'Algorithmes', 'Bioinformatique'],
                'link' => null,
                'github' => null,
                'image' => null,
                'featured' => true,
                'order' => 1,
                'category' => 'desktop',
                'status' => 'completed',
                'thumbnail' => null,
                'screenshots' => [],
                'video_url' => 'storage/projects/phylogenetic-tree.mp4',
                'demo_url' => null,
                'repository_url' => null,
                'start_date' => '2023-09-01',
                'end_date' => '2023-12-15',
                'team_size' => 2,
                'role' => 'Développeur principal',
            ],
            [
                'title' => 'Site Médiathèque',
                'description' => 'Plateforme web complète pour la gestion d\'une médiathèque permettant la vente et la location de films, séries et jeux vidéo. Système de gestion des stocks, catalogue avec recherche avancée, panier d\'achat, gestion des locations (dates, retours, pénalités), espace client avec historique, et panneau d\'administration pour la gestion du catalogue et des utilisateurs. Interface utilisateur moderne et responsive.',
                'stack' => ['PHP', 'MySQL', 'JavaScript', 'Bootstrap', 'HTML/CSS'],
                'link' => null,
                'github' => null,
                'image' => null,
                'featured' => true,
                'order' => 2,
                'category' => 'web',
                'status' => 'completed',
                'thumbnail' => null,
                'screenshots' => [],
                'video_url' => 'storage/projects/mediatheque.mp4',
                'demo_url' => null,
                'repository_url' => null,
                'start_date' => '2024-02-01',
                'end_date' => '2024-05-30',
                'team_size' => 3,
                'role' => 'Full-stack Developer',
            ],
            [
                'title' => 'Serveur/Client Chat en C',
                'description' => 'Application de communication client-serveur développée en C permettant à plusieurs clients de communiquer entre eux via un serveur central. Implémentation de sockets TCP/IP, gestion multi-threading pour supporter plusieurs connexions simultanées, protocole de communication personnalisé, gestion des salles de chat, et commandes de modération. Projet démontrant la maîtrise de la programmation réseau et de la gestion de la concurrence.',
                'stack' => ['C', 'Sockets TCP/IP', 'Multi-threading', 'Réseau', 'POSIX'],
                'link' => null,
                'github' => null,
                'image' => null,
                'featured' => true,
                'order' => 3,
                'category' => 'desktop',
                'status' => 'completed',
                'thumbnail' => null,
                'screenshots' => [],
                'video_url' => null,
                'demo_url' => null,
                'repository_url' => null,
                'start_date' => '2024-03-15',
                'end_date' => '2024-06-10',
                'team_size' => 2,
                'role' => 'Lead Developer',
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
