import { simulerDuel } from './jeu.js';
import { Payoff } from './gain.js';
import { construireStrategy } from './strategie.js';

/**
 * Tournoi round-robin entre stratégies
 */
class Tournament {
    /**
     * @param {Array<string>} strategyKeys - Stratégies participantes
     * @param {number} manches - Tours par match
     * @param {number} bruit - % de bruit
     * @param {Object} payoffValues - Gains {R, T, P, S}
     */
    constructor(config) {
        this.strategyKeys = config.strategyKeys;
        this.manches = config.manches;
        this.bruit = config.bruit || 0;
        this.payoff = new Payoff(config.payoffValues || {});
        this.resultats = [];
        this.matriceScores = {};
    }

    /** @returns {Object} Résultats complets */
    jouerTournoi() {
        console.log("Début du tournoi");
        this.initialiserResultats();
        this.jouerTousLesMatches();
        const classement = this.calculerClassement();

        return {
            classement: classement,
            matriceScores: this.matriceScores,
            detailsMatches: this.resultats
        };
    }

    /** Initialise les structures de données */
    initialiserResultats() {
        for (const key of this.strategyKeys) {
            const strat = construireStrategy(key);
            const nom = strat.constructor.name;
            this.matriceScores[nom] = {
                scoreTotal: 0,
                victoires: 0,
                defaites:0,
                matchsNuls: 0,
                adversaires: {}
            };
        }
        console.log("Résultats initialisés pour", Object.keys(this.matriceScores));
    }

    /** Exécute tous les matchs round-robin */
    jouerTousLesMatches() {
        const nbStrategies = this.strategyKeys.length;
        console.log(`${nbStrategies} stratégies, ${(nbStrategies * (nbStrategies))/2} matches à jouer`);

        for (let i = 0; i < nbStrategies; i++) {
            for (let j = i+1; j < nbStrategies; j++) {
                const keyA = this.strategyKeys[i];
                const keyB = this.strategyKeys[j];
                this.jouerMatch(keyA, keyB);
            }
        }
        console.log("Tous les matches sont terminés");
    }

    /** @param {string} keyA, keyB */
    jouerMatch(keyA, keyB) {
        const stratA = construireStrategy(keyA);
        const stratB = construireStrategy(keyB);
        const nomA = stratA.constructor.name;
        const nomB = stratB.constructor.name;
        console.log(`Match: ${nomA} vs ${nomB}`);

        const resultat = simulerDuel({
            strategyA: stratA,
            strategyB: stratB,
            manches: this.manches,
            payoff: this.payoff,
            bruit: this.bruit
        });

        const scoreA = resultat.totalA;
        const scoreB = resultat.totalB;

        console.log(`  → Scores: ${scoreA} - ${scoreB}`);

        // Mettre à jour les scores
        this.matriceScores[nomA].scoreTotal += scoreA;
        this.matriceScores[nomB].scoreTotal += scoreB;

        // Victoires/Défaites
        if (scoreA > scoreB) {
            this.matriceScores[nomA].victoires++;
            this.matriceScores[nomB].defaites++;
        } else if (scoreA < scoreB) {
            this.matriceScores[nomB].victoires++;
            this.matriceScores[nomA].defaites++;
        } else {
            this.matriceScores[nomA].matchsNuls++;
            this.matriceScores[nomB].matchsNuls++;
        }

        // Scores par adversaire
        this.matriceScores[nomA].adversaires[nomB] = scoreA;
        this.matriceScores[nomB].adversaires[nomA] = scoreB;

        // Détail du match
        this.resultats.push({
            stratA: nomA,
            stratB: nomB,
            scoreA: scoreA,
            scoreB: scoreB,
            vainqueur: scoreA > scoreB ? nomA : (scoreB > scoreA ? nomB : 'Match nul')
        });
    }

    /** @returns {Array} Classement trié */
    calculerClassement() {
        const classement = [];

        for (const [nom, stats] of Object.entries(this.matriceScores)) {
            classement.push({
                strategie: nom,
                scoreTotal: stats.scoreTotal,
                victoires: stats.victoires,
                defaites: stats.defaites,
                matchsNuls: stats.matchsNuls,
                scoreMoyen: stats.scoreTotal / (this.strategyKeys.length -1)
            });
        }
        classement.sort((a, b) => b.scoreTotal - a.scoreTotal);

        classement.forEach((entry, index) => {
            entry.rang = index + 1;
        });
        return classement;
    }
}
export { Tournament }; 