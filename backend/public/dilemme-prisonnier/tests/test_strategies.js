import {
    RandomStrategy,
    ToujoursCoopererStrategy,
    ToujoursTrahirStrategy,
    CopierStrategy,
    TitForTatStrategy,
    GrudgerStrategy,
    DetectiveStrategy,
    PavlovStrategy,
    construireStrategy
} from '../js/core/strategie.js';

console.log("=== TESTS DES STRATÉGIES ===\n");

class HistoriqueTest {
    constructor() {
        this.tours = [];
    }
    ajouterTour(actionA, actionB) {
        this.tours.push({ actionA, actionB });
    }
}

/**
 * TEST 1 : Stratégies simples
 */
console.log("--- TEST 1 : Stratégies simples ---");
const cooperer = new ToujoursCoopererStrategy();
const trahir = new ToujoursTrahirStrategy();

const actionsC = Array(5).fill(0).map(() => cooperer.nextAction());
const actionsT = Array(5).fill(0).map(() => trahir.nextAction());

console.log(`ToujoursCooperer (5 tours) : ${actionsC.join(', ')}`);
console.log(`ToujoursTrahir (5 tours) : ${actionsT.join(', ')}`);
console.log(`Stratégies constantes OK : ${actionsC.every(a => a === 'C') && actionsT.every(a => a === 'T') ? 'OUI' : 'NON'}\n`);

/**
 * TEST 2 : RandomStrategy - Distribution
 */
console.log("--- TEST 2 : RandomStrategy ---");
const random = new RandomStrategy(12345);
const actionsRandom = Array(1000).fill(0).map(() => random.nextAction());
const nbC = actionsRandom.filter(a => a === 'C').length;
const pourcentC = (nbC / 1000) * 100;

console.log(`1000 actions : ${nbC} 'C' (${pourcentC.toFixed(1)}%), ${1000 - nbC} 'T' (${(100 - pourcentC).toFixed(1)}%)`);
console.log(`Distribution ~50/50 : ${Math.abs(pourcentC - 50) < 5 ? 'OUI' : 'NON'}\n`);

/**
 * TEST 3 : TitForTatStrategy
 */
console.log("--- TEST 3 : TitForTatStrategy ---");
const titfortat = new TitForTatStrategy();
const histo1 = new HistoriqueTest();

const premier = titfortat.nextAction({ historique: histo1, me: 'A' });
console.log(`Premier tour : ${premier} (attendu: C)`);

histo1.ajouterTour('C', 'C');
const copieC = titfortat.nextAction({ historique: histo1, me: 'A' });
console.log(`Après (C,C) → ${copieC} (copie C)`);

histo1.ajouterTour('C', 'T');
const copieT = titfortat.nextAction({ historique: histo1, me: 'A' });
console.log(`Après (C,T) → ${copieT} (copie T)`);
console.log(`TitForTat fonctionne : ${premier === 'C' && copieC === 'C' && copieT === 'T' ? 'OUI' : 'NON'}\n`);

/**
 * TEST 4 : GrudgerStrategy
 */
console.log("--- TEST 4 : GrudgerStrategy ---");
const grudger = new GrudgerStrategy();
const histo2 = new HistoriqueTest();

histo2.ajouterTour('C', 'C');
histo2.ajouterTour('C', 'C');
const grudgerCoopere = grudger.nextAction({ historique: histo2, me: 'A' });
console.log(`Après coopération → ${grudgerCoopere} (attendu: C)`);

histo2.ajouterTour('C', 'T'); // Adversaire trahit
const grudgerTrahit1 = grudger.nextAction({ historique: histo2, me: 'A' });
histo2.ajouterTour('T', 'C');
const grudgerTrahit2 = grudger.nextAction({ historique: histo2, me: 'A' });

console.log(`Après trahison → ${grudgerTrahit1}, puis ${grudgerTrahit2} (attendu: T, T)`);
console.log(`Grudger fonctionne : ${grudgerCoopere === 'C' && grudgerTrahit1 === 'T' && grudgerTrahit2 === 'T' ? 'OUI' : 'NON'}\n`);

/**
 * TEST 5 : PavlovStrategy (Win-Stay, Lose-Shift)
 */
console.log("--- TEST 5 : PavlovStrategy ---");
const pavlov = new PavlovStrategy();
const histo3 = new HistoriqueTest();

const pavlovPremier = pavlov.nextAction({ historique: histo3, me: 'A' });
console.log(`Premier tour : ${pavlovPremier} (attendu: C)`);

histo3.ajouterTour('C', 'C'); // Bon résultat
const winStay = pavlov.nextAction({ historique: histo3, me: 'A' });
console.log(`Après (C,C) bon résultat → ${winStay} (Win-Stay: C)`);

histo3.ajouterTour('C', 'T'); // Mauvais résultat
const loseShift = pavlov.nextAction({ historique: histo3, me: 'A' });
console.log(`Après (C,T) mauvais résultat → ${loseShift} (Lose-Shift: T)`);
console.log(`Pavlov fonctionne : ${pavlovPremier === 'C' && winStay === 'C' && loseShift === 'T' ? 'OUI' : 'NON'}\n`);

/**
 * TEST 6 : DetectiveStrategy
 */
console.log("--- TEST 6 : DetectiveStrategy ---");
const detective = new DetectiveStrategy();
const histo4 = new HistoriqueTest();

const sequence = [];
sequence.push(detective.nextAction({ historique: histo4, me: 'A' }));
histo4.ajouterTour('C', 'C');
sequence.push(detective.nextAction({ historique: histo4, me: 'A' }));
histo4.ajouterTour('T', 'C');
sequence.push(detective.nextAction({ historique: histo4, me: 'A' }));
histo4.ajouterTour('C', 'C');
sequence.push(detective.nextAction({ historique: histo4, me: 'A' }));

console.log(`Séquence de test : ${sequence.join(', ')} (attendu: C,T,C,C)`);

// Si adversaire n'a jamais trahi → exploite
histo4.ajouterTour('C', 'C');
const exploite = detective.nextAction({ historique: histo4, me: 'A' });
console.log(`Adversaire coopératif → ${exploite} (exploite: T)`);
console.log(`Detective fonctionne : ${sequence.join(',') === 'C,T,C,C' && exploite === 'T' ? 'OUI' : 'NON'}\n`);

/**
 * TEST 7 : CopierStrategy
 */
console.log("--- TEST 7 : CopierStrategy ---");
const copieur = new CopierStrategy();
const histo5 = new HistoriqueTest();

const copiePremier = copieur.nextAction({ historique: histo5, me: 'A' });
histo5.ajouterTour('C', 'T');
const copieT2 = copieur.nextAction({ historique: histo5, me: 'A' });

console.log(`Premier tour : ${copiePremier} (attendu: C par défaut)`);
console.log(`Après adversaire T → ${copieT2} (copie T)`);
console.log(`Copieur fonctionne : ${copiePremier === 'C' && copieT2 === 'T' ? 'OUI' : 'NON'}\n`);

/**
 * TEST 8 : Fonction construireStrategy
 */
console.log("--- TEST 8 : construireStrategy() ---");
const keys = ['cooperer', 'trahir', 'titfortat', 'grudger', 'pavlov', 'detective', 'copieur', 'aleatoire'];
console.log("Test de création pour 8 stratégies:");
keys.forEach(key => {
    const strat = construireStrategy(key, 12345);
    console.log(`  '${key}' → ${strat.constructor.name}`);
});

console.log("\n=== TOUS LES TESTS STRATÉGIES TERMINÉS ===");