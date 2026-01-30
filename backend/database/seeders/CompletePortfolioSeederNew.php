<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\YouTubeVideo;

class CompletePortfolioSeederNew extends Seeder
{
    public function run(): void
    {
        // Clear existing data
        Project::truncate();
        YouTubeVideo::where('is_short', true)->delete();
        
        $this->seedProjects();
        $this->seedYouTubeShorts();
    }

    private function seedProjects()
    {
        $projects = [
            // PROJET 1: Simulation de Chargement de Conteneurs
            [
                'title' => 'Simulation de Chargement de Conteneurs',
                'description' => 'Application Java pour optimiser le chargement de conteneurs sur des porte-conteneurs avec algorithme génétique.',
                'detailed_description' => '<h2>Vue d\'ensemble</h2><p>Ce projet consiste en une simulation interactive de chargement de conteneurs maritimes développée en Java avec JavaFX. L\'application utilise des algorithmes génétiques pour optimiser le placement des conteneurs sur les navires porte-conteneurs.</p><h2>Fonctionnalités principales</h2><ul><li>Interface graphique intuitive développée avec JavaFX</li><li>Visualisation 3D des conteneurs sur le navire</li><li>Algorithme d\'optimisation par algorithmes génétiques</li><li>Gestion des contraintes de poids et d\'équilibre</li><li>Simulation du processus de chargement/déchargement</li></ul>',
                'category' => 'desktop',
                'status' => 'completed',
                'stack' => json_encode(['Java', 'JavaFX', 'Algorithmes Génétiques']),
                'objectives' => json_encode(['Optimiser le chargement de conteneurs', 'Respecter les contraintes de stabilité', 'Minimiser le temps de chargement']),
                'technologies_details' => json_encode(['Java 8+' => 'Langage principal', 'JavaFX' => 'Interface graphique', 'Algorithmes génétiques' => 'Optimisation']),
                'challenges' => json_encode(['Mise en œuvre des algorithmes génétiques', 'Gestion des contraintes multiples', 'Optimisation des performances']),
                'achievements' => json_encode(['Réduction de 30% du temps de chargement', 'Interface intuitive', 'Code modulaire et maintenable']),
                'thumbnail' => 'storage/projects/simulation-conteneurs.jpg',
                'screenshots' => json_encode([]),
                'start_date' => '2023-09-01',
                'end_date' => '2023-12-20',
                'team_size' => 1,
                'role' => 'Développeur principal',
                'featured' => true,
                'order' => 1
            ],
            // PROJET 2: Tri en C
            [
                'title' => 'Bibliothèque de Tri en C',
                'description' => 'Implémentation complète d\'algorithmes de tri et de manipulation de tableaux en langage C.',
                'detailed_description' => '<h2>Description</h2><p>Bibliothèque complète d\'algorithmes de tri développée en C avec accent sur l\'efficacité et la gestion mémoire.</p><h2>Algorithmes implémentés</h2><ul><li>Tri à bulles : O(n²)</li><li>Tri par insertion</li><li>Tri rapide (QuickSort) : O(n log n)</li><li>Tri fusion (MergeSort)</li><li>Tri par tas (HeapSort)</li></ul>',
                'category' => 'desktop',
                'status' => 'completed',
                'stack' => json_encode(['C', 'Make', 'GDB', 'Valgrind']),
                'objectives' => json_encode(['Maîtriser le langage C', 'Comprendre les algorithmes de tri', 'Optimiser les performances']),
                'technologies_details' => json_encode(['Langage C' => 'Programmation système', 'Makefile' => 'Compilation', 'Valgrind' => 'Détection fuites']),
                'challenges' => json_encode(['Gestion manuelle de la mémoire', 'Optimisation des performances', 'Éviter les fuites mémoire']),
                'achievements' => json_encode(['Tous algorithmes fonctionnels', 'Aucune fuite mémoire', 'Code bien documenté']),
                'thumbnail' => 'storage/projects/tri-c.jpg',
                'screenshots' => json_encode([]),
                'start_date' => '2024-02-01',
                'end_date' => '2024-03-15',
                'team_size' => 1,
                'role' => 'Développeur',
                'featured' => false,
                'order' => 5
            ],
            // PROJET 3: Base de données
            [
                'title' => 'Système de Gestion de Base de Données',
                'description' => 'Conception et implémentation d\'un système de gestion de base de données relationnelle avec SQL.',
                'detailed_description' => '<h2>Projet Base de Données</h2><p>Conception, modélisation et implémentation d\'une base de données relationnelle complète.</p><h2>Phases du projet</h2><ol><li>Analyse des besoins</li><li>Modélisation MCD</li><li>Implémentation SQL</li><li>Population des données</li><li>Requêtes complexes</li></ol><h2>Fonctionnalités SQL</h2><ul><li>Jointures complexes</li><li>Sous-requêtes corrélées</li><li>Triggers et procédures</li><li>Index pour optimisation</li></ul>',
                'category' => 'database',
                'status' => 'completed',
                'stack' => json_encode(['SQL', 'MySQL', 'phpMyAdmin', 'MCD/MLD']),
                'objectives' => json_encode(['Maîtriser la modélisation', 'Écrire requêtes SQL complexes', 'Optimiser performances']),
                'technologies_details' => json_encode(['MySQL' => 'SGBD relationnel', 'SQL' => 'Langage de requêtes', 'Modélisation' => 'MCD, MLD, MPD']),
                'challenges' => json_encode(['Normalisation des données', 'Optimisation des requêtes', 'Intégrité référentielle']),
                'achievements' => json_encode(['Base normalisée (3NF)', 'Requêtes optimisées', 'Documentation complète']),
                'thumbnail' => 'storage/projects/database.jpg',
                'screenshots' => json_encode([]),
                'start_date' => '2024-03-01',
                'end_date' => '2024-04-10',
                'team_size' => 1,
                'role' => 'Concepteur/Développeur',
                'featured' => false,
                'order' => 6
            ],
            // PROJET 4: Shell Custom
            [
                'title' => 'Shell Personnalisé en C',
                'description' => 'Développement d\'un interpréteur de commandes (shell) personnalisé en C avec gestion des processus.',
                'detailed_description' => '<h2>Shell Personnalisé</h2><p>Création d\'un shell complet en C avec toutes les fonctionnalités UNIX/Linux.</p><h2>Fonctionnalités</h2><ul><li>Exécution de commandes</li><li>Gestion des processus (fork, exec, wait)</li><li>Redirections I/O (>, <, >>)</li><li>Pipes (|)</li><li>Variables d\'environnement</li><li>Commandes internes (cd, exit, echo)</li><li>Historique</li><li>Auto-complétion</li></ul>',
                'category' => 'system',
                'status' => 'completed',
                'stack' => json_encode(['C', 'Linux', 'Processus', 'Système UNIX']),
                'objectives' => json_encode(['Comprendre processus UNIX', 'Maîtriser appels système', 'Gérer la concurrence']),
                'technologies_details' => json_encode(['Appels système' => 'fork, exec, wait, pipe', 'Signaux' => 'SIGINT, SIGTERM', 'Programmation C' => 'Pointeurs, structures']),
                'challenges' => json_encode(['Gestion processus zombies', 'Parsing commandes', 'Gestion erreurs système']),
                'achievements' => json_encode(['Shell fonctionnel et stable', 'Toutes fonctionnalités implémentées', 'Code robuste']),
                'thumbnail' => 'storage/projects/shell.jpg',
                'screenshots' => json_encode([]),
                'start_date' => '2024-10-01',
                'end_date' => '2024-12-15',
                'team_size' => 1,
                'role' => 'Développeur',
                'featured' => true,
                'order' => 2
            ],
            // PROJET 5: Symfony
            [
                'title' => 'Plateforme de Location/Vente Multimédia',
                'description' => 'Application web complète de gestion de location et vente de produits multimédias développée avec Symfony.',
                'detailed_description' => '<h2>Description</h2><p>Plateforme web complète permettant location et vente de produits multimédias (films, séries, jeux).</p><h2>Fonctionnalités principales</h2><ul><li>Gestion des utilisateurs : Inscription, connexion, profils</li><li>Catalogue de produits : Navigation par catégories</li><li>Système de location : Réservation, gestion retours, frais retard</li><li>Système de vente : Panier, commandes</li><li>Avis et notations</li><li>Panel d\'administration complet</li><li>Statistiques et rapports</li></ul><h2>Architecture</h2><p>Architecture MVC Symfony avec Doctrine ORM, Twig templates et Bootstrap.</p>',
                'category' => 'web',
                'status' => 'completed',
                'stack' => json_encode(['PHP', 'Symfony', 'Doctrine', 'MySQL', 'Twig', 'Bootstrap']),
                'objectives' => json_encode(['Maîtriser Symfony', 'Créer application full-stack', 'Gérer relations complexes BDD']),
                'technologies_details' => json_encode(['Symfony 6' => 'Framework PHP', 'Doctrine ORM' => 'Mapping objet-relationnel', 'Twig' => 'Moteur templates']),
                'challenges' => json_encode(['Gestion locations et retours', 'Calcul frais de retard', 'Système permissions']),
                'achievements' => json_encode(['Application complète', 'Interface responsive', 'Panel admin complet', 'Notifications email']),
                'thumbnail' => 'storage/projects/symfony-location.jpg',
                'screenshots' => json_encode([]),
                'start_date' => '2025-03-20',
                'end_date' => '2025-04-20',
                'team_size' => 1,
                'role' => 'Développeur Full-Stack',
                'featured' => true,
                'order' => 3,
                'report_pdf' => 'storage/reports/rapport-symfony.pdf'
            ],
            // PROJET 6: Dataviz Spotify
            [
                'title' => 'Dashboard de Visualisation Spotify',
                'description' => 'Projet de data visualization avec Power BI analysant un dataset Spotify avec 15+ visualisations interactives.',
                'detailed_description' => '<h2>Data Visualization - Spotify</h2><p>Dashboard interactif complet analysant un dataset Spotify avec techniques avancées de visualisation.</p><h2>Objectifs</h2><p>Créer 15+ visualisations pour analyser artistes, tracks, albums, popularité, caractéristiques audio.</p><h2>Visualisations créées</h2><ul><li>Statistiques artistes : Genres, top artistes</li><li>Statistiques tracks : Top 15 par artiste</li><li>Analyse albums : Top 10, sorties mensuelles</li><li>Popularité : Corrélation followers vs popularité</li><li>Contenu explicite : Proportion par genre</li><li>Analyse temporelle : Sorties mensuelles, durée moyenne</li></ul><h2>Insights</h2><ul><li>Sorties musicales : pic le vendredi</li><li>Durée moyenne : 7min (1960) → 3min (2020)</li><li>Genres dominants : soundtrack, pop</li><li>Taylor Swift : 300+ tracks</li></ul>',
                'category' => 'data',
                'status' => 'completed',
                'stack' => json_encode(['Power BI', 'DAX', 'Data Analysis', 'Data Visualization']),
                'objectives' => json_encode(['Maîtriser Power BI', 'Créer visualisations pertinentes', 'Découvrir insights']),
                'technologies_details' => json_encode(['Power BI Desktop' => 'Outil visualisation', 'DAX' => 'Langage formules', 'Dataset Spotify' => 'Données réelles']),
                'challenges' => json_encode(['Nettoyage dataset', 'Choix visualisations pertinentes', 'Optimisation performances']),
                'achievements' => json_encode(['15+ visualisations', 'Dashboard interactif', 'Insights intéressants', 'Design Spotify']),
                'thumbnail' => 'storage/projects/dataviz-spotify-75.png',
                'screenshots' => json_encode(['storage/projects/dataviz-spotify-76.png', 'storage/projects/dataviz-spotify-77.png', 'storage/projects/dataviz-spotify-78.png', 'storage/projects/dataviz-spotify-79.png', 'storage/projects/dataviz-spotify-80.png']),
                'start_date' => '2025-11-01',
                'end_date' => '2025-12-15',
                'team_size' => 1,
                'role' => 'Data Analyst',
                'featured' => true,
                'order' => 4
            ],
            // Projets existants
            [
                'title' => 'Arbre Phylogénétique',
                'description' => 'Application en C permettant de programmer et visualiser des arbres phylogénétiques à partir de données existantes.',
                'category' => 'desktop',
                'status' => 'completed',
                'stack' => json_encode(['C', 'Graphviz', 'Structures de données']),
                'video_url' => 'storage/projects/phylogenetic-tree.mp4',
                'featured' => true,
                'order' => 10
            ],
            [
                'title' => 'Site Médiathèque',
                'description' => 'Plateforme web de gestion de médiathèque avec système de prêt et de réservation.',
                'category' => 'web',
                'status' => 'completed',
                'stack' => json_encode(['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript']),
                'video_url' => 'storage/projects/mediatheque.mp4',
                'featured' => false,
                'order' => 11
            ],
            [
                'title' => 'Serveur/Client Chat en C',
                'description' => 'Application de chat en temps réel développée en C avec architecture client-serveur.',
                'category' => 'network',
                'status' => 'completed',
                'stack' => json_encode(['C', 'Sockets', 'TCP/IP', 'Multi-threading']),
                'featured' => false,
                'order' => 12
            ]
        ];
        
        foreach ($projects as $projectData) {
            Project::create($projectData);
        }
    }

    private function seedYouTubeShorts()
    {
        $videoIds = [
            'uA28zAxuj88', 'bFUCxWgyEOs', 'alkQmcEOlXc', 'KGuY00GUrvU',
            'F4sTiGyVupM', '2jJaa1Jc9bE', 'ON5WBzXVfCk', '6OgKCZ_ewS0',
            'Fdep5IZE2Pk', '7aKf9_G4QAU', 'z2WjLbv0gyY', 'fHXoSIuhmEE',
            'cP7i2fN1ZQ8', 'PnD2-e_4_0w', '85vAIsGyvSg', 'm04Y3ECrAGo',
            'd6NJ5HxFjl0', 'ntFs6_AVRXU', 'LKaBeDZBl_8'
        ];

        foreach ($videoIds as $index => $videoId) {
            YouTubeVideo::create([
                'title' => 'Short YouTube #' . ($index + 1),
                'description' => 'Court contenu vidéo YouTube',
                'video_id' => $videoId,
                'video_url' => 'https://youtube.com/shorts/' . $videoId,
                'thumbnail' => 'https://img.youtube.com/vi/' . $videoId . '/maxresdefault.jpg',
                'category' => 'shorts',
                'is_short' => true,
                'duration_seconds' => 60,
                'published_at' => now(),
                'featured' => false,
                'order' => $index + 1
            ]);
        }
    }
}
