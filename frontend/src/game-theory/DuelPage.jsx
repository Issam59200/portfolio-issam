import { useState, useRef, useEffect, useCallback } from 'react';
import { simulerDuel, Historique, Turn } from './core/jeu.js';
import { Payoff } from './core/gain.js';
import { construireStrategy } from './core/strategie.js';
import {
  ALL_STRATEGIES,
  STRATEGY_LABELS,
  STRATEGY_IMAGES,
} from './constants';

/* ── Helpers ── */
const cheminImage = (key) => encodeURI(STRATEGY_IMAGES[key] || '/agents/Normal.png');

export default function DuelPage() {
  /* ── State ── */
  const [mode, setMode] = useState('auto');
  const [stratA, setStratA] = useState('titfortat');
  const [stratB, setStratB] = useState('trahir');
  const [manches, setManches] = useState(10);
  const [bruit, setBruit] = useState(0);
  const [result, setResult] = useState(null);

  // Human mode state
  const [humanHistory, setHumanHistory] = useState(null);
  const [humanRound, setHumanRound] = useState(0);
  const [humanPayoff] = useState(() => new Payoff());
  const [lastTurnSummary, setLastTurnSummary] = useState(null);

  const canvasRef = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* ── Auto duel ── */
  const lancerDuel = useCallback(() => {
    const historique = simulerDuel({
      strategyA: construireStrategy(stratA),
      strategyB: construireStrategy(stratB),
      payoff: new Payoff(),
      manches,
      bruit,
      seed: Date.now(),
    });
    setResult(historique);
    setHumanHistory(null);
    setLastTurnSummary(null);
  }, [stratA, stratB, manches, bruit]);

  /* ── Human mode ── */
  const startHuman = () => {
    const hist = new Historique();
    setHumanHistory(hist);
    setHumanRound(0);
    setResult(null);
    setLastTurnSummary(null);
  };

  const humanPlay = (action) => {
    if (!humanHistory || humanRound >= manches) return;
    const opponentStrat = construireStrategy(stratB);
    // Feed existing history so opponent strategy can react
    const oppAction = opponentStrat.nextAction({ historique: humanHistory, me: 'B', opponent: 'A' });
    const turn = new Turn(humanRound, action, oppAction, humanPayoff);
    const newHist = Object.assign(Object.create(Object.getPrototypeOf(humanHistory)), humanHistory);
    newHist.tours = [...humanHistory.tours, turn];
    newHist.totalA = humanHistory.totalA + turn.gainA;
    newHist.totalB = humanHistory.totalB + turn.gainB;
    setHumanHistory(newHist);
    setHumanRound(humanRound + 1);
    setLastTurnSummary({
      yourAction: action,
      oppAction,
      gainA: turn.gainA,
      gainB: turn.gainB,
    });
  };

  /* ── Canvas graph ── */
  useEffect(() => {
    const data = result || humanHistory;
    if (!data || !canvasRef.current || data.tours.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const cumul = data.cumulScores();
    const maxVal = Math.max(...cumul.A, ...cumul.B, 1);
    const pad = { top: 30, right: 20, bottom: 30, left: 50 };
    const gw = w - pad.left - pad.right;
    const gh = h - pad.top - pad.bottom;
    const n = cumul.A.length;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (gh * i) / 4;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxVal * (1 - i / 4)), pad.left - 8, y + 4);
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, h - pad.bottom);
    ctx.lineTo(w - pad.right, h - pad.bottom);
    ctx.stroke();

    const drawLine = (points, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      points.forEach((val, i) => {
        const x = pad.left + (i / Math.max(n - 1, 1)) * gw;
        const y = pad.top + gh - (val / maxVal) * gh;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dots
      ctx.fillStyle = color;
      points.forEach((val, i) => {
        const x = pad.left + (i / Math.max(n - 1, 1)) * gw;
        const y = pad.top + gh - (val / maxVal) * gh;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    drawLine(cumul.A, '#00d9ff');
    drawLine(cumul.B, '#ff006e');

    // Legend
    ctx.font = 'bold 12px sans-serif';
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#00d9ff';
    ctx.textAlign = 'left';
    ctx.fillText('● ' + labelA, pad.left + 10, pad.top - 8);
    ctx.fillStyle = '#ff006e';
    ctx.fillText('● ' + labelB, pad.left + 160, pad.top - 8);
  }, [result, humanHistory]);

  /* ── Computed ── */
  const activeData = result || humanHistory;
  const labelA = mode === 'human' ? 'Vous (Joueur)' : STRATEGY_LABELS[stratA];
  const labelB = STRATEGY_LABELS[stratB];
  const imgA = mode === 'human' ? '/agents/Joueur.png' : cheminImage(stratA);
  const imgB = cheminImage(stratB);
  const isFinished = mode === 'human' && humanHistory && humanRound >= manches;

  return (
    <>
      <div className="duel-layout">
        {/* ═══ LEFT: Configuration Panel ═══ */}
        <div id="panel-config">
          <h3>⚙️ Configuration du Duel</h3>

          {/* Mode */}
          <div className="form-group">
            <label>Mode de jeu</label>
            <select value={mode} onChange={e => { setMode(e.target.value); setResult(null); setHumanHistory(null); setLastTurnSummary(null); }}>
              <option value="auto">🤖 Auto vs Auto</option>
              <option value="human">🎮 Humain vs IA</option>
            </select>
          </div>

          {/* Strategy A */}
          {mode === 'auto' && (
            <div className="form-group">
              <label>Stratégie A</label>
              <select value={stratA} onChange={e => setStratA(e.target.value)}>
                {ALL_STRATEGIES.map(k => <option key={k} value={k}>{STRATEGY_LABELS[k]}</option>)}
              </select>
              <div className="avatar-wrapper">
                <img className="avatar-strategie" src={imgA} alt={labelA} />
              </div>
            </div>
          )}
          {mode === 'human' && (
            <div className="form-group">
              <label>Vous</label>
              <div className="avatar-wrapper">
                <img className="avatar-strategie" src="/agents/Joueur.png" alt="Joueur" />
              </div>
            </div>
          )}

          {/* Strategy B */}
          <div className="form-group">
            <label>{mode === 'human' ? 'Adversaire (IA)' : 'Stratégie B'}</label>
            <select value={stratB} onChange={e => setStratB(e.target.value)}>
              {ALL_STRATEGIES.map(k => <option key={k} value={k}>{STRATEGY_LABELS[k]}</option>)}
            </select>
            <div className="avatar-wrapper">
              <img className="avatar-strategie" src={imgB} alt={labelB} />
            </div>
          </div>

          {/* Params */}
          <div className="form-group">
            <label>Nombre de manches</label>
            <input type="number" min={1} max={200} value={manches} onChange={e => setManches(Math.max(1, +e.target.value))} />
          </div>

          <div className="form-group">
            <label>Bruit : <span className="valeur-range">{bruit}%</span></label>
            <input type="range" min={0} max={50} value={bruit} onChange={e => setBruit(+e.target.value)} />
          </div>

          {/* Launch */}
          <div style={{ marginTop: '12px' }}>
            {mode === 'auto' ? (
              <button className="btn" style={{ width: '100%' }} onClick={lancerDuel}>⚔️ Lancer le Duel</button>
            ) : (
              <button className="btn btn-ghost" style={{ width: '100%' }} onClick={startHuman}>🎮 Commencer la Partie</button>
            )}
          </div>
        </div>

        {/* ═══ RIGHT: Game Zone ═══ */}
        <div>
          {/* Empty state */}
          {!activeData && (
            <div className="empty-state">
              <div className="icon">⚔️</div>
              <h3>VS</h3>
              <p>Configurez votre duel et lancez la simulation</p>
            </div>
          )}

          {/* ── Human Arena ── */}
          {mode === 'human' && humanHistory && !isFinished && (
            <div id="human-arena" className="visible" style={{ display: 'flex' }}>
              <h3>🎮 Tour {humanRound + 1} / {manches}</h3>

              <div className="human-score-cards">
                <div className="human-score-card player">
                  <img src="/agents/Joueur.png" alt="Joueur" />
                  <div className="name">Vous</div>
                  <div className="score">{humanHistory.totalA}</div>
                </div>
                <div className="human-score-card opponent">
                  <img src={imgB} alt={labelB} />
                  <div className="name">{labelB}</div>
                  <div className="score">{humanHistory.totalB}</div>
                </div>
              </div>

              <div className="human-action-buttons">
                <button className="btn btn-cooperer" onClick={() => humanPlay('C')}>🤝 Coopérer</button>
                <button className="btn btn-trahir" onClick={() => humanPlay('T')}>🗡️ Trahir</button>
              </div>

              {lastTurnSummary && (
                <div className="resume-tour">
                  <p>Vous avez <strong>{lastTurnSummary.yourAction === 'C' ? 'coopéré' : 'trahi'}</strong>, 
                  l'adversaire a <strong>{lastTurnSummary.oppAction === 'C' ? 'coopéré' : 'trahi'}</strong>. 
                  Gain : <strong style={{ color: 'var(--primary)' }}>+{lastTurnSummary.gainA}</strong> / <strong style={{ color: 'var(--secondary)' }}>+{lastTurnSummary.gainB}</strong></p>
                </div>
              )}
            </div>
          )}

          {/* ── Human finished ── */}
          {isFinished && (
            <div className="zone-resultats" style={{ textAlign: 'center', marginBottom: 24 }}>
              <h3>🏁 Partie terminée !</h3>
              <p style={{ fontSize: '1.3rem', fontWeight: 700, color: humanHistory.totalA > humanHistory.totalB ? 'var(--success)' : humanHistory.totalA < humanHistory.totalB ? 'var(--danger)' : 'var(--accent)' }}>
                {humanHistory.totalA > humanHistory.totalB ? '🎉 Vous avez gagné !' : humanHistory.totalA < humanHistory.totalB ? '😞 Vous avez perdu.' : '🤝 Match nul !'}
              </p>
              <p style={{ color: 'var(--text-light)' }}>
                Score final : <strong style={{ color: 'var(--primary)' }}>{humanHistory.totalA}</strong> — <strong style={{ color: 'var(--secondary)' }}>{humanHistory.totalB}</strong>
              </p>
            </div>
          )}

          {/* ── Auto results ── */}
          {result && (
            <div className="zone-resultats" style={{ marginBottom: 24 }}>
              <h3>🏆 Résultat du Duel</h3>
              <div className="results-avatars">
                <div className={`result-avatar-card ${result.totalA > result.totalB ? 'winner' : result.totalA < result.totalB ? 'loser' : 'draw'}`}>
                  <img src={imgA} alt={labelA} />
                  <div className="name">{labelA}</div>
                  <div className="score">{result.totalA}</div>
                </div>
                <div className="versus">VS</div>
                <div className={`result-avatar-card ${result.totalB > result.totalA ? 'winner' : result.totalB < result.totalA ? 'loser' : 'draw'}`}>
                  <img src={imgB} alt={labelB} />
                  <div className="name">{labelB}</div>
                  <div className="score">{result.totalB}</div>
                </div>
              </div>
            </div>
          )}

          {/* ── Graph ── */}
          {activeData && activeData.tours.length > 0 && (
            <div className="zone-resultats" style={{ marginBottom: 24 }}>
              <h3>📈 Évolution des scores cumulés</h3>
              <canvas ref={canvasRef} style={{ width: '100%', height: '300px', borderRadius: 8, background: 'var(--bg-light)', border: '1px solid var(--border)' }} />
            </div>
          )}

          {/* ── History table ── */}
          {activeData && activeData.tours.length > 0 && (
            <div className="zone-resultats">
              <h3>📋 Historique des manches</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Tour</th>
                      <th>{labelA}</th>
                      <th>{labelB}</th>
                      <th>Gain A</th>
                      <th>Gain B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeData.tours.map((t, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td style={{ color: t.actionA === 'C' ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                          {t.actionA === 'C' ? '🤝 Coopérer' : '🗡️ Trahir'}
                        </td>
                        <td style={{ color: t.actionB === 'C' ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                          {t.actionB === 'C' ? '🤝 Coopérer' : '🗡️ Trahir'}
                        </td>
                        <td style={{ fontWeight: 600 }}>+{t.gainA}</td>
                        <td style={{ fontWeight: 600 }}>+{t.gainB}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
