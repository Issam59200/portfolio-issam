import { Tournament } from '../core/tournoi.js';

// Mapping direct des IDs HTML vers les clés pour construireStrategie
const CHECKBOX_TO_KEY = {
    'strat-cooperer': 'cooperer',
    'strat-trahir': 'trahir',
    'strat-titfortat': 'titfortat',
    'strat-grudger': 'grudger',
    'strat-pavlov': 'pavlov',
    'strat-detective': 'detective',
    'strat-aleatoire': 'aleatoire',
    // 'strat-copieur': 'copieur'
};

// Mapping des noms de classes vers des libellés lisibles
const CLASS_TO_LABEL = {
    'RandomStrategy': 'Aléatoire',
    'ToujoursCoopererStrategy': 'Toujours coopérer',
    'ToujoursTrahirStrategy': 'Toujours trahir',
    // 'CopierStrategy': 'Copieur',
    'TitForTatStrategy': 'Tit-for-Tat',
    'GrudgerStrategy': 'Grudger',
    'DetectiveStrategy': 'Détective',
    'PavlovStrategy': 'Pavlov'
};

// Mapping des noms de classes vers les images
const CLASS_TO_IMAGE = {
    'RandomStrategy': 'Random.png',
    'ToujoursCoopererStrategy': 'All Cooperate.png',
    'ToujoursTrahirStrategy': 'All Cheat.png',
    // 'CopierStrategy': 'CopyCat.png',
    'TitForTatStrategy': 'CopyCat.png',
    'GrudgerStrategy': 'Grudger.png',
    'DetectiveStrategy': 'Detective.png',
    'PavlovStrategy': 'Simpleton.png'
};

/**
 * Retourne le chemin de l'image depuis le nom de classe
 * @param {string} className
 * @returns {string} Chemin image
 */
function cheminImageDepuisNomClasse(className) {
    return encodeURI('../Assets/PNG des Agents/' + (CLASS_TO_IMAGE[className] || 'Normal.png'));
}

/**
 * Convertit un nom de classe en libellé lisible
 * @param {string} className
 * @returns {string} Libellé lisible
 */
function labelDepuisNomClasse(className) {
    return CLASS_TO_LABEL[className] || className.replace(/(Strategy|Strategie)$/, '');
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('formulaire-tournoi')) {
        initialiserTournoi();
    }
});

/**
 * Initialise les contrôles de l'interface
 */
function initialiserTournoi() {
    // Slider du bruit
    const slider = document.getElementById('bruit-tournoi');
    const spanBruit = document.getElementById('valeur-bruit-tournoi');
    if (slider && spanBruit) {
        const maj = () => spanBruit.textContent = slider.value + '%';
        slider.addEventListener('input', maj);
        maj();
    }

    // Bouton lancer tournoi
    const btn = document.getElementById('bouton-lancer-tournoi');
    if (btn) {
        btn.addEventListener('click', () => {
            btn.disabled = true;
            lancerTournoi();
            setTimeout(() => btn.disabled = false, 500);
        });
    }
}

/**
 * Lit la configuration du formulaire
 * @returns {Object|null} Configuration du tournoi
 */
function lireConfigurationTournoi() {
    // Récupérer les stratégies sélectionnées via les checkbox
    const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .filter(cb => cb.id.startsWith('strat-'));
    
    const strategiesSelectionnees = checkboxes
        .map(cb => CHECKBOX_TO_KEY[cb.id])
        .filter(s => s !== undefined);

    // Validation : au moins 2 stratégies et max 8
    if (strategiesSelectionnees.length < 2) {
        alert('⚠️ Veuillez sélectionner au moins 2 stratégies pour le tournoi.');
        return null;
    }
    
    if (strategiesSelectionnees.length > 8) {
        alert('⚠️ Maximum 8 stratégies sont autorisées.');
        return null;
    }

    // Paramètres du tournoi
    const manches = parseInt(document.getElementById('manches-par-match').value || '150', 10);
    const bruit = parseInt(document.getElementById('bruit-tournoi').value || '0', 10);
    
    // Configuration des gains
    const payoffValues = {
        R: parseInt(document.getElementById('gain-r-tournoi').value || '3', 10),
        T: parseInt(document.getElementById('gain-t-tournoi').value || '5', 10),
        P: parseInt(document.getElementById('gain-p-tournoi').value || '1', 10),
        S: parseInt(document.getElementById('gain-s-tournoi').value || '0', 10)
    };

    return {
        strategyKeys: strategiesSelectionnees,
        manches,
        bruit,
        payoffValues
    };
}

/**
 * Lance le tournoi et affiche les résultats
 */
function lancerTournoi() {
    const config = lireConfigurationTournoi();
    
    // Si config est null (validation échouée), arrêter
    if (!config) return;
    
    // Validation stricte
    if (config.manches < 1 || config.manches > 200) {
        alert('❌ Erreur: Le nombre de manches doit être entre 1 et 200');
        return;
    }
    
    if (config.bruit < 0 || config.bruit > 100) {
        alert('❌ Erreur: Le bruit doit être entre 0% et 100%');
        return;
    }
    
    // Validation des gains entre -50 et 50
    const gains = config.payoffValues;
    if (gains.R < -50 || gains.R > 50 || gains.T < -50 || gains.T > 50 || 
        gains.P < -50 || gains.P > 50 || gains.S < -50 || gains.S > 50) {
        alert('❌ Erreur: Les valeurs des gains (R, T, P, S) doivent être entre -50 et 50');
        return;
    }

    console.log('Lancement du tournoi avec', config.strategyKeys.length, 'stratégies');

    // Créer et lancer le tournoi
    const tournoi = new Tournament(config);
    const resultats = tournoi.jouerTournoi();

    console.log('Tournoi terminé', resultats);

    // Afficher les résultats
    afficherResultatsTournoi(resultats);
}

/**
 * Affiche tous les résultats du tournoi
 * @param {Object} resultats
 */
function afficherResultatsTournoi(resultats) {
    const zone = document.getElementById('zone-resultats-tournoi');
    const emptyState = document.getElementById('tournoi-empty-state');
    
    if (zone) {
        zone.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';
    }

    // Afficher le classement
    afficherClassement(resultats.classement);

    // Afficher le tableau des matchs
    afficherTableauMatchs(resultats.detailsMatches);

    // Afficher la matrice de résultats
    afficherMatrice(resultats.matriceScores);
    
    // Auto-scroll vers les résultats
    setTimeout(() => {
        zone?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/**
 * Affiche le classement final
 * @param {Array} classement
 */
function afficherClassement(classement) {
    const container = document.getElementById('classement-final');
    if (!container) return;

    let html = '<div class="surface"><h3>🏆 Classement Final</h3>';
    html += '<table class="table"><thead><tr>';
    html += '<th>Rang</th><th>Stratégie</th><th>Score Total</th><th>Score Moyen</th>';
    html += '<th>V</th><th>N</th><th>D</th>';
    html += '</tr></thead><tbody>';

    classement.forEach(entry => {
        const label = labelDepuisNomClasse(entry.strategie);
        const emoji = entry.rang === 1 ? '🥇' : entry.rang === 2 ? '🥈' : entry.rang === 3 ? '🥉' : '';
        
        html += `<tr>
            <td><strong>${emoji} ${entry.rang}</strong></td>
            <td>${label}</td>
            <td><strong>${entry.scoreTotal}</strong></td>
            <td>${entry.scoreMoyen.toFixed(2)}</td>
            <td style="color: #10b981;">${entry.victoires}</td>
            <td style="color: #6b7280;">${entry.matchsNuls}</td>
            <td style="color: #ef4444;">${entry.defaites}</td>
        </tr>`;
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

/**
 * Affiche le tableau des matchs
 * @param {Array} detailsMatches
 */
function afficherTableauMatchs(detailsMatches) {
    const container = document.getElementById('tableau-matchs');
    if (!container) return;

    let html = '<div class="surface"><h3>📊 Détails des Matchs</h3>';
    html += '<table class="table"><thead><tr>';
    html += '<th>Stratégie A</th><th>Stratégie B</th><th>Score A</th><th>Score B</th><th>Vainqueur</th>';
    html += '</tr></thead><tbody>';

    detailsMatches.forEach(match => {
        const labelA = labelDepuisNomClasse(match.stratA);
        const labelB = labelDepuisNomClasse(match.stratB);
        const gagneurStyle = match.vainqueur === match.stratA ? 'color: #10b981; font-weight: bold;' :
                            match.vainqueur === match.stratB ? 'color: #10b981; font-weight: bold;' :
                            'color: #6b7280;';

        html += `<tr>
            <td>${labelA}</td>
            <td>${labelB}</td>
            <td>${match.scoreA}</td>
            <td>${match.scoreB}</td>
            <td style="${gagneurStyle}">${match.vainqueur === 'Match nul' ? '=' : labelDepuisNomClasse(match.vainqueur)}</td>
        </tr>`;
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

/**
 * Affiche la matrice des résultats
 * @param {Object} matriceScores
 */
function afficherMatrice(matriceScores) {
    const container = document.getElementById('matrice-resultats');
    if (!container) return;

    const strategies = Object.keys(matriceScores);
    
    let html = '<div class="surface"><h3>🎯 Matrice des Résultats</h3>';
    html += '<div style="overflow-x: auto;">';
    html += '<table class="table" style="min-width: 600px;"><thead><tr>';
    html += '<th></th>';
    
    // En-têtes des colonnes
    strategies.forEach(strat => {
        const label = labelDepuisNomClasse(strat);
        html += `<th style="text-align: center; font-size: 12px;">${label}</th>`;
    });
    html += '</tr></thead><tbody>';

    // Lignes de la matrice
    strategies.forEach(stratLigne => {
        const labelLigne = labelDepuisNomClasse(stratLigne);
        html += `<tr><td style="font-weight: 600;">${labelLigne}</td>`;
        
        strategies.forEach(stratCol => {
            if (stratLigne === stratCol) {
                html += '<td style="text-align: center; background: #f3f4f6;">—</td>';
            } else {
                const score = matriceScores[stratLigne].adversaires[stratCol] || 0;
                html += `<td style="text-align: center;">${score}</td>`;
            }
        });
        
        html += '</tr>';
    });

    html += '</tbody></table></div></div>';
    container.innerHTML = html;
}