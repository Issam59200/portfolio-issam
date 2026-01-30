/**
 * Interface utilisateur pour le mode Évolution
 * Gère l'affichage des visualisations (canvas, graphiques) et les interactions utilisateur
 */
import * as evo from '../core/evolution.js';

/** Cache des images d'agents déjà chargées */
const imageCache = {};

/** Configuration des stratégies disponibles avec leurs propriétés visuelles */
const STRATEGIES = {
    cooperer: { nom: 'COOPERATOR', image: 'All Cooperate.png', couleur: '#ec4899' },
    trahir: { nom: 'CHEATER', image: 'All Cheat.png', couleur: '#1e293b' },
    titfortat: { nom: 'COPYCAT', image: 'CopyCat.png', couleur: '#3b82f6' }
};

/** ID de l'intervalle pour l'animation automatique */
let intervalId = null;

/**
 * Dessine la visualisation circulaire de la population actuelle
 * Affiche tous les agents connectés entre eux dans un cercle
 * Utilise le cache d'images pour optimiser les performances
 */
function dessinerCercle() {
    const canvas = document.getElementById('canvas-cercle');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = rect.width;
    const height = rect.height;
    ctx.fillStyle = '#f6f7fb';
    ctx.fillRect(0, 0, width, height);

    const agents = [];
    Object.keys(evo.population).forEach(key => {
        const count = evo.population[key] || 0;
        for (let i = 0; i < count; i++) agents.push({ key });
    });
    if (!agents.length) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.42;
    const size = 36;

    const positions = agents.map((agent, index) => {
        const angle = (index / agents.length) * Math.PI * 2 - Math.PI / 2;
        return { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius, agent };
    });

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            ctx.beginPath();
            ctx.moveTo(positions[i].x, positions[i].y);
            ctx.lineTo(positions[j].x, positions[j].y);
            ctx.stroke();
        }
    }

    positions.forEach(p => {
        const strat = STRATEGIES[p.agent.key];
        if (!strat) return;
        const imgName = strat.image;
        const path = `../Assets/PNG des Agents/${encodeURI(imgName)}`;
        let img = imageCache[imgName];
        if (!img) {
            img = new Image();
            img.src = path;
            imageCache[imgName] = img;
            img.onload = () => dessinerCercle();
            img.onerror = () => console.error('[Evo] Image pas trouvée:', path);
        }
        const half = size / 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, half, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = strat.couleur;
        ctx.lineWidth = 3;
        ctx.stroke();
        if (img.complete) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, half - 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, p.x - half, p.y - half, size, size);
            ctx.restore();
        }
    });
}

/**
 * Dessine le graphique d'évolution des populations au fil des générations
 * Affiche une courbe par stratégie avec sa couleur associée
 */
function dessinerScores() {
    const canvas = document.getElementById('graphique-scores');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 350;

    const largeur = canvas.width;
    const hauteur = canvas.height;
    const margeX = 60;
    const margeY = 40;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, largeur, hauteur);

    // Axes
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margeX, hauteur - margeY);
    ctx.lineTo(largeur - 20, hauteur - margeY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(margeX, margeY);
    ctx.lineTo(margeX, hauteur - margeY);
    ctx.stroke();

    if (evo.historique.length < 1) return;

    // Calculer min/max GLOBAL pour toutes les stratégies
    let minPop = Infinity, maxPop = 0;
    for (let gen = 0; gen < evo.historique.length; gen++) {
        const pop = evo.historique[gen]?.population || {};
        for (const val of Object.values(pop)) {
            minPop = Math.min(minPop, val || 0);
            maxPop = Math.max(maxPop, val || 0);
        }
    }
    const range = maxPop - minPop || 1;

    // Tracer les courbes de population pour chaque stratégie
    ['cooperer', 'titfortat', 'trahir'].forEach(cle => {
        const couleur = STRATEGIES[cle]?.couleur || '#888888';
        ctx.strokeStyle = couleur;
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        for (let gen = 0; gen < evo.historique.length; gen++) {
            const pop = evo.historique[gen]?.population || {};
            const valeur = pop[cle] || 0;
            
            const x = margeX + (gen / Math.max(1, evo.historique.length - 1)) * (largeur - margeX - 20);
            const y = hauteur - margeY - ((valeur - minPop) / range) * (hauteur - margeY - 20);
            
            if (gen === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    });

    // Labels sur les axes
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('0', margeX - 8, hauteur - margeY + 4);
    ctx.fillText(String(Math.round(maxPop)), margeX - 8, margeY + 4);
    
    ctx.textAlign = 'center';
    ctx.fillText('Gen', largeur / 2, hauteur - 10);
}

/**
 * Affiche les statistiques de population pour chaque stratégie
 * Met à jour le panneau latéral avec les nombres actuels
 */
function afficherStats() {
    const conteneur = document.getElementById('stats-strategies');
    if (!conteneur) return;
    let html = '';
    for (const [cle, nombre] of Object.entries(evo.population)) {
        const strat = STRATEGIES[cle];
        if (!strat) continue;
        html += `
            <div class="strategy-stat" style="border-left-color: ${strat.couleur}">
                <div class="name">
                    <span style="display:inline-block; width:12px; height:12px; background:${strat.couleur}; border-radius:50%; margin-right:8px;"></span>
                    ${strat.nom}
                </div>
                <div class="values">Population: <strong>${nombre}</strong></div>
            </div>
        `;
    }
    conteneur.innerHTML = html;
}

/**
 * Met à jour tous les éléments de l'interface (génération, population, canvas, graphique)
 * Fonction centrale appelée après chaque changement d'état
 */
function mettreAJour() {
    const genEl = document.getElementById('numero-generation');
    const popEl = document.getElementById('population-totale');
    if (genEl) genEl.textContent = String(evo.generation);
    if (popEl) popEl.textContent = String(evo.getPopulationTotale());

    dessinerCercle();
    dessinerScores();
    afficherStats();
}

/**
 * Démarre l'animation automatique des générations
 * Lance un intervalle qui simule une nouvelle génération toutes les 600ms
 */
function demarrer() {
    // Validation stricte avant de démarrer
    if (evo.manchesParMatch < 1 || evo.manchesParMatch > 20) {
        alert('❌ Erreur: Le nombre de rounds doit être entre 1 et 20');
        return;
    }
    
    if (intervalId) return;
    intervalId = setInterval(() => {
        evo.nouvelleGeneration();
        mettreAJour();
    }, 600);
    const btnStart = document.getElementById('btn-start');
    const btnStop = document.getElementById('btn-stop');
    if (btnStart) btnStart.disabled = true;
    if (btnStop) btnStop.style.display = 'inline-block';
}

/**
 * Arrête l'animation automatique des générations
 * Réactive le bouton de démarrage et cache le bouton d'arrêt
 */
function arreter() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    const btnStart = document.getElementById('btn-start');
    const btnStop = document.getElementById('btn-stop');
    if (btnStart) btnStart.disabled = false;
    if (btnStop) btnStop.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    evo.initialiser();

    const sliderRounds = document.getElementById('slider-rounds');
    const valueRounds = document.getElementById('valeur-rounds');
    if (sliderRounds && valueRounds) {
        sliderRounds.value = String(evo.manchesParMatch || 10);
        valueRounds.textContent = sliderRounds.value;
        sliderRounds.addEventListener('input', (e) => {
            const v = Number(e.target.value);
            evo.setManchesParMatch(v);
            valueRounds.textContent = String(v);
        });
    }

    const btnStart = document.getElementById('btn-start');
    const btnStop = document.getElementById('btn-stop');
    const btnNext = document.getElementById('btn-nouvelle-generation');
    const btnReset = document.getElementById('btn-reinitialiser');

    if (btnStart) btnStart.addEventListener('click', () => { btnStart.disabled = true; demarrer(); });
    if (btnStop) btnStop.addEventListener('click', arreter);
    if (btnNext) btnNext.addEventListener('click', () => { 
        // Validation stricte
        if (evo.manchesParMatch < 1 || evo.manchesParMatch > 20) {
            alert('❌ Erreur: Le nombre de rounds doit être entre 1 et 20');
            return;
        }
        btnNext.disabled = true;
        evo.nouvelleGeneration(); 
        mettreAJour(); 
        setTimeout(() => btnNext.disabled = false, 100);
    });
    if (btnReset) btnReset.addEventListener('click', () => { 
        btnReset.disabled = true;
        evo.initialiser(); 
        mettreAJour(); 
        setTimeout(() => btnReset.disabled = false, 100);
    });

    mettreAJour();

    window.addEventListener('resize', dessinerCercle);
});

