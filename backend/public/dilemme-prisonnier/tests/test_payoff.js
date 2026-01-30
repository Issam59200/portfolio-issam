import { Payoff } from '../js/core/gain.js';

console.log("=== TESTS DE LA CLASSE PAYOFF ===\n");

/**
 * TEST 1 : Création et validation des contraintes
 */
console.log("--- TEST 1 : Création et validation ---");
const payoffDefaut = new Payoff();
console.log("Valeurs par défaut: R=3, T=5, P=1, S=0");
console.log(`Valeurs obtenues: R=${payoffDefaut.R}, T=${payoffDefaut.T}, P=${payoffDefaut.P}, S=${payoffDefaut.S}`);

const contrainteOrdre = payoffDefaut.T > payoffDefaut.R && payoffDefaut.R > payoffDefaut.P && payoffDefaut.P > payoffDefaut.S;
const contrainteItere = 2 * payoffDefaut.R > payoffDefaut.T + payoffDefaut.S;
console.log(`Contrainte T > R > P > S : ${contrainteOrdre ? 'OK' : 'ERREUR'}`);
console.log(`Contrainte 2R > T + S : ${contrainteItere ? 'OK' : 'ERREUR'}\n`);

/**
 * TEST 2 : Méthode gain() - Les 4 cas possibles
 */
console.log("--- TEST 2 : Calcul des gains ---");
const gainCC = payoffDefaut.gain('C', 'C');
const gainTT = payoffDefaut.gain('T', 'T');
const gainTC = payoffDefaut.gain('T', 'C');
const gainCT = payoffDefaut.gain('C', 'T');

console.log(`gain(C,C) = {a: ${gainCC.a}, b: ${gainCC.b}} (attendu: {3, 3})`);
console.log(`gain(T,T) = {a: ${gainTT.a}, b: ${gainTT.b}} (attendu: {1, 1})`);
console.log(`gain(T,C) = {a: ${gainTC.a}, b: ${gainTC.b}} (attendu: {5, 0})`);
console.log(`gain(C,T) = {a: ${gainCT.a}, b: ${gainCT.b}} (attendu: {0, 5})`);

const gainsOK = gainCC.a === 3 && gainTT.a === 1 && gainTC.a === 5 && gainCT.a === 0;
console.log(`Tous les gains corrects : ${gainsOK ? 'OUI' : 'NON'}\n`);

/**
 * TEST 3 : Symétrie et valeurs personnalisées
 */
console.log("--- TEST 3 : Symétrie et personnalisation ---");
const symetrie = gainTC.a === gainCT.b && gainTC.b === gainCT.a;
console.log(`Symétrie respectée : ${symetrie ? 'OUI' : 'NON'}`);

const payoffCustom = new Payoff({ R: 4, T: 6, P: 2, S: 1 });
console.log(`Payoff personnalisé créé : R=${payoffCustom.R}, T=${payoffCustom.T}, P=${payoffCustom.P}, S=${payoffCustom.S}\n`);

console.log("=== TOUS LES TESTS PAYOFF TERMINÉS ===");