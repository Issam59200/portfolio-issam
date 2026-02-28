import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { simulerDuel } from './core/jeu.js';
import { Payoff } from './core/gain.js';
import { construireStrategy } from './core/strategie.js';
import { STRATEGY_IMAGES, STRATEGY_LABELS, STRATEGY_COLORS } from './constants';

/* ── Config ─────────────────────────────────────────── */
const EVO_KEYS = ['cooperer', 'titfortat', 'trahir'];
const INITIAL_POP = { cooperer: 23, titfortat: 1, trahir: 1 };
const imageCache = {};

function loadImg(key) {
  if (imageCache[key]) return imageCache[key];
  const img = new Image();
  img.src = encodeURI(STRATEGY_IMAGES[key]);
  imageCache[key] = img;
  return img;
}

/* ═══════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════ */
export default function EvolutionPage() {
  const [population, setPopulation] = useState({ ...INITIAL_POP });
  const [generation, setGeneration] = useState(0);
  const [historique, setHistorique] = useState([{ generation: 0, population: { ...INITIAL_POP } }]);
  const [manchesParMatch, setManchesParMatch] = useState(10);
  const [running, setRunning] = useState(false);
  const circleRef = useRef(null);
  const graphRef = useRef(null);
  const runningRef = useRef(false);
  const imagesReady = useRef(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* Pre-load images */
  useEffect(() => {
    let loaded = 0;
    EVO_KEYS.forEach(k => {
      const img = loadImg(k);
      if (img.complete) { loaded++; }
      else { img.onload = () => { loaded++; if (loaded === EVO_KEYS.length) { imagesReady.current = true; dessinerCercle(); } }; }
    });
    if (loaded === EVO_KEYS.length) imagesReady.current = true;
  }, []);

  /* ── Circle canvas (with agent images) ──────────── */
  const dessinerCercle = useCallback(() => {
    const canvas = circleRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width, h = rect.height;

    // Background
    ctx.fillStyle = 'var(--bg-light, #0d0d1a)';
    ctx.fillRect(0, 0, w, h);

    // Build agent list
    const agents = [];
    for (const [key, count] of Object.entries(population)) {
      for (let i = 0; i < count; i++) agents.push(key);
    }
    if (!agents.length) return;

    const cx = w / 2, cy = h / 2;
    const radius = Math.min(w, h) * 0.42;
    const size = 36;
    const half = size / 2;

    // Agent positions
    const positions = agents.map((key, i) => {
      const angle = (i / agents.length) * Math.PI * 2 - Math.PI / 2;
      return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, key };
    });

    // Draw connections
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        ctx.beginPath();
        ctx.moveTo(positions[i].x, positions[i].y);
        ctx.lineTo(positions[j].x, positions[j].y);
        ctx.stroke();
      }
    }

    // Draw each agent
    positions.forEach(p => {
      const color = STRATEGY_COLORS[p.key] || '#fff';
      const img = imageCache[p.key];

      // Glow
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, half, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0a0f';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Image
      if (img && img.complete) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, half - 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, p.x - half, p.y - half, size, size);
        ctx.restore();
      }
    });

    // Center text
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`Gén ${generation}`, cx, cy - 8);
    ctx.fillText(`${agents.length} agents`, cx, cy + 12);
  }, [population, generation]);

  useEffect(() => { dessinerCercle(); }, [dessinerCercle]);

  /* ── Graph canvas (population curves) ───────────── */
  useEffect(() => {
    const canvas = graphRef.current;
    if (!canvas || historique.length < 1) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width, h = rect.height;

    ctx.clearRect(0, 0, w, h);
    const pad = { top: 20, right: 20, bottom: 35, left: 50 };
    const gw = w - pad.left - pad.right;
    const gh = h - pad.top - pad.bottom;

    // Max/min
    let maxPop = 0;
    historique.forEach(entry => {
      EVO_KEYS.forEach(k => { maxPop = Math.max(maxPop, entry.population[k] || 0); });
    });
    if (maxPop === 0) maxPop = 1;

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (i / 4) * gh;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, h - pad.bottom);
    ctx.lineTo(w - pad.right, h - pad.bottom);
    ctx.stroke();

    // Lines per strategy
    EVO_KEYS.forEach(key => {
      const color = STRATEGY_COLORS[key];
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      historique.forEach((entry, i) => {
        const x = pad.left + (i / Math.max(historique.length - 1, 1)) * gw;
        const val = entry.population[key] || 0;
        const y = pad.top + gh - (val / maxPop) * gh;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(String(maxPop), pad.left - 6, pad.top + 10);
    ctx.fillText('0', pad.left - 6, h - pad.bottom + 4);
    ctx.textAlign = 'center';
    ctx.fillText('Générations', w / 2, h - 6);
    if (historique.length > 1) {
      ctx.fillText('0', pad.left, h - pad.bottom + 14);
      ctx.fillText(String(historique.length - 1), w - pad.right, h - pad.bottom + 14);
    }
  }, [historique]);

  /* ── Simulate one generation ────────────────────── */
  const simulerGeneration = useCallback(() => {
    setPopulation(prevPop => {
      const agents = [];
      for (const [cle, nombre] of Object.entries(prevPop)) {
        for (let i = 0; i < nombre; i++) agents.push({ strategie: cle, score: 0 });
      }
      if (agents.length <= 1) return prevPop;

      const payoff = new Payoff({ R: 3, T: 5, P: 1, S: 0 });
      for (let i = 0; i < agents.length; i++) {
        for (let j = i + 1; j < agents.length; j++) {
          const res = simulerDuel({
            strategyA: construireStrategy(agents[i].strategie),
            strategyB: construireStrategy(agents[j].strategie),
            payoff,
            manches: manchesParMatch,
            bruit: 0,
            seed: Date.now() + i * 1000 + j,
          });
          agents[i].score += res.totalA;
          agents[j].score += res.totalB;
        }
      }

      agents.sort((a, b) => b.score - a.score);
      const nombreAGarder = Math.ceil(agents.length * 0.7);
      const survivants = agents.slice(0, nombreAGarder);
      const nombreAReproduire = agents.length - nombreAGarder;
      for (let i = 0; i < nombreAReproduire; i++) {
        const parent = survivants[i % Math.ceil(nombreAGarder * 0.3)];
        survivants.push({ strategie: parent.strategie, score: 0 });
      }

      const novPop = {};
      EVO_KEYS.forEach(k => (novPop[k] = 0));
      survivants.forEach(a => novPop[a.strategie]++);

      setGeneration(prev => {
        const newGen = prev + 1;
        setHistorique(prevH => [...prevH, { generation: newGen, population: { ...novPop } }]);
        return newGen;
      });
      return novPop;
    });
  }, [manchesParMatch]);

  /* ── Auto-play ──────────────────────────────────── */
  useEffect(() => {
    runningRef.current = running;
    if (!running) return;
    const interval = setInterval(() => {
      if (!runningRef.current) return clearInterval(interval);
      simulerGeneration();
    }, 600);
    return () => clearInterval(interval);
  }, [running, simulerGeneration]);

  const reset = () => {
    setRunning(false);
    setPopulation({ ...INITIAL_POP });
    setGeneration(0);
    setHistorique([{ generation: 0, population: { ...INITIAL_POP } }]);
  };

  const total = Object.values(population).reduce((s, v) => s + v, 0);

  /* ═══ Render ════════════════════════════════════════ */
  return (
    <div className="evolution-container">
      <div className="evolution-main">
        {/* ── TOP: controls + circle ── */}
        <div className="evolution-top">
          {/* Control panel (left) */}
          <aside className="control-panel">
            <div>
              <h2>Contrôles</h2>
              <div className="controls">
                <button className="btn" onClick={() => setRunning(r => !r)}>
                  {running ? '⏸️ Stop' : '▶️ Start'}
                </button>
                <button className="btn btn-outline" onClick={simulerGeneration} disabled={running}>
                  ➡️ Prochaine génération
                </button>
                <button className="btn btn-ghost" onClick={reset}>
                  🔄 Réinitialiser
                </button>
              </div>
            </div>

            {/* Rounds slider */}
            <div className="slider-group">
              <label>Rounds par match :</label>
              <input
                type="range" min={1} max={20}
                value={manchesParMatch}
                onChange={e => setManchesParMatch(+e.target.value)}
              />
              <div className="range-labels">
                <span>1</span>
                <span className="valeur-range">{manchesParMatch}</span>
                <span>20</span>
              </div>
            </div>

            {/* Generation info */}
            <div className="info-generation">
              <h3>Génération : <span style={{ color: 'var(--primary)' }}>{generation}</span></h3>
              <p>Population : {total}</p>
            </div>

            {/* Strategy stats */}
            <div>
              <h3 style={{ margin: '0 0 12px', fontSize: 14 }}>Statistiques</h3>
              {EVO_KEYS.map(key => (
                <div key={key} className="strategy-stat" style={{ borderLeftColor: STRATEGY_COLORS[key] }}>
                  <span className="name">
                    <span style={{
                      display: 'inline-block', width: 12, height: 12,
                      background: STRATEGY_COLORS[key], borderRadius: '50%', marginRight: 8,
                    }} />
                    {STRATEGY_LABELS[key]}
                  </span>
                  <span className="values">
                    Population : <strong>{population[key] || 0}</strong>
                  </span>
                </div>
              ))}
            </div>
          </aside>

          {/* Circle canvas (right) */}
          <section className="chart-section">
            <h2>Distribution des stratégies</h2>
            <canvas ref={circleRef} id="canvas-cercle" />
          </section>
        </div>

        {/* ── BOTTOM: graph ── */}
        <div className="evolution-bottom">
          <section className="chart-section">
            <h2>Évolution des populations</h2>
            <canvas ref={graphRef} className="chart-canvas" />
          </section>
        </div>
      </div>

      {/* ── Explanation ── */}
      <section className="section-explication">
        <h2>Comprendre l'évolution de la confiance</h2>

        <p>
          Commençons par un monde idéal : une population remplie de <strong>Coopérateurs</strong>,
          avec un seul <strong>Traître</strong> et un <strong>Tit-for-Tat</strong>. Comme vous pouvez le constater,
          Tit-for-Tat domine largement sur le long terme avec les règles actuelles !
        </p>

        <p>
          Mais ces résultats dépendent de nos règles : <strong>{manchesParMatch} tours par match</strong>.
          Est-ce que Tit-for-Tat gagne toujours avec 7 tours ? 5 tours ? 3 tours ?
        </p>

        <div className="encart-info">
          <p style={{ margin: 0 }}>
            <strong>Expérimentez !</strong> Modifiez le nombre de tours avec le curseur à gauche,
            puis lancez la simulation pour observer ce qui se passe.
          </p>
        </div>

        <p>
          Vous découvrirez que <strong>si vous ne jouez pas assez de tours (5 ou moins),
          le Traître domine complètement</strong>. Pourquoi ? Sans interactions répétées,
          il n'y a pas de temps pour construire la confiance.
        </p>

        <h3>L'importance des interactions répétées</h3>
        <p>
          En 1985, quand on demandait aux Américains combien d'amis proches ils avaient,
          la réponse la plus courante était "trois". En 2004, c'était "zéro".
          <strong> Moins il y a d'interactions répétées, plus la méfiance se répand.</strong>
        </p>

        <h3>Aller plus loin</h3>
        <p>
          Vous voulez explorer d'autres paramètres comme les gains (payoffs) et voir comment
          ils influencent l'évolution de la confiance ?
        </p>
        <p>
          <Link to="/dilemme/sandbox" className="btn">
            🧪 Découvrir le mode Sandbox
          </Link>
        </p>
      </section>
    </div>
  );
}
