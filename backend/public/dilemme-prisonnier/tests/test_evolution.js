import { Evolution } from '../js/core/evolution.js'
import { Payoff } from '../js/core/gain.js';

console.log("=== TESTS DE LA CLASSE EVOLUTION ===\n");

/**
 * TEST 1 : Création et configuration
*/
console.log("--- TEST 1 : Création et configuration ---");
const config = {
    populationInitiale: {
        'titfortat': 5,
        'grudger': 3,
        'trahir': 2,
        'cooperer': 5
    },
    manchesParMatch: 10,
    eliminationParGen: 2,
    reproductionParGen: 2,
    generations: 10,
    bruit: 0,
    payoff: new Payoff({ R: 3, T: 5, S: 0, P: 1 })
};

const evolution = new Evolution(config);

console.log("Instance créée avec succès");
console.log("Population initiale:", evolution.populationInitiale);
console.log("Nombre de générations:", evolution.generations);
console.log("");

/**
 * TEST 2 : Exécution de la simulation (10 générations)
 */
console.log("--- TEST 2 : Exécution sur 10 générations ---");
console.log("Lancement de la simulation...\n");

const historique = evolution.executer();

console.log("\n Simulation terminée");
console.log("Nombre de générations dans l'historique:", historique.length);
console.log("(devrait être 11 : génération 0 + 10 générations)\n");

/**
 * TEST 3 : Validation de l'historique
 */
console.log("--- TEST 3 : Validation de l'historique ---");

// Vérifier que l'historique contient 11 entrées (0 à 10)
if (historique.length === 11) {
    console.log("Historique contient bien 11 générations");
} else {
    console.log(`ERREUR : Historique contient ${historique.length} générations au lieu de 11`);
}

// Vérifier la structure de chaque génération
const genTest = historique[0];
const champsRequis = ['generation', 'population', 'scoresMoyens', 'populationTotale', 'strategieDominante'];
const champsPresents = champsRequis.every(champ => champ in genTest);

if (champsPresents) {
    console.log("Structure des données correcte");
} else {
    console.log("ERREUR : Structure des données incomplète");
}

console.log("\nExemple de génération 0:");
console.log(JSON.stringify(historique[0], null, 2));
console.log("");

/**
 * TEST 4 : Validation de la convergence
 */
console.log("--- TEST 4 : Analyse de la convergence ---");

// Afficher l'évolution de la population
console.log("\nÉvolution de la population par génération:");
console.log("Gen | TitForTat | Grudger | Trahir | Cooperer | Dominante");
console.log("----|-----------|---------|--------|----------|----------");

for (const gen of historique) {
    const pop = gen.population;
    console.log(
        `${gen.generation.toString().padStart(3)} | ` +
        `${(pop.titfortat || 0).toString().padStart(9)} | ` +
        `${(pop.grudger || 0).toString().padStart(7)} | ` +
        `${(pop.trahir || 0).toString().padStart(6)} | ` +
        `${(pop.cooperer || 0).toString().padStart(8)} | ` +
        `${gen.strategieDominante || 'N/A'}`
    );
}

// Analyser si une stratégie domine à la fin
const derniere = historique[historique.length - 1];
const popFinale = derniere.population;
const total = derniere.populationTotale;

console.log("\nRésultats finaux:");
console.log(`Population totale: ${total}`);
console.log(`Stratégie dominante: ${derniere.strategieDominante}`);
console.log(`Répartition finale:`, popFinale);

// Vérifier si convergence (une stratégie > 70% de la population)
const maxPourcentage = Math.max(...Object.values(popFinale)) / total;
if (maxPourcentage > 0.7) {
    console.log(`Convergence détectée : ${(maxPourcentage * 100).toFixed(1)}% de la population`);
} else {
    console.log(`Pas de convergence nette après ${evolution.generations} générations`);
}

console.log("");

/**
 * TEST 5 : Évolution des scores moyens
 */
console.log("--- TEST 5 : Évolution des scores moyens ---");

console.log("\nScores moyens par génération (générations avec scores):");
for (const gen of historique) {
    if (gen.generation > 0 && Object.keys(gen.scoresMoyens).length > 0) {
        console.log(`Génération ${gen.generation}:`, 
            Object.entries(gen.scoresMoyens)
                .map(([strat, score]) => `${strat}: ${score.toFixed(1)}`)
                .join(', ')
        );
    }
}

console.log("");

/**
 * TEST 6 : Export des statistiques (format JSON)
 */
console.log("--- TEST 6 : Export des statistiques ---");

const stats = {
    config: {
        populationInitiale: config.populationInitiale,
        generations: config.generations,
        manchesParMatch: config.manchesParMatch,
        eliminationParGen: config.eliminationParGen,
        reproductionParGen: config.reproductionParGen
    },
    resultats: {
        populationFinale: derniere.population,
        strategieDominante: derniere.strategieDominante,
        populationTotale: derniere.populationTotale,
        convergence: maxPourcentage > 0.7
    },
    historique: historique
};

console.log("Statistiques exportables (format JSON)");
console.log("Taille des données:", JSON.stringify(stats).length, "caractères");
console.log("");

/**
 * TEST 7 : Test avec population déséquilibrée
 */
console.log("--- TEST 7 : Test avec population déséquilibrée ---");

const configDesequilibre = {
    populationInitiale: {
        'titfortat': 1,
        'grudger': 1,
        'trahir': 23
    },
    manchesParMatch: 10,
    eliminationParGen: 2,
    reproductionParGen: 2,
    generations: 20,
    bruit: 0,
    payoff: new Payoff()
};

const evolutionDesequilibre = new Evolution(configDesequilibre);
const historiqueDesequilibre = evolutionDesequilibre.executer();

const finaleDesequilibre = historiqueDesequilibre[historiqueDesequilibre.length - 1];
console.log("\nPopulation initiale: 1 TitForTat, 1 Grudger, 23 Trahir");
console.log(`Population finale (génération ${finaleDesequilibre.generation}):`, finaleDesequilibre.population);
console.log(`Stratégie dominante finale: ${finaleDesequilibre.strategieDominante}`);

console.log("");

console.log("=== TOUS LES TESTS TERMINÉS ===");
