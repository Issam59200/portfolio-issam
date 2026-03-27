import { useState, useEffect } from 'react';
import { Tournament } from './core/tournoi.js';
import {
  ALL_STRATEGIES,
  STRATEGY_IMAGES,
  CLASS_TO_IMAGE,
} from './constants';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useStrategyLabels } from './useStrategyLabels.js';

const cheminImage = (className) => CLASS_TO_IMAGE[className] || '/agents/Normal.png';

export default function TournoiPage() {
  const { t } = useLanguage();
  const d = t.dilemme;
  const { STRATEGY_LABELS, CLASS_TO_LABEL } = useStrategyLabels();

  const [selected, setSelected] = useState(['cooperer', 'trahir', 'titfortat', 'grudger', 'detective', 'aleatoire', 'pavlov']);
  const [manches, setManches] = useState(50);
  const [bruit, setBruit] = useState(0);
  const [gains, setGains] = useState({ R: 3, T: 5, P: 1, S: 0 });
  const [result, setResult] = useState(null);
  const [showMatchs, setShowMatchs] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const nomLisible = (className) => CLASS_TO_LABEL[className] || className;

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
            <h3>{d.tournoiStrategies}</h3>
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
              {d.tournoiSelected(selected.length)}
            </p>
          </div>

          {/* Params */}
          <div className="form-section">
            <h3>{d.tournoiParams}</h3>
            <div className="form-group">
              <label>{d.tournoiRounds}</label>
              <input type="number" min={5} max={500} value={manches} onChange={e => setManches(Math.max(1, +e.target.value))} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label>{d.tournoiNoise} <span className="valeur-range">{bruit}%</span></label>
              <input type="range" min={0} max={50} value={bruit} onChange={e => setBruit(+e.target.value)} />
            </div>
          </div>

          {/* Gains */}
          <div className="form-section">
            <h3>{d.tournoiGains}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>{d.tournoiR}</label>
                <input type="number" value={gains.R} onChange={e => setGains({ ...gains, R: +e.target.value })} />
              </div>
              <div className="form-group">
                <label>{d.tournoiT}</label>
                <input type="number" value={gains.T} onChange={e => setGains({ ...gains, T: +e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{d.tournoiP}</label>
                <input type="number" value={gains.P} onChange={e => setGains({ ...gains, P: +e.target.value })} />
              </div>
              <div className="form-group">
                <label>{d.tournoiS}</label>
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
            {d.tournoiLaunch(selected.length)}
          </button>
        </div>

        {/* ═══ RIGHT: Results ═══ */}
        <div>
          {!result && (
            <div className="empty-state">
              <div className="icon">🏆</div>
              <h3>{d.tournoiEmptyTitle}</h3>
              <p>{d.tournoiEmptyDesc}</p>
            </div>
          )}

          {result && (
            <>
              {/* Classement */}
              <div className="zone-resultats">
                <h3>{d.tournoiRanking}</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{d.thStrategy}</th>
                        <th>{d.thTotal}</th>
                        <th>{d.thAvg}</th>
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
                <h3>{d.tournoiMatrix}</h3>
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
                  {showMatchs ? '▼' : '▶'} {d.matchDetails(result.detailsMatches.length)}
                </h3>
                {showMatchs && (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>{d.thMatch}</th>
                          <th>{d.thStratA}</th>
                          <th>Score A</th>
                          <th>Score B</th>
                          <th>{d.thStratB}</th>
                          <th>{d.thResult}</th>
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
