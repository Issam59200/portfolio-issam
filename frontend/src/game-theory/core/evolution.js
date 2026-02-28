import { simulerDuel } from './jeu.js';
import { Payoff } from './gain.js';
import { construireStrategy } from './strategie.js';

/**
 * Classe gérant l'évolution d'une population de stratégies sur plusieurs générations
 * Utilise un algorithme génétique avec tournoi, sélection et reproduction
 */
class Evolution {
    /**
     * Crée une instance de simulation évolutive
     * @param {Object} config - Configuration de la simulation
     * @param {Object} config.populationInitiale - Population de départ {strategie: nombre}
     * @param {number} config.manchesParMatch - Nombre de manches par match (défaut: 100)
     * @param {number} config.eliminationParGen - Nombre d'agents éliminés par génération (défaut: 3)
     * @param {number} config.reproductionParGen - Nombre d'agents reproduits par génération (défaut: 3)
     * @param {number} config.generations - Nombre total de générations (défaut: 50)
     * @param {number} config.bruit - Pourcentage de bruit dans les actions (défaut: 5)
     * @param {Payoff} config.payoff - Matrice des gains (défaut: nouveau Payoff)
     */
    constructor(config) {
        // Configuration du tournoi par génération
        this.populationInitiale = config.populationInitiale;
        this.manchesParMatch = config.manchesParMatch || 100;
        this.eliminationParGen = config.eliminationParGen || 3;
        this.reproductionParGen = config.reproductionParGen || 3;
        this.generations = config.generations || 50;
        this.bruit = config.bruit || 5;
        this.payoff = config.payoff || new Payoff();

        // État de l'évolution
        this.populationCourante = { ...this.populationInitiale }; // Copie de la population de départ
        this.generationActuelle = 0;
        this.historique = []; // Stocke les stats de chaque génération
    }

    /**
     * Exécute la simulation complète sur N générations
     * @returns {Array} Historique complet de toutes les générations
     */
    executer() {
        // Sauvegarder l'état initial (génération 0)
        this.sauvegarderGeneration();
        
        // Boucle sur toutes les générations
        for (let i = 0; i < this.generations; i++) {
            const scoresMoyens = this.executerGeneration();
            this.sauvegarderGeneration(scoresMoyens);
            this.generationActuelle++;
        }
        
        return this.historique;
    }

    /**
     * Exécute une génération complète : tournoi, sélection, reproduction
     * @returns {Object} Scores moyens par stratégie
     */
    executerGeneration() {
        const agents = this.creerAgents();
        this.jouerTournoi(agents);
        const scoresMoyens = this.calculerScoresMoyens(agents);
        this.trierAgents(agents);
        const survivants = this.selectionner(agents);
        this.reproduire(survivants);
        this.mettreAJourPopulation(survivants);
        
        return scoresMoyens;
    }

    /**
     * Crée tous les agents à partir de la population courante
     * @returns {Array} Tableau d'agents
     */
    creerAgents() {
        const agents = [];
        for (const [strategie, nombre] of Object.entries(this.populationCourante)) {
            for (let i = 0; i < nombre; i++) {
                agents.push({ strategie, score: 0 });
            }
        }
        console.log(`Génération ${this.generationActuelle}: ${agents.length} agents créés`);
        return agents;
    }

    /**
     * Fait jouer un tournoi round-robin entre tous les agents
     * @param {Array} agents - Tableau d'agents
     */
    jouerTournoi(agents) {
        for (let i = 0; i < agents.length; i++) {
            for (let j = i + 1; j < agents.length; j++) {
                const stratA = construireStrategy(agents[i].strategie);
                const stratB = construireStrategy(agents[j].strategie);
                
                const resultat = simulerDuel({
                    strategyA: stratA,
                    strategyB: stratB,
                    payoff: this.payoff,
                    manches: this.manchesParMatch,
                    bruit: this.bruit,
                    seed: Date.now() + i * 1000 + j
                });
                
                agents[i].score += resultat.totalA;
                agents[j].score += resultat.totalB;
            }
        }
        console.log(`Tournoi terminé`);
    }

    /**
     * Calcule les scores moyens par stratégie
     * @param {Array} agents - Tableau d'agents avec leurs scores
     * @returns {Object} Scores moyens par stratégie
     */
    calculerScoresMoyens(agents) {
        const scoresMoyens = {};
        const compteurs = {};
        
        // Initialiser
        for (const strategie of Object.keys(this.populationCourante)) {
            scoresMoyens[strategie] = 0;
            compteurs[strategie] = 0;
        }
        
        // Accumuler les scores
        for (const agent of agents) {
            scoresMoyens[agent.strategie] += agent.score;
            compteurs[agent.strategie]++;
        }
        
        // Calculer les moyennes
        for (const strategie of Object.keys(scoresMoyens)) {
            if (compteurs[strategie] > 0) {
                scoresMoyens[strategie] /= compteurs[strategie];
            }
        }
        
        console.log('Scores moyens:', scoresMoyens);
        return scoresMoyens;
    }

    /**
     * Trie les agents par score décroissant (meilleurs en premier)
     * @param {Array} agents - Tableau d'agents à trier
     */
    trierAgents(agents) {
        agents.sort((a, b) => b.score - a.score);
        console.log(`Agent le plus performant: ${agents[0].strategie} (${agents[0].score} pts)`);
        console.log(`Agent le moins performant: ${agents[agents.length-1].strategie} (${agents[agents.length-1].score} pts)`);
    }

    /**
     * Sélectionne les meilleurs agents (élimine les moins performants)
     * @param {Array} agents - Tableau d'agents triés
     * @returns {Array} Tableau des survivants
     */
    selectionner(agents) {
        const nombreAEliminer = Math.min(this.eliminationParGen, agents.length);
        const nombreSurvivants = agents.length - nombreAEliminer;
        const survivants = agents.slice(0, nombreSurvivants);
        
        console.log(`${nombreAEliminer} agents éliminés, ${survivants.length} survivants`);
        return survivants;
    }

    /**
     * Reproduit les meilleurs agents (clonage)
     * @param {Array} survivants - Tableau des agents survivants
     */
    reproduire(survivants) {
        const nombreSurvivants = survivants.length;
        const nombreAReproduire = Math.min(this.reproductionParGen, nombreSurvivants);
        
        for (let i = 0; i < nombreAReproduire; i++) {
            const indexParent = i % nombreSurvivants;
            const parent = survivants[indexParent];
            survivants.push({ strategie: parent.strategie, score: 0 });
        }
        
        console.log(`${nombreAReproduire} agents reproduits, population finale: ${survivants.length}`);
    }

    /**
     * Met à jour la population courante à partir des survivants
     * @param {Array} survivants - Tableau des agents survivants après reproduction
     */
    mettreAJourPopulation(survivants) {
        const nouvellePopulation = {};
        
        // Initialiser à 0 pour toutes les stratégies possibles
        for (const strategie of Object.keys(this.populationCourante)) {
            nouvellePopulation[strategie] = 0;
        }
        
        // Compter les survivants par stratégie
        for (const agent of survivants) {
            nouvellePopulation[agent.strategie]++;
        }
        
        // Mettre à jour
        this.populationCourante = nouvellePopulation;
        console.log('Nouvelle population:', this.populationCourante);
    }

    /**
     * Sauvegarde l'état actuel de la génération dans l'historique
     * @param {Object} scoresMoyens - Scores moyens par stratégie
     */
    sauvegarderGeneration(scoresMoyens = {}) {
        // Calculer la population totale
        const populationTotale = Object.values(this.populationCourante)
            .reduce((sum, nombre) => sum + nombre, 0);
        
        // Trouver la stratégie dominante (celle avec le plus d'agents)
        let strategieDominante = null;
        let maxAgents = 0;
        
        for (const [strategie, nombre] of Object.entries(this.populationCourante)) {
            if (nombre > maxAgents) {
                maxAgents = nombre;
                strategieDominante = strategie;
            }
        }
        
        // Créer l'objet stats de cette génération
        const stats = {
            generation: this.generationActuelle,
            population: { ...this.populationCourante },
            scoresMoyens: scoresMoyens,
            populationTotale: populationTotale,
            strategieDominante: strategieDominante
        };
        
        // Ajouter à l'historique
        this.historique.push(stats);
    }

}
export {Evolution};

/**
 * État global de la simulation pour l'interface utilisateur
 */
export let population = {};
export let generation = 0;
export let historique = [];
export let manchesParMatch = 10;

/**
 * Initialise la population de départ avec 23 coopérateurs, 1 tit-for-tat et 1 traître
 */
export function initialiser() {
    population = {
        cooperer: 23,
        titfortat: 1,
        trahir: 1
    };
    generation = 0;
    historique = [{ generation: 0, population: { ...population } }];
}

/**
 * Simule une nouvelle génération : tournoi round-robin, sélection des 70% meilleurs et reproduction
 */
export function nouvelleGeneration() {
    const agents = [];
    
    // Créer tous les agents
    for (const [cle, nombre] of Object.entries(population)) {
        for (let i = 0; i < nombre; i++) {
            agents.push({ strategie: cle, score: 0 });
        }
    }
    
    // Tournoi round-robin
    const payoff = new Payoff({ R: 3, T: 5, P: 1, S: 0 });
    for (let i = 0; i < agents.length; i++) {
        for (let j = i + 1; j < agents.length; j++) {
            const stratA = construireStrategy(agents[i].strategie);
            const stratB = construireStrategy(agents[j].strategie);
            
            const resultat = simulerDuel({
                strategyA: stratA,
                strategyB: stratB,
                payoff: payoff,
                manches: manchesParMatch,
                bruit: 0,
                seed: Date.now() + i * 1000 + j
            });
            
            agents[i].score += resultat.totalA;
            agents[j].score += resultat.totalB;
        }
    }
    
    // Trier par score
    agents.sort((a, b) => b.score - a.score);
    
    // Sélection : garder 70% meilleurs
    const nombreAGarder = Math.ceil(agents.length * 0.7);
    const survivants = agents.slice(0, nombreAGarder);
    
    // Reproduction : dupliquer les meilleurs
    const nombreAReproduire = agents.length - nombreAGarder;
    for (let i = 0; i < nombreAReproduire; i++) {
        const parent = survivants[i % Math.ceil(nombreAGarder * 0.3)];
        survivants.push({ strategie: parent.strategie, score: 0 });
    }
    
    // Reconstituer la population
    const nouvellePopulation = {
        cooperer: 0,
        titfortat: 0,
        trahir: 0
    };
    
    for (const agent of survivants) {
        nouvellePopulation[agent.strategie]++;
    }
    
    // Calculer les scores moyens par stratégie avant la fin de génération
    const scoresMoyens = {};
    const compteurs = { cooperer: 0, titfortat: 0, trahir: 0 };
    for (const agent of agents) {
        scoresMoyens[agent.strategie] = (scoresMoyens[agent.strategie] || 0) + agent.score;
        compteurs[agent.strategie]++;
    }
    for (const strat of ['cooperer', 'titfortat', 'trahir']) {
        if (compteurs[strat] > 0) {
            scoresMoyens[strat] = scoresMoyens[strat] / compteurs[strat];
        } else {
            scoresMoyens[strat] = 0;
        }
    }
    
    population = nouvellePopulation;
    generation++;
    historique.push({ generation: generation, population: { ...population }, scoresMoyens: scoresMoyens });
}

/**
 * Calcule et retourne le nombre total d'agents dans la population actuelle
 * @returns {number} Somme de tous les agents
 */
export function getPopulationTotale() {
    return population.cooperer + population.titfortat + population.trahir;
}

/**
 * Configure le nombre de manches par match
 * @param {number} manches - Nombre de rounds par match
 */
export function setManchesParMatch(manches) {
    manchesParMatch = Math.max(1, Math.floor(manches));
}
