import { Tournament } from '../js/core/tournoi.js';

console.log("=== TEST SIMPLE DU TOURNOI ===\n");

const config = {
    strategyKeys: ['titfortat', 'grudger', 'trahir'],
    manches: 10,
    bruit: 0,
    payoffValues: { R: 3, T: 5, P: 1, S: 0 }
};

console.log("Configuration:", config);
console.log("\n--- Lancement du tournoi ---\n");

const tournoi = new Tournament(config);
const resultats = tournoi.jouerTournoi();

console.log("\n=== CLASSEMENT FINAL ===\n");
resultats.classement.forEach(entry => {
    console.log(`${entry.rang}. ${entry.strategie} - Score: ${entry.scoreTotal}`);
});