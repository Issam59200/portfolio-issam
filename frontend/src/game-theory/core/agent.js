/**
 * Joueur avec une stratégie associée
 */
export class Agent {
    /**
     * @param {string} id - 'A' ou 'B'
     * @param {Object} strategie - Instance de stratégie
     * @param {string} nom - Nom d'affichage (défaut: nom de la classe)
     */
    constructor(id, strategie, nom = null) {
        this.id = id;
        this.strategie = strategie;
        this.nom = nom || strategie.constructor.name;
        this.score = 0;
    }

    /**
     * @param {Object} contexte - {historique, me, opponent}
     * @returns {string} 'C' ou 'T'
     */
    choisirAction(contexte) {
        return this.strategie.nextAction(contexte);
    }

    /** @param {number} gain */
    ajouterGain(gain) {
        this.score += gain;
    }

    reinitialiser() {
        this.score = 0;
    }

    /** @returns {string} "nom (id)" */
    toString() {
        return `${this.nom} (${this.id})`;
    }
}   