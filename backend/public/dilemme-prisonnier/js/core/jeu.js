import { Payoff } from './gain.js';
import { RNG } from './RNG.js';
import { Agent } from './agent.js';

/**
 * Un tour de jeu avec actions et gains
 */
export class Turn {
	/**
	 * @param {number} index - Numéro du tour
	 * @param {string} actionA - 'C' ou 'T'
	 * @param {string} actionB - 'C' ou 'T'
	 * @param {Payoff} payoff - Matrice des gains
	 */
	constructor(index, actionA, actionB, payoff) {
		this.index = index;
		this.actionA = actionA;
		this.actionB = actionB;
		const g = payoff.gain(actionA, actionB);
		this.gainA = g.a;
		this.gainB = g.b;
	}
}

/**
 * Historique d'un duel avec tous les tours et scores
 */
export class Historique {
	constructor() {
		this.tours = [];
		this.totalA = 0;
		this.totalB = 0;
		this.agentA = null;
		this.agentB = null;
	}

	/** @param {Turn} tour */
	ajouter(tour) {
		this.tours.push(tour);
		this.totalA += tour.gainA;
		this.totalB += tour.gainB;
	}

	/** @returns {string} Dernière action de A */
	dernierActionA() {
		return this.tours.length ? this.tours[this.tours.length - 1].actionA : 'C';
	}
	
	/** @returns {string} Dernière action de B */
	dernierActionB() {
		return this.tours.length ? this.tours[this.tours.length - 1].actionB : 'C';
	}

	/** @returns {Object} {A, B} scores cumulés */
	cumulScores() {
		const cumulA = [];
		const cumulB = [];
		let ca = 0, cb = 0;
		for (const t of this.tours) {
			ca += t.gainA; cb += t.gainB;
			cumulA.push(ca); cumulB.push(cb);
		}
		return { A: cumulA, B: cumulB };
	}
}

/**
 * Simule un duel entre deux stratégies
 * @param {Object} strategyA - Stratégie A
 * @param {Object} strategyB - Stratégie B
 * @param {Payoff} payoff - Matrice des gains
 * @param {number} manches - Nombre de tours (défaut: 10)
 * @param {number} bruit - % de bruit (défaut: 0)
 * @param {number} seed - Graine aléatoire
 * @returns {Historique} Historique complet
 */
export function simulerDuel({
 strategyA,
 strategyB,
 payoff = new Payoff(),
 manches = 10,
 bruit = 0,
 seed = Date.now()
}) {
  const rng = new RNG(seed);
  const historique = new Historique();
  
  // Créer deux agents à partir des stratégies fournies
  const agentA = new Agent('A', strategyA);
  const agentB = new Agent('B', strategyB);
  
  for (let i = 0; i < manches; i++) {
   let a = agentA.choisirAction({ historique, me: 'A', opponent: 'B' });
   let b = agentB.choisirAction({ historique, me: 'B', opponent: 'A' });

   // Application du bruit (inversion de l'action) avec probabilité bruit/100
  const p = bruit / 100;
  if (rng.chance(p)) a = a === 'C' ? 'T' : 'C';
  if (rng.chance(p)) b = b === 'C' ? 'T' : 'C';
  const turn = new Turn(i, a, b, payoff);
   historique.ajouter(turn);
   
   // Mettre à jour les scores des agents
   agentA.ajouterGain(turn.gainA);
   agentB.ajouterGain(turn.gainB);
  }

  // Attacher les agents au retour pour affichage
  historique.agentA = agentA;
  historique.agentB = agentB;
  
 return historique;
}