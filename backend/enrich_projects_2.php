<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Project;

// Projet 7 - Arbre Phylogénétique
$p7 = Project::find(7);
$p7->detailed_description = '<h2>Introduction</h2>
<p>Outil scientifique en C pour la construction et l\'analyse d\'arbres phylogénétiques. Ce projet combine bioinformatique et algorithmique pour visualiser les relations évolutives entre espèces.</p>

<h2>Méthodes Implémentées</h2>
<ul>
<li><strong>UPGMA</strong> : Méthode de clustering hiérarchique simple et rapide</li>
<li><strong>Neighbor-Joining</strong> : Algorithme plus précis ne supposant pas une évolution constante</li>
<li><strong>Maximum de Parcimonie</strong> : Recherche de l\'arbre nécessitant le minimum de mutations</li>
</ul>

<h2>Fonctionnalités</h2>
<ul>
<li>Lecture de matrices de distances au format PHYLIP</li>
<li>Calcul automatique de l\'arbre optimal selon la méthode choisie</li>
<li>Export au format Newick pour visualisation dans des logiciels spécialisés</li>
<li>Génération de visualisations ASCII dans le terminal</li>
<li>Calcul de statistiques (hauteur de l\'arbre, distances moyennes)</li>
</ul>

<h2>Applications</h2>
<p>Cet outil permet d\'analyser les relations entre séquences ADN, protéines ou caractères morphologiques. Il a été testé sur des jeux de données réels de vertébrés et de bactéries.</p>';
$p7->save();

// Projet 8 - Site Médiathèque
$p8 = Project::find(8);
$p8->detailed_description = '<h2>Vue d\'ensemble</h2>
<p>Application web complète en PHP/Laravel pour la gestion d\'une médiathèque municipale. Interface moderne permettant la gestion des emprunts, réservations et catalogue multimédia.</p>

<h2>Fonctionnalités Utilisateurs</h2>
<ul>
<li><strong>Catalogue en Ligne</strong> : Recherche avancée par titre, auteur, genre, ISBN avec filtres multiples</li>
<li><strong>Compte Personnel</strong> : Historique d\'emprunts, réservations en cours, suggestions personnalisées</li>
<li><strong>Système de Réservation</strong> : Mise en attente automatique si livre emprunté, notifications par email</li>
<li><strong>Prolongation en Ligne</strong> : Extension de la durée d\'emprunt sous conditions</li>
<li><strong>Avis et Notations</strong> : Système de reviews communautaire</li>
</ul>

<h2>Panneau d\'Administration</h2>
<ul>
<li>Gestion du catalogue (ajout, modification, suppression d\'œuvres)</li>
<li>Gestion des utilisateurs et des abonnements</li>
<li>Traitement des emprunts et retours avec scanner de codes-barres</li>
<li>Statistiques détaillées (œuvres populaires, taux d\'occupation, retards)</li>
<li>Export de rapports en PDF et Excel</li>
</ul>

<h2>Technologies et Architecture</h2>
<p>Construit sur Laravel 11 avec Eloquent ORM, système d\'authentification Breeze, API RESTful pour application mobile future, jobs en arrière-plan pour les notifications, cache Redis pour performances.</p>

<h2>Sécurité</h2>
<p>Validation stricte des entrées, protection CSRF, hashage bcrypt des mots de passe, limitation des tentatives de connexion, logs d\'audit pour toutes les actions administratives.</p>';
$p8->save();

// Projet 9 - Serveur/Client Chat
$p9 = Project::find(9);
$p9->detailed_description = '<h2>Description</h2>
<p>Application de messagerie instantanée en temps réel développée en C avec programmation socket. Architecture client-serveur permettant la communication simultanée de multiples utilisateurs.</p>

<h2>Architecture Réseau</h2>
<ul>
<li><strong>Serveur Multi-thread</strong> : Gestion concurrente de 100+ clients avec pthread</li>
<li><strong>Protocole TCP</strong> : Garantit la fiabilité et l\'ordre des messages</li>
<li><strong>Sérialisation</strong> : Format binaire compact pour les échanges</li>
</ul>

<h2>Fonctionnalités Implémentées</h2>
<ul>
<li><strong>Salons de Discussion</strong> : Création et gestion de channels multiples</li>
<li><strong>Messages Privés</strong> : Communication 1-to-1 chiffrée</li>
<li><strong>Liste des Utilisateurs</strong> : Affichage en temps réel des connectés</li>
<li><strong>Historique</strong> : Sauvegarde et chargement des conversations</li>
<li><strong>Commandes</strong> : /join, /leave, /msg, /list, /help</li>
</ul>

<h2>Sécurité</h2>
<ul>
<li>Authentification par login/mot de passe haché (SHA-256)</li>
<li>Chiffrement optionnel des messages avec AES-256</li>
<li>Protection contre le flood et les attaques par déni de service</li>
<li>Timeouts et déconnexions automatiques</li>
</ul>

<h2>Performance et Scalabilité</h2>
<p>Le serveur peut gérer 500+ clients simultanés sur une machine standard grâce à l\'utilisation de select() pour le multiplexing I/O. La latence moyenne est < 10ms en réseau local.</p>';
$p9->save();

echo "Projets 7, 8, 9 enrichis!\n";
