/**
 * Générateur de nombres pseudo-aléatoires (Linear Congruential Generator)
 * Garantit la reproductibilité avec une seed
 */
export class RNG {
	/** @param {number} seed - Graine d'initialisation (défaut: timestamp) */
	constructor(seed = Date.now()) {
		this._m = 0x80000000;
		this._a = 1103515245;
		this._c = 12345;
		this._state = (seed >>> 0) % this._m;
	}

	/**
	 * Génère un nombre entier aléatoire
	 * @returns {number}
	 */
	nextInt() {
		this._state = (this._a * this._state + this._c) % this._m;
		return this._state;
	}

	/**
	 * Génère un flottant dans [0,1)
	 * @returns {number}
	 */
	next() {
		return this.nextInt() / (this._m - 1);
	}

	/**
	 * Retourne vrai avec une probabilité p
	 * @param {number} p - Probabilité entre 0 et 1
	 * @returns {boolean}
	 */
	chance(p) {
		return this.next() < p;
	}
}

