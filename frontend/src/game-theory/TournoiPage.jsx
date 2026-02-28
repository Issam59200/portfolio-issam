import { useState, useEffect } from 'react';
import { Tournament } from './core/tournoi.js';
import {
  ALL_STRATEGIES,
  STRATEGY_LABELS,
  STRATEGY_IMAGES,
  CLASS_TO_IMAGE,
  CLASS_TO_LABEL,
} from './constants';

const cheminImage = (className) => CLASS_TO_IMAGE[className] || '/agents/Normal.png';
const nomLisible  = (className) => CLASS_TO_LABEL[className] || className;

export default function TournoiPage() {
  const [selected, setSelected] = useState(['cooperer', 'trahir', 'titfortat', 'grudger', 'detective', 'aleatoire', 'pavlov']);
  const [manches, setManches] = useState(50);
  const [bruit, setBruit] = useState(0);
  const [gains, setGains] = useState({ R: 3, T: 5, P: 1, S: 0 });
  const [result, setResult] = useState(null);
  const [showMatchs, setShowMatchs] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const toggleStrategy = (key) => {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const lancerTournoi = () => {
    if (selected.length < 2) return;
    const tournoi = new Tournament({
      strategyKeys: selected,
      manches,
      bruit,
      payoffValues: gains,
    });
    const res = tournoi.jouerTournoi();
    setResult(res);
  };

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <>
      <div className="tournoi-layout">
        {/* ═══ LEFT: Configuration ═══ */}
        <div>
          {/* Strategy checkboxes */}
          <div className="form-section">
            <h3>🎯 Stratégies participantes</h3>
            <div className="strategy-checkboxes">
              {ALL_STRATEGIES.map(key => (
                <label key={key} className={`strategy-checkbox-item ${selected.includes(key) ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selected.includes(key)}
                    onChange={() => toggleStrategy(key)}
                  />
                  <img src={encodeURI(STRATEGY_IMAGES[key])} alt={STRATEGY_LABELS[key]} />
                  <span>{STRATEGY_LABELS[key]}</span>
                </label>
              ))}
            </div>
            <p style={{ color: 'var(--text-light)', fontSize: 13, marginTop: 8 }}>
              {selected.length} stratégie{selected.length > 1 ? 's' : ''} sélectionnée{selected.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Params */}
          <div className="form-section">
            <h3>⚙️ Paramètres</h3>
            <div className="form-group">
              <label>Manches par match</label>
              <input type="number" min={5} max={500} value={manches} onChange={e => setManches(Math.max(1, +e.target.value))} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label>Bruit : <span className="valeur-range">{bruit}%</span></label>
              <input type="range" min={0} max={50} value={bruit} onChange={e => setBruit(+e.target.value)} />
            </div>
          </div>

          {/* Gains */}
          <div className="form-section">
            <h3>💰 Matrice des Gains</h3>
            <div className="form-row">
              <div className="form-group">
                <label>R (Récompense)</label>
                <input type="number" value={gains.R} onChange={e => setGains({ ...gains, R: +e.target.value })} />
              </div>
              <div className="form-group">
                <label>T (Tentation)</label>
                <input type="number" value={gains.T} onChange={e => setGains({ ...gains, T: +e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>P (Punition)</label>
                <input type="number" value={gains.P} onChange={e => setGains({ ...gains, P: +e.target.value })} />
              </div>
              <div className="form-group">
                <label>S (Dupe)</label>
                <input type="number" value={gains.S} onChange={e => setGains({ ...gains, S: +e.target.value })} />
              </div>
            </div>
          </div>

          {/* Launch */}
          <button
            className="btn"
            style={{ width: '100%', marginTop: 16 }}
            onClick={lancerTournoi}
            disabled={selected.length < 2}
          >
            🏆 Lancer le Tournoi ({selected.length} stratégies)
          </button>
        </div>

        {/* ═══ RIGHT: Results ═══ */}
        <div>
          {!result && (
            <div className="empty-state">
              <div className="icon">🏆</div>
              <h3>Aucun tournoi lancé</h3>
              <p>Sélectionnez au moins 2 stratégies et lancez le tournoi</p>
            </div>
          )}

          {result && (
            <>
              {/* Classement */}
              <div className="zone-resultats">
                <h3>📊 Classement Final</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Stratégie</th>
                        <th>Score Total</th>
                        <th>Moyenne</th>
                        <th>V</th>
                        <th>N</th>
                        <th>D</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.classement.map((entry, i) => (
                        <tr key={i} className={i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}>
                          <td className="rank">{medals[i] || entry.rang}</td>
                          <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <img src={cheminImage(entry.strategie)} alt="" style={{ width: 28, height: 28, borderRadius: 4 }} />
                            {nomLisible(entry.strategie)}
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{entry.scoreTotal}</td>
                          <td>{Math.round(entry.scoreMoyen)}</td>
                          <td style={{ color: 'var(--success)' }}>{entry.victoires}</td>
                          <td>{entry.matchsNuls}</td>
                          <td style={{ color: 'var(--danger)' }}>{entry.defaites}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Matrice */}
              <div className="zone-resultats" style={{ marginTop: 24 }}>
                <h3>🔢 Matrice des Résultats</h3>
                <div className="matrice-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>VS</th>
                        {result.classement.map((e, i) => (
                          <th key={i} title={nomLisible(e.strategie)}>
                            <img src={cheminImage(e.strategie)} alt="" style={{ width: 24, height: 24 }} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.classement.map((row, ri) => (
                        <tr key={ri}>
                          <th style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                            <img src={cheminImage(row.strategie)} alt="" style={{ width: 22, height: 22 }} />
                            {nomLisible(row.strategie)}
                          </th>
                          {result.classement.map((col, ci) => {
                            if (row.strategie === col.strategie) {
                              return <td key={ci} className="self">—</td>;
                            }
                            const score = result.matriceScores[row.strategie]?.adversaires[col.strategie];
                            return <td key={ci}>{score ?? '—'}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Détails des matchs */}
              <div className="zone-resultats" style={{ marginTop: 24 }}>
                <h3
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowMatchs(!showMatchs)}
                >
                  {showMatchs ? '▼' : '▶'} Détails des matchs ({result.detailsMatches.length})
                </h3>
                {showMatchs && (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Match</th>
                          <th>Stratégie A</th>
                          <th>Score A</th>
                          <th>Score B</th>
                          <th>Stratégie B</th>
                          <th>Résultat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.detailsMatches.map((m, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <img src={cheminImage(m.stratA)} alt="" style={{ width: 20, height: 20 }} />
                              {nomLisible(m.stratA)}
                            </td>
                            <td style={{ fontWeight: 600, color: m.scoreA >= m.scoreB ? 'var(--success)' : 'var(--danger)' }}>{m.scoreA}</td>
                            <td style={{ fontWeight: 600, color: m.scoreB >= m.scoreA ? 'var(--success)' : 'var(--danger)' }}>{m.scoreB}</td>
                            <td>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <img src={cheminImage(m.stratB)} alt="" style={{ width: 20, height: 20 }} />
                                {nomLisible(m.stratB)}
                              </span>
                            </td>
                            <td>{m.scoreA > m.scoreB ? '🏆 A' : m.scoreB > m.scoreA ? '🏆 B' : '🤝'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
