import { RNG } from './RNG.js';

/**
 * Interface attendue pour toutes les stratégies :
 * strategy.nextAction({ historique, me, opponent }) -> 'C' | 'T'
 */

/**
 * Stratégie aléatoire 50/50
 */
export class RandomStrategy {
	/** @param {number} seed */
	constructor(seed = Date.now()) {
		this.rng = new RNG(seed);
	}
	
	/** @returns {string} 'C' ou 'T' */
	nextAction() {
		return this.rng.chance(0.5) ? 'C' : 'T';
	}
}

/**
 * Coopère systématiquement
 */
export class ToujoursCoopererStrategy {
	nextAction() {
		return 'C';
	}
}

/**
 * Trahit systématiquement
 */
export class ToujoursTrahirStrategy {
	nextAction() {
		return 'T';
	}
}

/**
 * Copie la dernière action de l'adversaire
 */
// export class CopierStrategy {
// 	nextAction({ historique, me }) {
// 		if (!historique || historique.tours.length === 0) return 'C';
// 		const last = historique.tours[historique.tours.length - 1];
// 		return me === 'A' ? last.actionB : last.actionA;
// 	}
// }

/**
 * Coopère au premier tour puis copie l'adversaire (Tit-for-Tat)
 */
export class TitForTatStrategy {
	nextAction({ historique, me}) {
		if (!historique || historique.tours.length === 0) {
			return 'C';
		}
		const last = historique.tours[historique.tours.length -1];
		return me === 'A' ? last.actionB : last.actionA;
	}
}

/**
 * Coopère jusqu'à la première trahison, puis trahit pour toujours
 */
export class GrudgerStrategy {
	nextAction ({ historique, me}) {
		const aTrahi = historique.tours.some((turn) => {
			const oppAction = me === 'A' ? turn.actionB : turn.actionA;
			return oppAction === 'T';
		});
		if (aTrahi) {
			return 'T';
		}
		return 'C';
	}
}

/**
 * Teste l'adversaire avec C,T,C,C puis exploite ou joue Tit-for-Tat
 */
export class DetectiveStrategy {
	nextAction({ historique, me }) {
		const t = historique.tours.length;
		if (t === 0) return 'C';
		if (t === 1) return 'T';
		if (t === 2) return 'C';
		if (t === 3) return 'C';

		const aTrahi = historique.tours.some((turn) => {
			const oppAction = me === 'A' ? turn.actionB : turn.actionA;
			return oppAction === 'T';
		});

		if (!aTrahi) {
			return 'T';
		}

		const last = historique.tours[historique.tours.length - 1];
		return me === 'A' ? last.actionB : last.actionA;
	}
}

/**
 * Win-Stay Lose-Shift : répète si bon résultat, change sinon
 */
export class PavlovStrategy {
	nextAction({ historique, me }) {
		if (historique.tours.length === 0) {
			return 'C';
		}
		const last = historique.tours[historique.tours.length -1];
		const monAction = me === 'A' ? last.actionA : last.actionB;
		const oppAction = me === 'A' ? last.actionB : last.actionA;

		let bonResultat = false;

		if (monAction === 'C' && oppAction === 'C') {
			bonResultat = true;
		} else if (monAction === 'T' && oppAction ==='C') {
			bonResultat = true;
		}

		if (bonResultat) {
			return monAction;
		} else {
			return monAction === 'C' ? 'T' : 'C';
		}
	}
}

/**
 * Crée une instance de stratégie à partir d'une clé
 * @param {string} key - 'aleatoire', 'cooperer', 'trahir', etc.
 * @param {number} seed - Graine aléatoire
 * @returns {Object} Instance de stratégie
 */
export function construireStrategy(key, seed = Date.now()) {
	switch (key) {
		case 'aleatoire':
			return new RandomStrategy(seed);
		case 'cooperer':
			return new ToujoursCoopererStrategy();
		case 'trahir':
			return new ToujoursTrahirStrategy();
		case 'titfortat':
			return new TitForTatStrategy();
		case 'grudger':
			return new GrudgerStrategy();
		case 'detective':
			return new DetectiveStrategy();
		case 'pavlov':
			return new PavlovStrategy();
		default:
			console.warn('[construireStrategy] clé inconnue:', key, '-> utilisation Detective');
			return new DetectiveStrategy();
	}
}

