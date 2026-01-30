import { simulerDuel } from './jeu.js';
import { Payoff } from './gain.js';
import { construireStrategy } from './strategie.js';

// Cache simple des images des agents
const imageCache = {};

// Configuration des stratégies disponibles
const STRATEGIES = {
    copycat: { nom: 'COPYCAT', image: 'CopyCat.png', couleur: '#3b82f6' },
    cheater: { nom: 'CHEATER', image: 'All Cheat.png', couleur: '#1e293b' },
    cooperator: { nom: 'COOPERATOR', image: 'All Cooperate.png', couleur: '#ec4899' },
    grudger: { nom: 'GRUDGER', image: 'Grudger.png', couleur: '#eab308' },
    detective: { nom: 'DETECTIVE', image: 'Detective.png', couleur: '#f97316' },
    simpleton: { nom: 'SIMPLETON', image: 'Simpleton.png', couleur: '#84cc16' },
    random: { nom: 'RANDOM', image: 'Random.png', couleur: '#ef4444' }
};

// Mapping des clés vers construireStrategy
const STRATEGY_KEYS = {
    copycat: 'titfortat', 
    cheater: 'trahir', 
    cooperator: 'cooperer', 
    grudger: 'grudger', 
    detective: 'detective', 
    simpleton: 'pavlov', 
    random: 'aleatoire' 
};

/**
 * État global du sandbox
 */
const state = {
    population: {},
    generation: 0,
    running: false,
    intervalId: null,
    payoff: { R: 3, T: 5, P: 1, S: 0 },
    rules: {
        rounds: 10,
        eliminate: 5,
        noise: 5
    }
};

/**
 * Initialise la population avec des valeurs par défaut
 */
function initializeDefaultPopulation() {
    state.population = {
        copycat: 3,
        cheater: 3,
        cooperator: 3,
        grudger: 3,
        detective: 3,
        simpleton: 3,
        random: 4
    };
}

// Initialisation de l'interface
document.addEventListener('DOMContentLoaded', () => {
    initializeDefaultPopulation();
    setupTabs();
    setupControls();
    renderPopulation();
    renderCanvas();
    updateGenerationInfo();
});

/**
 * Configure le système d'onglets (Population, Payoffs, Rules)
 */
function setupTabs() {
    const buttons = document.querySelectorAll('.tab-button');
    const panels = document.querySelectorAll('.tab-panel');
    if (!buttons.length || !panels.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // activer bouton
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // afficher panneau correspondant
            const tab = btn.getAttribute('data-tab');
            panels.forEach(p => p.classList.remove('active'));
            const target = document.getElementById(`tab-${tab}`);
            if (target) target.classList.add('active');
        });
    });
}

/**
 * Configure les sliders et boutons de contrôle
 */
function setupControls() {
    // Payoffs - inputs numériques
    ['r', 't', 'p', 's'].forEach(key => {
        const input = document.getElementById(`input-${key}`);
        if (input) {
            input.addEventListener('change', () => {
                const value = parseFloat(input.value);
                if (value < -50 || value > 50) {
                    alert('❌ Erreur: La valeur doit être entre -50 et 50');
                    input.value = state.payoff[key.toUpperCase()];
                    return;
                }
                state.payoff[key.toUpperCase()] = value || 0;
            });
        }
    });

    // Rules
    const roundsSlider = document.getElementById('slider-rounds');
    const roundsValue = document.getElementById('value-rounds');
    if (roundsSlider && roundsValue) {
        roundsSlider.addEventListener('input', () => {
            roundsValue.textContent = roundsSlider.value;
            state.rules.rounds = parseInt(roundsSlider.value, 10);
        });
    }

    const eliminateSlider = document.getElementById('slider-eliminate');
    const eliminateValue = document.getElementById('value-eliminate');
    const reproduceValue = document.getElementById('value-reproduce');
    if (eliminateSlider && eliminateValue && reproduceValue) {
        eliminateSlider.addEventListener('input', () => {
            eliminateValue.textContent = eliminateSlider.value;
            reproduceValue.textContent = eliminateSlider.value;
            state.rules.eliminate = parseInt(eliminateSlider.value);
        });
    }

    const noiseSlider = document.getElementById('slider-noise');
    const noiseValue = document.getElementById('value-noise');
    if (noiseSlider && noiseValue) {
        noiseSlider.addEventListener('input', () => {
            noiseValue.textContent = noiseSlider.value + '%';
            state.rules.noise = parseInt(noiseSlider.value, 10);
        });
    }

    // Boutons d'action
    const btnStart = document.getElementById('btn-start');
    const btnStep = document.getElementById('btn-step');
    const btnReset = document.getElementById('btn-reset');

    if (btnStart) {
        btnStart.addEventListener('click', toggleSimulation);
    }
    if (btnStep) {
        btnStep.addEventListener('click', runOneGeneration);
    }
    if (btnReset) {
        btnReset.addEventListener('click', resetSimulation);
    }
}

/**
 * Affiche la liste des stratégies avec leurs contrôles
 */
function renderPopulation() {
    const container = document.getElementById('population-list');
    if (!container) return;

    container.innerHTML = '';

    Object.keys(STRATEGIES).forEach(key => {
        const count = state.population[key] || 0;
        const strategy = STRATEGIES[key];

        const item = document.createElement('div');
        item.className = 'strategy-item';
        item.style.borderLeft = `4px solid ${strategy.couleur}`;

        item.innerHTML = `
            <img src="../Assets/PNG des Agents/${encodeURI(strategy.image)}" 
                 alt="${strategy.nom}" 
                 onerror="this.src='../Assets/PNG des Agents/Normal.png'">
            <div class="name">${strategy.nom}</div>
            <div class="count" id="count-${key}">${count}</div>
            <div class="controls">
                <button onclick="window.ajusterPopulation('${key}', -1)">−</button>
                <button onclick="window.ajusterPopulation('${key}', 1)">+</button>
            </div>
        `;

        container.appendChild(item);
    });
}

/**
 * Ajuste le nombre d'agents pour une stratégie donnée
 * @param {string} strategyKey
 * @param {number} delta
 */
window.ajusterPopulation = function(strategyKey, delta) {
    if (!state.population[strategyKey]) state.population[strategyKey] = 0;
    
    // Calculer la population totale actuelle
    const totalActuel = Object.values(state.population).reduce((sum, count) => sum + count, 0);
    
    // Limiter à 30 agents maximum au total
    if (delta > 0 && totalActuel >= 30) {
        alert('⚠️ Population maximale atteinte (30 agents)');
        return;
    }
    
    const nouvelleValeur = state.population[strategyKey] + delta;
    
    // Empêcher les valeurs négatives et limiter à 30 par stratégie
    state.population[strategyKey] = Math.max(0, Math.min(30, nouvelleValeur));
    
    const countEl = document.getElementById(`count-${strategyKey}`);
    if (countEl) countEl.textContent = state.population[strategyKey];
    updateGenerationInfo();
    renderCanvas();
};

/**
 * Met à jour l'affichage du numéro de génération et de la population totale
 */
function updateGenerationInfo() {
    const genEl = document.getElementById('generation-number');
    const popEl = document.getElementById('total-population');
    
    if (genEl) genEl.textContent = state.generation;
    if (popEl) {
        const total = Object.values(state.population).reduce((sum, count) => sum + count, 0);
        popEl.textContent = total;
    }
}

/** Dessine la visualisation canvas */
function renderCanvas() {
    const canvas = document.getElementById('sandbox-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear
    ctx.fillStyle = '#f6f7fb';
    ctx.fillRect(0, 0, width, height);

    // Créer la liste d'agents (clé + couleur)
    const agents = [];
    Object.keys(state.population).forEach(key => {
        const count = state.population[key];
        for (let i = 0; i < count; i++) {
            agents.push({ strategy: key, color: STRATEGIES[key].couleur });
        }
    });

    if (agents.length === 0) return;

    // Dessiner en cercle
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.42;
    const size = 44;

    // Préparer positions
    const positions = agents.map((agent, index) => {
        const angle = (index / agents.length) * Math.PI * 2 - Math.PI / 2;
        return {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            strategy: agent.strategy,
            color: agent.color
        };
    });

    // Lignes de connexion
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            const p1 = positions[i];
            const p2 = positions[j];
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
    }

    // Puis les PNG des agents au-dessus
    positions.forEach(p => {
        const imgSrc = STRATEGIES[p.strategy].image;
        const chemin = `../Assets/PNG des Agents/${encodeURI(imgSrc)}`;
        let img = imageCache[chemin];
        if (!img) {
            img = new Image();
            img.src = chemin;
            imageCache[chemin] = img;
            img.onload = () => {
                renderCanvas();
            };
            img.onerror = () => {
                const fallback = '../Assets/PNG des Agents/Normal.png';
                imageCache[chemin] = new Image();
                imageCache[chemin].src = fallback;
                renderCanvas();
            };
        }
        if (img.complete) {
            ctx.drawImage(img, p.x - size/2, p.y - size/2, size, size);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size/2, 0, Math.PI * 2);
            ctx.stroke();
        }
    });
}

/** Démarre/arrête la simulation */
function toggleSimulation() {
    const btn = document.getElementById('btn-start');
    if (!btn) return;

    if (state.running) {
        // Arrêter
        state.running = false;
        btn.textContent = '▶ Démarrer';
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
        if (state.intervalId) {
            clearInterval(state.intervalId);
            state.intervalId = null;
        }
    } else {
        // Validation stricte avant de démarrer
        if (state.rules.rounds < 1 || state.rules.rounds > 50) {
            alert('❌ Erreur: Le nombre de rounds doit être entre 1 et 50');
            return;
        }
        
        if (state.rules.noise < 0 || state.rules.noise > 100) {
            alert('❌ Erreur: Le bruit doit être entre 0% et 100%');
            return;
        }
        
        // Vérifier qu'il y a au moins 2 agents
        const total = Object.values(state.population).reduce((sum, count) => sum + count, 0);
        if (total < 2) {
            alert('⚠️ Vous devez avoir au moins 2 agents pour lancer la simulation');
            return;
        }
        
        // Démarrer
        state.running = true;
        btn.textContent = '⏸ Pause';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
        state.intervalId = setInterval(runOneGeneration, 1000);
    }
}

/**
 * Exécute une génération complète (tournoi, sélection, reproduction)
 */
function runOneGeneration() {
    // Validation stricte des paramètres
    if (state.rules.rounds < 1 || state.rules.rounds > 50) {
        alert('❌ Erreur: Le nombre de rounds doit être entre 1 et 50');
        return;
    }
    
    if (state.rules.noise < 0 || state.rules.noise > 100) {
        alert('❌ Erreur: Le bruit doit être entre 0% et 100%');
        return;
    }
    
    const total = Object.values(state.population).reduce((sum, count) => sum + count, 0);
    if (total < 2) {
        console.warn('Pas assez d\'agents pour un tournoi');
        alert('⚠️ Vous devez avoir au moins 2 agents pour lancer une génération');
        return;
    }

    // Créer les agents
    const agents = [];
    Object.keys(state.population).forEach(stratKey => {
        const count = state.population[stratKey];
        for (let i = 0; i < count; i++) {
            agents.push({
                strategy: stratKey,
                strategyKey: STRATEGY_KEYS[stratKey],
                score: 0
            });
        }
    });

    // Tournoi round-robin
    const payoff = new Payoff(state.payoff);
    
    for (let i = 0; i < agents.length; i++) {
        for (let j = i + 1; j < agents.length; j++) {
            const stratA = construireStrategy(agents[i].strategyKey);
            const stratB = construireStrategy(agents[j].strategyKey);

            const history = simulerDuel({
                strategyA: stratA,
                strategyB: stratB,
                payoff: payoff,
                manches: state.rules.rounds,
                bruit: state.rules.noise,
                seed: Date.now() + i * 1000 + j
            });

            agents[i].score += history.totalA;
            agents[j].score += history.totalB;
        }
    }

    // Trier par score
    agents.sort((a, b) => b.score - a.score);

    // Éliminer les derniers et reproduire les premiers
    const eliminate = Math.min(state.rules.eliminate, Math.floor(agents.length / 2));
    const survivors = agents.slice(0, agents.length - eliminate);
    const reproducers = agents.slice(0, eliminate);

    // Recompter la nouvelle population
    const newPopulation = {};
    Object.keys(STRATEGIES).forEach(key => newPopulation[key] = 0);

    survivors.forEach(agent => {
        newPopulation[agent.strategy]++;
    });
    reproducers.forEach(agent => {
        newPopulation[agent.strategy]++;
    });

    state.population = newPopulation;
    state.generation++;

    // Mettre à jour l'interface
    renderPopulation();
    renderCanvas();
    updateGenerationInfo();
}

/**
 * Réinitialise la simulation à l'état initial
 */
function resetSimulation() {
    // Arrêter si en cours
    if (state.running) {
        toggleSimulation();
    }

    // Réinitialiser complètement l'état
    state.generation = 0;
    state.running = false;
    state.intervalId = null;
    
    // Réinitialiser la population aux valeurs par défaut
    state.population = {
        copycat: 3,
        cheater: 3,
        cooperator: 3,
        grudger: 3,
        detective: 3,
        simpleton: 3,
        random: 4
    };
    
    // Réinitialiser les inputs numériques des gains
    const inputR = document.getElementById('input-r');
    const inputT = document.getElementById('input-t');
    const inputP = document.getElementById('input-p');
    const inputS = document.getElementById('input-s');
    
    if (inputR) inputR.value = 3;
    if (inputT) inputT.value = 5;
    if (inputP) inputP.value = 1;
    if (inputS) inputS.value = 0;
    
    // Réinitialiser les sliders des règles
    const sliderRounds = document.getElementById('slider-rounds');
    const valueRounds = document.getElementById('value-rounds');
    if (sliderRounds) sliderRounds.value = 10;
    if (valueRounds) valueRounds.textContent = '10';
    
    const sliderEliminate = document.getElementById('slider-eliminate');
    const valueEliminate = document.getElementById('value-eliminate');
    const valueReproduce = document.getElementById('value-reproduce');
    if (sliderEliminate) sliderEliminate.value = 5;
    if (valueEliminate) valueEliminate.textContent = '5';
    if (valueReproduce) valueReproduce.textContent = '5';
    
    const sliderNoise = document.getElementById('slider-noise');
    const valueNoise = document.getElementById('value-noise');
    if (sliderNoise) sliderNoise.value = 5;
    if (valueNoise) valueNoise.textContent = '5%';

    // Réinitialiser les objets de configuration
    state.payoff = { R: 3, T: 5, P: 1, S: 0 };
    state.rules = { rounds: 10, eliminate: 5, noise: 5 };

    // Mettre à jour l'interface - forcer le redessin complet
    updateGenerationInfo();
    renderPopulation();
    
    // Forcer le redessin du canvas avec un léger délai pour s'assurer que tout est synchronisé
    setTimeout(() => {
        renderCanvas();
    }, 10);
    
    console.log('Simulation réinitialisée:', state);
}
