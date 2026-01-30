/**
 * Matrice de gains du Dilemme du Prisonnier
 * Condition : T > R > P > S et 2R > T + S
 */
export class Payoff {
	/**
	 * @param {number} R - Récompense mutuelle (défaut: 3)
	 * @param {number} T - Tentation de trahir (défaut: 5)
	 * @param {number} P - Punition mutuelle (défaut: 1)
	 * @param {number} S - Sucker (défaut: 0)
	 */
	constructor({ R = 3, T = 5, P = 1, S = 0 } = {}) {
		this.R = R;
		this.T = T;
		this.P = P;
		this.S = S;
		this._valider();
	}

	/**
	 * Valide les conditions du dilemme
	 */
	_valider() {
		if (!(this.T > this.R && this.R > this.P && this.P > this.S)) {
			console.warn('[Payoff] La condition T > R > P > S n\'est pas respectée.');
		}
		if (!(2 * this.R > this.T + this.S)) {
			console.warn('[Payoff] La condition 2R > T + S (itéré) n\'est pas respectée.');
		}
	}

	/**
	 * Calcule les gains des deux joueurs
	 * @param {string} actionA - 'C' ou 'T'
	 * @param {string} actionB - 'C' ou 'T'
	 * @returns {Object} {a, b} gains
	 */
	gain(actionA, actionB) {
		if (actionA === 'C' && actionB === 'C') {
			return { a: this.R, b: this.R };
		}
		if (actionA === 'T' && actionB === 'C') {
			return { a: this.T, b: this.S };
		}
		if (actionA === 'C' && actionB === 'T') {
			return { a: this.S, b: this.T };
		}
		// T / T
		return { a: this.P, b: this.P };
	}
}

