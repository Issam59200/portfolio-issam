import { simulerDuel, Historique, Turn } from './core/jeu.js';
import { Payoff } from './core/gain.js';
import { construireStrategy } from './core/strategie.js';
import { RNG } from './core/RNG.js';
import './ui/tournoi.js';

// Images pour les avatars - mapping par clé de sélection
const IMAGES_STRATEGIES = {
  detective: 'Detective.png',
  aleatoire: 'Random.png',
  copieur: 'CopyCat.png',
  cooperer: 'All Cooperate.png',
  trahir: 'All Cheat.png',
  titfortat: 'CopyCat.png',
  grudger: 'Grudger.png',
  pavlov: 'Simpleton.png',
  joueur: 'Joueur.png'
};

// Libellés lisibles pour les clés de sélection
const KEY_TO_LABEL = {
  detective: 'Détective',
  aleatoire: 'Aléatoire',
  copieur: 'Copieur',
  cooperer: 'Toujours coopérer',
  trahir: 'Toujours trahir',
  titfortat: 'Tit-for-Tat',
  grudger: 'Grudger',
  pavlov: 'Pavlov',
  joueur: 'Joueur'
};

// Mapping des noms de classes (réelles) vers les fichiers images
const CLASS_TO_IMAGE = {
  'RandomStrategy': 'Random.png',
  'ToujoursCoopererStrategy': 'All Cooperate.png',
  'ToujoursTrahirStrategy': 'All Cheat.png',
  'CopierStrategy': 'CopyCat.png',
  'TitForTatStrategy': 'CopyCat.png',
  'GrudgerStrategy': 'Grudger.png',
  'DetectiveStrategy': 'Detective.png',
  'PavlovStrategy': 'Simpleton.png'
};

// Libellés lisibles par classe
const CLASS_TO_LABEL = {
  'RandomStrategy': 'Aléatoire',
  'ToujoursCoopererStrategy': 'Toujours coopérer',
  'ToujoursTrahirStrategy': 'Toujours trahir',
  'CopierStrategy': 'Copieur',
  'TitForTatStrategy': 'Tit-for-Tat',
  'GrudgerStrategy': 'Grudger',
  'DetectiveStrategy': 'Détective',
  'PavlovStrategy': 'Pavlov'
};

/**
 * Retourne le chemin de l'image pour une stratégie
 * @param {string} strat - Clé de stratégie
 * @returns {string} Chemin image
 */
function cheminImage(strat){
  return encodeURI('../Assets/PNG des Agents/' + (IMAGES_STRATEGIES[strat] || 'Normal.png'));
}

/**
 * Retourne le chemin de l'image depuis le nom de classe
 * @param {string} className - Nom de classe
 * @returns {string} Chemin image
 */
function cheminImageDepuisNomClasse(className){
  return encodeURI('../Assets/PNG des Agents/' + (CLASS_TO_IMAGE[className] || 'Normal.png'));
}

/**
 * Convertit un nom de classe en libellé lisible
 * @param {string} className - Nom de classe
 * @returns {string} Libellé en français
 */
function labelDepuisNomClasse(className){
  return CLASS_TO_LABEL[className] || className.replace(/(Strategy|Strategie)$/,'');
}

/**
 * Convertit une clé en libellé lisible
 * @param {string} cle - Clé de stratégie
 * @returns {string} Libellé en français
 */
function labelDepuisCle(cle){
  return KEY_TO_LABEL[cle] || cle;
}

// Au chargement on initialise seulement si le formulaire duel est présent
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('formulaire-duel')) initialiserDuel();
});

/**
 * Initialise l'interface du mode duel
 */
function initialiserDuel(){
  const slider = document.getElementById('bruit');
  const spanBruit = document.getElementById('valeur-bruit');
  if (slider && spanBruit){
    const maj = () => spanBruit.textContent = slider.value + '%';
    slider.addEventListener('input', maj); maj();
  }
  // Avatars
  const sel1 = document.getElementById('strategie-joueur1');
  const sel2 = document.getElementById('strategie-joueur2');
  if (sel1) sel1.addEventListener('change', mettreAJourAvatars);
  if (sel2) sel2.addEventListener('change', mettreAJourAvatars);
  mettreAJourAvatars();
  // Bouton lancer
  const btn = document.getElementById('bouton-lancer-duel');
  if (btn) {
    btn.addEventListener('click', () => {
      btn.disabled = true;
      lancerSimulation();
      setTimeout(() => btn.disabled = false, 500);
    });
  }
}

/**
 * Met à jour les images des avatars
 */
function mettreAJourAvatars(){
  const sel1 = document.getElementById('strategie-joueur1');
  const sel2 = document.getElementById('strategie-joueur2');
  const img1 = document.getElementById('avatar-joueur1');
  const img2 = document.getElementById('avatar-joueur2');
  if (sel1 && img1) img1.src = cheminImage(sel1.value);
  if (sel2 && img2) img2.src = cheminImage(sel2.value);
}

/**
 * Lit la configuration du formulaire
 * @returns {Object} Configuration du duel
 */
function lireConfiguration(){
  const s1 = document.getElementById('strategie-joueur1').value;
  const s2 = document.getElementById('strategie-joueur2').value;
  const manches = parseInt(document.getElementById('nombre-manches').value || '10', 10);
  const bruit = parseInt(document.getElementById('bruit').value || '0', 10);
  
  // Gains par défaut (R=3, T=5, P=1, S=0)
  const R = 3;
  const T = 5;
  const P = 1;
  const S = 0;
  return { s1, s2, manches, bruit, payoff: new Payoff({ R, T, P, S }) };
}

/** État pour le mode humain */
let etatHumain = null

/**
 * Lance la simulation (auto vs auto ou humain vs auto)
 */
function lancerSimulation(){
  const cfg = lireConfiguration();
  
  // Validation stricte des entrées
  if (cfg.manches < 1 || cfg.manches > 100) {
    alert('❌ Erreur: Le nombre de manches doit être entre 1 et 100');
    return;
  }
  
  if (cfg.bruit < 0 || cfg.bruit > 100) {
    alert('❌ Erreur: Le bruit doit être entre 0% et 100%');
    return;
  }
  
  // Mise à jour avatars résultats
  const avA = document.getElementById('arena-avatar-a');
  const avB = document.getElementById('arena-avatar-b');
  if (avA) avA.src = cheminImage(cfg.s1);
  if (avB) avB.src = cheminImage(cfg.s2);
  const zone = document.getElementById('zone-resultats');
  const emptyState = document.getElementById('duel-empty-state');
  if (zone) {
    zone.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    // Auto-scroll vers résultats
    setTimeout(() => {
      zone.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  if (cfg.s1 === 'joueur') {
    // Mode humain contre une stratégie auto (joueur 2)
    etatHumain = {
      historique: new Historique(),
      payoff: cfg.payoff,
      adversaire: construireStrategy(cfg.s2),
      rng: new RNG(Date.now()),
      bruit: cfg.bruit,
      manchesMax: cfg.manches
    };
    preparerInterfaceHumain();
    majInfosHumain();
  } else {
    // Simulation auto
    const stratA = construireStrategy(cfg.s1);
    const stratB = construireStrategy(cfg.s2);
    const hist = simulerDuel({
      strategyA: stratA,
      strategyB: stratB,
      payoff: cfg.payoff,
      manches: cfg.manches,
      bruit: cfg.bruit,
      seed: Date.now()
    });
    afficherResultats(hist);
  }
}

/**
 * Prépare l'interface pour le mode humain
 */
function preparerInterfaceHumain(){
  // Afficher l'arène uniquement (plus de panel-actions séparé)
  const humanArena = document.getElementById('human-arena');
  const emptyState = document.getElementById('duel-empty-state');
  const zoneResultats = document.getElementById('zone-resultats');
  
  if (humanArena) humanArena.style.display = 'flex';
  if (emptyState) emptyState.style.display = 'none';
  if (zoneResultats) zoneResultats.style.display = 'none';
  
  // Boutons actions (maintenant dans human-arena)
  const btnC = document.getElementById('btn-cooperer');
  const btnT = document.getElementById('btn-trahir');
  if (btnC) btnC.onclick = ()=>tourHumain('C');
  if (btnT) btnT.onclick = ()=>tourHumain('T');
  
  const scores = document.getElementById('scores-finaux'); if (scores) scores.innerHTML='';
  const histo = document.getElementById('historique-manches'); if (histo) histo.innerHTML='';
  const graph = document.getElementById('graphique-container'); if (graph) graph.innerHTML='';
  
  // Réinitialiser les scores affichés à 0
  const scoreHuman = document.getElementById('score-human');
  const scoreAdv = document.getElementById('score-adversaire-human');
  if (scoreHuman) scoreHuman.textContent = '0';
  if (scoreAdv) scoreAdv.textContent = '0';
  
  // Afficher les avatars et noms
  const avatarLeft = document.getElementById('avatar-human-left');
  const avatarRight = document.getElementById('avatar-human-right');
  const nomAdv = document.getElementById('nom-adversaire-human');
  
  const cfg = lireConfiguration();
  if (avatarLeft) avatarLeft.src = cheminImage('joueur');
  if (avatarRight) avatarRight.src = cheminImage(cfg.s2);
  if (nomAdv) nomAdv.textContent = labelDepuisCle(cfg.s2);
}

/**
 * Met à jour le numéro de manche courante
 */
function majInfosHumain(){
  if (!etatHumain) return;
  const num = document.getElementById('numero-manche-courante');
  if (num) num.textContent = (etatHumain.historique.tours.length + 1).toString();
  if (etatHumain.historique.tours.length >= etatHumain.manchesMax){
    afficherResultats(etatHumain.historique);
    // Masquer l'arène uniquement (plus de panel-actions)
    const humanArena = document.getElementById('human-arena');
    if (humanArena) humanArena.style.display = 'none';
  }
}

/**
 * Exécute un tour en mode humain
 * @param {string} actionJoueur - 'C' ou 'T'
 */
function tourHumain(actionJoueur){
  if (!etatHumain) return;
  // Empêcher de jouer si le match est terminé
  if (etatHumain.historique.tours.length >= etatHumain.manchesMax) {
    alert('⚠️ Le match est déjà terminé');
    return;
  }
  
  let actionAdv = etatHumain.adversaire.nextAction({ historique: etatHumain.historique, me: 'B', opponent: 'A' });
  const p = etatHumain.bruit/100;
  if (etatHumain.rng.chance(p)) actionJoueur = actionJoueur === 'C' ? 'T':'C';
  if (etatHumain.rng.chance(p)) actionAdv = actionAdv === 'C' ? 'T':'C';
  const turn = new Turn(etatHumain.historique.tours.length, actionJoueur, actionAdv, etatHumain.payoff);
  etatHumain.historique.ajouter(turn);
  rafraichirHistoriqueIntermediaire();
  rafraichirScoresIntermediaires();
  rafraichirGraphIntermediaire();
  majInfosHumain();
}

/**
 * Rafraîchit l'affichage des scores intermédiaires
 */
function rafraichirScoresIntermediaires(){
  if (!etatHumain) return;
  
  // Mise à jour en temps réel des scores affichés
  const scoreHuman = document.getElementById('score-human');
  const scoreAdv = document.getElementById('score-adversaire-human');
  if (scoreHuman) scoreHuman.textContent = etatHumain.historique.totalA.toString();
  if (scoreAdv) scoreAdv.textContent = etatHumain.historique.totalB.toString();
  
  const scores = document.getElementById('scores-finaux');
  if (scores){
    const res = resultatDuel(etatHumain.historique.totalA, etatHumain.historique.totalB);
    scores.innerHTML = `
      <div class="surface">
        <h3>Scores (en cours)</h3>
        <p>Joueur 1: <strong>${etatHumain.historique.totalA}</strong> — Joueur 2: <strong>${etatHumain.historique.totalB}</strong></p>
        <p>Statut: <strong>${res.label}</strong></p>
      </div>`;
  }
}

/**
 * Rafraîchit le tableau de l'historique
 */
function rafraichirHistoriqueIntermediaire(){
  if (!etatHumain) return;
  const histo = document.getElementById('historique-manches');
  if (histo){
    const lignes = etatHumain.historique.tours.map(t => `<tr><td>${t.index+1}</td><td>${t.actionA}</td><td>${t.actionB}</td><td>${t.gainA}</td><td>${t.gainB}</td></tr>`).join('');
    histo.innerHTML = `
      <h3>Détail des manches</h3>
      <table class="table">
        <thead><tr><th>#</th><th>A</th><th>B</th><th>Gain A</th><th>Gain B</th></tr></thead>
        <tbody>${lignes}</tbody>
      </table>`;
  }
}

/**
 * Rafraîchit le graphique des scores
 */
function rafraichirGraphIntermediaire(){
  if (!etatHumain) return;
  const graph = document.getElementById('graphique-container');
  if (graph){
    graph.innerHTML = '<canvas id="graph-scores" class="chart"></canvas>';
    dessinerGraphique('graph-scores', etatHumain.historique);
  }
}

/**
 * Affiche les résultats finaux d'un duel
 * @param {Historique} hist
 */
function afficherResultats(hist){
  const zone = document.getElementById('zone-resultats');
  const emptyState = document.getElementById('duel-empty-state');
  const humanArena = document.getElementById('human-arena');
  
  if (zone) {
    zone.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    // Cacher l'arène de jeu en mode humain
    if (humanArena) humanArena.style.display = 'none';
    // Auto-scroll vers résultats
    setTimeout(() => {
      zone.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  // Mettre à jour les images des avatars avec les vrais noms de classes
  const avA = document.getElementById('arena-avatar-a');
  const avB = document.getElementById('arena-avatar-b');
  if (avA && hist.agentA) avA.src = cheminImageDepuisNomClasse(hist.agentA.nom);
  if (avB && hist.agentB) avB.src = cheminImageDepuisNomClasse(hist.agentB.nom);
  if (avA && !hist.agentA) {
    const cle1 = (document.getElementById('strategie-joueur1')||{}).value;
    if (cle1) avA.src = cheminImage(cle1);
  }
  if (avB && !hist.agentB) {
    const cle2 = (document.getElementById('strategie-joueur2')||{}).value;
    if (cle2) avB.src = cheminImage(cle2);
  }

  // Afficher les noms des agents dans les labels
  const labA = document.getElementById('label-a');
  const labB = document.getElementById('label-b');
  if (labA && hist.agentA) labA.textContent = labelDepuisNomClasse(hist.agentA.nom);
  if (labB && hist.agentB) labB.textContent = labelDepuisNomClasse(hist.agentB.nom);
  // Fallback libellés si pas d'agents (mode humain)
  if (labA && !hist.agentA) {
    const cle1 = (document.getElementById('strategie-joueur1')||{}).value;
    if (cle1) labA.textContent = labelDepuisCle(cle1);
  }
  if (labB && !hist.agentB) {
    const cle2 = (document.getElementById('strategie-joueur2')||{}).value;
    if (cle2) labB.textContent = labelDepuisCle(cle2);
  }

  // Scores finaux dans les grosses boîtes
  const scoreA = document.getElementById('score-a');
  const scoreB = document.getElementById('score-b');
  if (scoreA) scoreA.textContent = hist.totalA;
  if (scoreB) scoreB.textContent = hist.totalB;

  // Scores détaillés
  const scores = document.getElementById('scores-finaux');
  if (scores){
    const nomA = hist.agentA ? labelDepuisNomClasse(hist.agentA.nom) : 'Joueur 1';
    const nomB = hist.agentB ? labelDepuisNomClasse(hist.agentB.nom) : 'Joueur 2';
    const res = resultatDuel(hist.totalA, hist.totalB);
    scores.innerHTML = `
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px; color: var(--primary); font-size: 20px;">Résultat du Duel</h3>
        <p style="margin: 0; color: var(--text-light);"><strong style="color: var(--secondary);">${nomA}</strong>: ${hist.totalA} points — <strong style="color: var(--primary);">${nomB}</strong>: ${hist.totalB} points</p>
        <p style="margin: 8px 0 0; font-size: 18px; color: var(--accent); font-weight: 700;">${res.label}</p>
      </div>`;
  }

  // Historique
  const histo = document.getElementById('historique-manches');
  if (histo){
    const lignes = hist.tours.map(t => `<tr><td>${t.index+1}</td><td>${t.actionA}</td><td>${t.actionB}</td><td>${t.gainA}</td><td>${t.gainB}</td></tr>`).join('');
    histo.innerHTML = `
      <h3>Détail des manches</h3>
      <table class="table">
        <thead><tr><th>#</th><th>A</th><th>B</th><th>Gain A</th><th>Gain B</th></tr></thead>
        <tbody>${lignes}</tbody>
      </table>`;
  }

  // Graphique
  const graph = document.getElementById('graphique-container');
  if (graph){
    graph.innerHTML = '<canvas id="graph-scores" class="chart"></canvas>';
    dessinerGraphique('graph-scores', hist);
  }
}

/**
 * Détermine le résultat d'un duel
 * @returns {Object} {gagnant, label}
 */
function resultatDuel(a, b){
  if (a > b) return { gagnant: 'A', label: 'Victoire Joueur 1' };
  if (b > a) return { gagnant: 'B', label: 'Victoire Joueur 2' };
  return { gagnant: null, label: 'Égalité' };
}

/**
 * Dessine un graphique des scores cumulés
 */
function dessinerGraphique(id, hist){
  const canvas = document.getElementById(id); if (!canvas) return;
  const w = canvas.clientWidth || 600, h = 260, r = window.devicePixelRatio || 1;
  canvas.width = w * r; canvas.height = h * r; const ctx = canvas.getContext('2d'); ctx.scale(r,r);
  ctx.fillStyle = '#f6f7fb'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = '#e5e7eb'; for (let i=0;i<=4;i++){ const y=20+i*((h-40)/4); ctx.beginPath(); ctx.moveTo(40,y); ctx.lineTo(w-10,y); ctx.stroke(); }
  const { A, B } = hist.cumulScores(); const n=Math.max(A.length,1); const max=Math.max(1,...A,...B);
  const px=i=>40+(i/(n-1||1))*(w-60); const py=v=>(h-20)-(v/max)*(h-40);
  
  // Tracer les lignes
  const trace=(data,col)=>{ 
    ctx.strokeStyle=col; ctx.lineWidth=2; ctx.beginPath(); 
    data.forEach((v,i)=>{ 
      const x=px(i), y=py(v); 
      if(i===0) ctx.moveTo(x,y); 
      else ctx.lineTo(x,y); 
    }); 
    ctx.stroke(); 
  };
  
  // Tracer les points (cercles) pour chaque manche
  const tracePoints=(data,col)=>{
    ctx.fillStyle=col;
    data.forEach((v,i)=>{
      const x=px(i), y=py(v);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  
  trace(A,'#6366f1'); trace(B,'#10b981');
  tracePoints(A,'#6366f1'); tracePoints(B,'#10b981');
  
  ctx.fillStyle='#1f2937'; ctx.font='12px system-ui'; ctx.fillText('Score cumulé A',48,16); ctx.fillStyle='#6366f1'; ctx.fillRect(40,8,6,6);
  ctx.fillStyle='#1f2937'; ctx.fillText('Score cumulé B',160,16); ctx.fillStyle='#10b981'; ctx.fillRect(152,8,6,6);
}