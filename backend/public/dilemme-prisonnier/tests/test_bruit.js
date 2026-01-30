import { RNG } from '../js/core/RNG.js';

console.log("=== TESTS DU SYSTÈME DE BRUIT (RNG) ===\n");

/**
 * TEST 1 : Reproductibilité avec seed
 */
console.log("--- TEST 1 : Reproductibilité ---");
const rng1 = new RNG(12345);
const rng2 = new RNG(12345);

const seq1 = [rng1.next(), rng1.next(), rng1.next()];
const seq2 = [rng2.next(), rng2.next(), rng2.next()];

const identiques = seq1.every((v, i) => v === seq2[i]);
console.log(`Seed 12345 produit séquences identiques : ${identiques ? 'OUI' : 'NON'}`);
console.log(`Séquence 1 : ${seq1.map(v => v.toFixed(6)).join(', ')}`);
console.log(`Séquence 2 : ${seq2.map(v => v.toFixed(6)).join(', ')}\n`);

/**
 * TEST 2 : Distribution uniforme
 */
console.log("--- TEST 2 : Distribution uniforme ---");
const rngDistrib = new RNG(42);
const valeurs = [];
for (let i = 0; i < 10000; i++) {
    valeurs.push(rngDistrib.next());
}

const moyenne = valeurs.reduce((sum, v) => sum + v, 0) / 10000;
const toutesValides = valeurs.every(v => v >= 0 && v < 1);

console.log(`10000 échantillons générés`);
console.log(`Toutes les valeurs dans [0,1) : ${toutesValides ? 'OUI' : 'NON'}`);
console.log(`Moyenne : ${moyenne.toFixed(4)} (attendu: ~0.5000)`);
console.log(`Écart acceptable : ${Math.abs(moyenne - 0.5) < 0.02 ? 'OUI' : 'NON'}\n`);

/**
 * TEST 3 : Méthode chance() - Probabilités extrêmes
 */
console.log("--- TEST 3 : chance() - Probabilités 0%, 100%, 5% ---");

// Bruit 0%
const rng0 = new RNG(100);
let compte0 = 0;
for (let i = 0; i < 1000; i++) {
    if (rng0.chance(0)) compte0++;
}
console.log(`Probabilité 0% : ${compte0}/1000 erreurs (attendu: 0)`);

// Bruit 100%
const rng100 = new RNG(200);
let compte100 = 0;
for (let i = 0; i < 1000; i++) {
    if (rng100.chance(1)) compte100++;
}
console.log(`Probabilité 100% : ${compte100}/1000 erreurs (attendu: 1000)`);

// Bruit 5%
const rng5 = new RNG(300);
let compte5 = 0;
for (let i = 0; i < 10000; i++) {
    if (rng5.chance(0.05)) compte5++;
}
const pourcent5 = (compte5 / 10000) * 100;
console.log(`Probabilité 5% : ${compte5}/10000 erreurs (${pourcent5.toFixed(2)}%)`);
console.log(`Écart acceptable : ${Math.abs(pourcent5 - 5) < 0.5 ? 'OUI' : 'NON'}\n`);

/**
 * TEST 4 : Application du bruit (inversion d'action)
 */
console.log("--- TEST 4 : Simulation d'inversion d'action ---");

function appliquerBruit(action, proba, rng) {
    return rng.chance(proba) ? (action === 'C' ? 'T' : 'C') : action;
}

const rngInv = new RNG(400);
let inversions = 0;
for (let i = 0; i < 10000; i++) {
    const actionFinale = appliquerBruit('C', 0.05, rngInv);
    if (actionFinale === 'T') inversions++;
}

const tauxInv = (inversions / 10000) * 100;
console.log(`Action 'C' avec bruit 5% : ${inversions}/10000 inversions (${tauxInv.toFixed(2)}%)`);
console.log(`Taux correct : ${Math.abs(tauxInv - 5) < 0.5 ? 'OUI' : 'NON'}\n`);

/**
 * TEST 5 : Seeds différentes
 */
console.log("--- TEST 5 : Seeds différentes ---");
const rngA = new RNG(1000);
const rngB = new RNG(2000);

const seqA = [rngA.next(), rngA.next(), rngA.next()];
const seqB = [rngB.next(), rngB.next(), rngB.next()];

const differentes = !seqA.every((v, i) => v === seqB[i]);
console.log(`Seed 1000 : ${seqA.map(v => v.toFixed(6)).join(', ')}`);
console.log(`Seed 2000 : ${seqB.map(v => v.toFixed(6)).join(', ')}`);
console.log(`Séquences différentes : ${differentes ? 'OUI' : 'NON'}\n`);

console.log("=== TOUS LES TESTS BRUIT TERMINÉS ===");