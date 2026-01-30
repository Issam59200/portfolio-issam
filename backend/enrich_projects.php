<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Project;

// Projet 1 - Simulation de Chargement
$p1 = Project::find(1);
$p1->detailed_description = '<h2>Contexte du Projet</h2>
<p>Ce projet universitaire en C avait pour objectif de développer un algorithme intelligent de chargement de conteneurs. Il simule le chargement optimal de colis de différentes tailles dans des conteneurs en maximisant l\'utilisation de l\'espace disponible.</p>

<h2>Problématiques Résolues</h2>
<p>Le défi principal était d\'optimiser l\'espace dans les conteneurs tout en respectant les contraintes de poids et de dimensions. L\'algorithme devait gérer différents types de colis (petits, moyens, grands) et calculer la meilleure disposition possible.</p>

<h2>Algorithmes Implémentés</h2>
<ul>
<li><strong>Algorithme Glouton</strong> : Pour une première approximation rapide du chargement</li>
<li><strong>Optimisation par Backtracking</strong> : Pour trouver la solution optimale en explorant toutes les possibilités</li>
<li><strong>Tri Préalable</strong> : Les colis sont triés par taille décroissante pour améliorer l\'efficacité</li>
</ul>

<h2>Fonctionnalités Développées</h2>
<ul>
<li>Lecture et parsing de fichiers de données contenant les dimensions des colis</li>
<li>Calcul automatique du nombre de conteneurs nécessaires</li>
<li>Visualisation ASCII du chargement dans le terminal</li>
<li>Statistiques détaillées : taux de remplissage, nombre de colis par conteneur</li>
<li>Gestion de la mémoire dynamique pour des listes de colis de taille variable</li>
</ul>

<h2>Résultats et Performance</h2>
<p>Le programme atteint un taux de remplissage moyen de 85% pour des ensembles de 100 colis variés. Il traite jusqu\'à 500 colis en moins de 2 secondes sur une machine standard.</p>';
$p1->save();
echo "Projet 1 mis à jour\n";

// Projet 2 - Bibliothèque de Tri
$p2 = Project::find(2);
$p2->detailed_description = '<h2>Vue d\'ensemble</h2>
<p>Bibliothèque complète en C implémentant les principaux algorithmes de tri avec analyse comparative des performances. Ce projet académique démontre une compréhension approfondie des structures de données et de la complexité algorithmique.</p>

<h2>Algorithmes Implémentés</h2>
<ul>
<li><strong>Tri à Bulles (Bubble Sort)</strong> : O(n²) - Simple mais inefficace pour de grands ensembles</li>
<li><strong>Tri par Insertion</strong> : O(n²) - Efficace pour les petits tableaux ou presque triés</li>
<li><strong>Tri par Sélection</strong> : O(n²) - Nombre minimal d\'échanges</li>
<li><strong>Tri Rapide (Quick Sort)</strong> : O(n log n) en moyenne - Très performant en pratique</li>
<li><strong>Tri Fusion (Merge Sort)</strong> : O(n log n) garanti - Stable et prévisible</li>
<li><strong>Tri par Tas (Heap Sort)</strong> : O(n log n) - Utilisation mémoire optimale</li>
</ul>

<h2>Fonctionnalités Avancées</h2>
<ul>
<li>Interface générique permettant de trier n\'importe quel type de données via des pointeurs de fonctions</li>
<li>Module de benchmarking mesurant le temps d\'exécution et le nombre de comparaisons</li>
<li>Génération automatique de jeux de données (aléatoires, triés, inversés)</li>
<li>Visualisation graphique des performances avec gnuplot</li>
<li>Tests unitaires pour valider la correction de chaque algorithme</li>
</ul>

<h2>Analyse Comparative</h2>
<p>Les tests montrent que Quick Sort est le plus rapide pour des tableaux de 10 000+ éléments, tandis que le tri par insertion excelle sur de petits tableaux (< 50 éléments). Merge Sort offre les meilleures performances garanties, idéal pour les données critiques.</p>';
$p2->save();
echo "Projet 2 mis à jour\n";

// Projet 3 - Système de Gestion de Base de Données
$p3 = Project::find(3);
$p3->detailed_description = '<h2>Description Complète</h2>
<p>Mini-SGBD développé en C permettant de créer, manipuler et interroger des bases de données relationnelles via une interface en ligne de commande. Ce projet implémente les concepts fondamentaux des systèmes de gestion de bases de données.</p>

<h2>Architecture du Système</h2>
<ul>
<li><strong>Moteur de Stockage</strong> : Gestion des fichiers, indexation B-tree, cache mémoire</li>
<li><strong>Parser SQL</strong> : Analyse lexicale et syntaxique des requêtes</li>
<li><strong>Optimiseur de Requêtes</strong> : Choix du meilleur plan d\'exécution</li>
<li><strong>Gestionnaire de Transactions</strong> : Support ACID de base</li>
</ul>

<h2>Commandes SQL Supportées</h2>
<ul>
<li>CREATE TABLE, DROP TABLE, ALTER TABLE</li>
<li>INSERT INTO, UPDATE, DELETE</li>
<li>SELECT avec WHERE, ORDER BY, GROUP BY</li>
<li>Jointures (INNER JOIN, LEFT JOIN)</li>
<li>Fonctions d\'agrégation (COUNT, SUM, AVG, MIN, MAX)</li>
</ul>

<h2>Optimisations Implémentées</h2>
<p>Le système utilise des index B-tree pour accélérer les recherches, un buffer pool pour minimiser les I/O disque, et un optimiseur de requêtes qui choisit entre scan séquentiel et recherche indexée selon les statistiques de la table.</p>

<h2>Performance</h2>
<p>Capable de gérer des tables de 100 000+ enregistrements avec des temps de réponse < 100ms pour les requêtes simples indexées. Les jointures sur deux tables de 10 000 lignes s\'exécutent en moins de 500ms.</p>';
$p3->save();
echo "Projet 3 mis à jour\n";

// Projet 4 - Shell Personnalisé
$p4 = Project::find(4);
$p4->detailed_description = '<h2>Présentation</h2>
<p>Interpréteur de commandes Unix complet développé en C, répliquant les fonctionnalités d\'un shell moderne comme Bash. Ce projet approfondit les concepts de processus, signaux et communication inter-processus.</p>

<h2>Fonctionnalités Principales</h2>
<ul>
<li><strong>Exécution de Commandes</strong> : Lancement de programmes externes avec fork() et execve()</li>
<li><strong>Pipes et Redirections</strong> : Support de | pour chaîner des commandes, > et < pour les redirections</li>
<li><strong>Variables d\'Environnement</strong> : export, unset, affichage avec $VARIABLE</li>
<li><strong>Commandes Intégrées</strong> : cd, pwd, echo, exit, history</li>
<li><strong>Gestion des Jobs</strong> : jobs, fg, bg pour le contrôle des processus en arrière-plan</li>
<li><strong>Signaux</strong> : Gestion de Ctrl+C, Ctrl+Z, Ctrl+D</li>
</ul>

<h2>Fonctionnalités Avancées</h2>
<ul>
<li>Auto-complétion via la touche Tab (fichiers et commandes)</li>
<li>Historique persistant des commandes (comme .bash_history)</li>
<li>Prompt personnalisable avec couleurs et informations Git</li>
<li>Support des wildcards (* et ?) pour l\'expansion de noms de fichiers</li>
<li>Exécution de scripts shell avec shebang</li>
</ul>

<h2>Défis Techniques</h2>
<p>La gestion correcte des pipes nécessite une compréhension fine des descripteurs de fichiers. La gestion des signaux sans créer de race conditions a été un défi majeur, résolu avec sigaction() et un gestionnaire de signaux robuste.</p>';
$p4->save();
echo "Projet 4 mis à jour\n";

echo "\nTous les projets ont été enrichis avec succès!\n";
