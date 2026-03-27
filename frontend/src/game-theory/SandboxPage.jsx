import { useState, useRef, useEffect, useCallback } from 'react';
import { simulerDuel } from './core/jeu.js';
import { Payoff } from './core/gain.js';
import { construireStrategy } from './core/strategie.js';
import {
  ALL_STRATEGIES,
  STRATEGY_IMAGES,
  STRATEGY_COLORS,
} from './constants';
import { useStrategyLabels } from './useStrategyLabels.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';

/* ── Config ─────────────────────────────────────────── */
const MAX_AGENTS = 30;

const DEFAULT_POP = {
  cooperer: 3, trahir: 3, titfortat: 3,
  grudger: 3, detective: 3, aleatoire: 4, pavlov: 3,
};

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
export default function SandboxPage() {
  /* state */
  const [population, setPopulation] = useState({ ...DEFAULT_POP });
  const [generation, setGeneration] = useState(0);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('population');
  const [payoff, setPayoff] = useState({ R: 3, T: 5, P: 1, S: 0 });
  const [rounds, setRounds] = useState(10);
  const [eliminate, setEliminate] = useState(5);
  const [noise, setNoise] = useState(5);

  const canvasRef = useRef(null);
  const runningRef = useRef(false);

  // Ajout du hook pour les labels dynamiques
  const { STRATEGY_LABELS } = useStrategyLabels();
  const { t } = useLanguage();
  const d = t.dilemme;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* Pre-load images */
  useEffect(() => {
    ALL_STRATEGIES.forEach(loadImg);
  }, []);

  const totalPop = Object.values(population).reduce((s, v) => s + v, 0);

  /* ── Canvas ─────────────────────────────────────── */
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width, h = rect.height;

    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, w, h);

    const agents = [];
    for (const [key, count] of Object.entries(population)) {
      for (let i = 0; i < count; i++) agents.push(key);
    }
    if (!agents.length) return;

    const cx = w / 2, cy = h / 2;
    const radius = Math.min(w, h) * 0.42;
    const size = 44, half = size / 2;

    const positions = agents.map((key, i) => {
      const angle = (i / agents.length) * Math.PI * 2 - Math.PI / 2;
      return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, key };
    });

    // Connections
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        ctx.beginPath();
        ctx.moveTo(positions[i].x, positions[i].y);
        ctx.lineTo(positions[j].x, positions[j].y);
        ctx.stroke();
      }
    }

    // Agents
    positions.forEach(p => {
      const color = STRATEGY_COLORS[p.key] || '#fff';
      const img = imageCache[p.key];

      // Border glow
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
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
  }, [population]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  /* ── Simulation step ────────────────────────────── */
  const runStep = useCallback(() => {
    setPopulation(prevPop => {
      const agents = [];
      for (const [key, count] of Object.entries(prevPop)) {
        for (let i = 0; i < count; i++) agents.push({ strategy: key, score: 0 });
      }
      if (agents.length < 2) return prevPop;

      const p = new Payoff(payoff);
      for (let i = 0; i < agents.length; i++) {
        for (let j = i + 1; j < agents.length; j++) {
          const res = simulerDuel({
            strategyA: construireStrategy(agents[i].strategy),
            strategyB: construireStrategy(agents[j].strategy),
            payoff: p,
            manches: rounds,
            bruit: noise,
            seed: Date.now() + i * 1000 + j,
          });
          agents[i].score += res.totalA;
          agents[j].score += res.totalB;
        }
      }

      agents.sort((a, b) => b.score - a.score);
      const elim = Math.min(eliminate, Math.floor(agents.length / 2));
      const survivors = agents.slice(0, agents.length - elim);
      const reproducers = agents.slice(0, elim);

      const novPop = {};
      ALL_STRATEGIES.forEach(k => (novPop[k] = 0));
      survivors.forEach(a => novPop[a.strategy]++);
      reproducers.forEach(a => novPop[a.strategy]++);

      setGeneration(g => g + 1);
      return novPop;
    });
  }, [payoff, rounds, noise, eliminate]);

  /* ── Auto-play ──────────────────────────────────── */
  useEffect(() => {
    runningRef.current = running;
    if (!running) return;
    const interval = setInterval(() => {
      if (!runningRef.current) return clearInterval(interval);
      runStep();
    }, 1000);
    return () => clearInterval(interval);
  }, [running, runStep]);

  /* ── Population +/- ─────────────────────────────── */
  const adjustPop = (key, delta) => {
    setPopulation(prev => {
      const total = Object.values(prev).reduce((s, v) => s + v, 0);
      if (delta > 0 && total >= MAX_AGENTS) return prev;
      const newVal = Math.max(0, Math.min(MAX_AGENTS, (prev[key] || 0) + delta));
      return { ...prev, [key]: newVal };
    });
  };

  const resetAll = () => {
    setRunning(false);
    setPopulation({ ...DEFAULT_POP });
    setGeneration(0);
    setPayoff({ R: 3, T: 5, P: 1, S: 0 });
    setRounds(10);
    setEliminate(5);
    setNoise(5);
  };

  /* ═══ Render ════════════════════════════════════════ */
  const TABS = [
    { id: 'population', label: d.sandboxTabPopulation },
    { id: 'gains', label: d.sandboxTabGains },
    { id: 'regles', label: d.sandboxTabRules },
    { id: 'bruit', label: d.sandboxTabNoise },
  ];

  return (
    <div className="sandbox-container">
      {/* ═══ LEFT: Arena ═══ */}
      <div className="arena-container">
        <div className="generation-info">
          <div>{d.sandboxGeneration} <strong style={{ fontSize: 24, color: 'var(--primary)' }}>{generation}</strong></div>
          <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>
            {d.sandboxTotalPop} {totalPop}
          </div>
        </div>
        <canvas ref={canvasRef} id="sandbox-canvas" />
      </div>

      {/* ═══ RIGHT: Controls ═══ */}
      <div className="controls-panel">
        {/* Tabs section */}
        <div className="control-section">
          <div className="tabs-header">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`tab-button${activeTab === t.id ? ' active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Population tab */}
          <div className={`tab-panel${activeTab === 'population' ? ' active' : ''}`}>
            {ALL_STRATEGIES.map(key => (
              <div
                key={key}
                className="strategy-item"
                style={{ borderLeft: `4px solid ${STRATEGY_COLORS[key]}` }}
              >
                <img src={encodeURI(STRATEGY_IMAGES[key])} alt={STRATEGY_LABELS[key]} />
                <div className="name">{STRATEGY_LABELS[key]}</div>
                <div className="count">{population[key] || 0}</div>
                <div className="controls">
                  <button onClick={() => adjustPop(key, -1)}>−</button>
                  <button onClick={() => adjustPop(key, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Gains tab */}
          <div className={`tab-panel${activeTab === 'gains' ? ' active' : ''}`}>
            {[
              { k: 'R', label: d.sandboxR },
              { k: 'T', label: d.sandboxT },
              { k: 'P', label: d.sandboxP },
              { k: 'S', label: d.sandboxS },
            ].map(({ k, label }) => (
              <div key={k} className="form-group" style={{ marginBottom: 16 }}>
                <label>{label}</label>
                <input
                  type="number" min={-50} max={50} step={0.5}
                  value={payoff[k]}
                  onChange={e => setPayoff(p => ({ ...p, [k]: +e.target.value }))}
                />
              </div>
            ))}
          </div>

          {/* Règles tab */}
          <div className={`tab-panel${activeTab === 'regles' ? ' active' : ''}`}>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>
                <span>{d.sandboxRoundsLabel}</span>
                <span className="valeur-range" style={{ float: 'right' }}>{rounds}</span>
              </label>
              <input type="range" min={1} max={50} value={rounds} onChange={e => setRounds(+e.target.value)} />
            </div>
            <div className="form-group">
              <label>
                <span>{d.sandboxElimLabel}</span>
                <span className="valeur-range" style={{ float: 'right' }}>{eliminate}</span>
              </label>
              <input type="range" min={1} max={10} value={eliminate} onChange={e => setEliminate(+e.target.value)} />
              <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>
                {typeof d.sandboxElimDesc === 'function' ? d.sandboxElimDesc(eliminate) : d.sandboxElimDesc}
              </div>
            </div>
          </div>

          {/* Bruit tab */}
          <div className={`tab-panel${activeTab === 'bruit' ? ' active' : ''}`}>
            <div className="form-group">
              <label>
                <span>{d.sandboxNoiseLabel}</span>
                <span className="valeur-range" style={{ float: 'right' }}>{noise}%</span>
              </label>
              <input type="range" min={0} max={100} value={noise} onChange={e => setNoise(+e.target.value)} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="control-section">
          <div className="action-buttons">
            <button className="btn" onClick={() => setRunning(r => !r)}>
              {running ? d.sandboxPauseBtn : d.sandboxStartBtn}
            </button>
            <button className="btn btn-outline" onClick={runStep} disabled={running || totalPop < 2}>
              {d.sandboxNextBtn}
            </button>
            <button className="btn btn-ghost" onClick={resetAll}>
              {d.sandboxResetBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
