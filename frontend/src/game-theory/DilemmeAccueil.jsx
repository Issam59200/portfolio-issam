import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ALL_STRATEGIES, STRATEGY_IMAGES } from './constants';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useStrategyLabels } from './useStrategyLabels.js';

export default function DilemmeAccueil() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const { t } = useLanguage();
  const d = t.dilemme;
  const { STRATEGY_LABELS, STRATEGY_DESCRIPTIONS } = useStrategyLabels();

  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="hero-section">
        <h1>{d.heroTitle}</h1>
        <p>{d.heroSubtitle}</p>
      </section>

      {/* ─── Explication du dilemme ─── */}
      <section>
        <h2>{d.whatTitle}</h2>
        <p style={{ color: 'var(--text-light)', lineHeight: 1.8 }}>
          {d.whatDesc} <strong style={{ color: 'var(--success)' }}>{d.coopererWord}</strong> ou de{' '}
          <strong style={{ color: 'var(--danger)' }}>{d.trahirWord}</strong>{d.whatDesc2}
        </p>

        {/* Payoff Cards */}
        <div className="payoff-grid">
          <div className="payoff-card reward">
            <div className="payoff-label">{d.payoffReward}</div>
            <div className="payoff-value">3</div>
            <div className="payoff-desc">{d.payoffRewardDesc}</div>
          </div>
          <div className="payoff-card temptation">
            <div className="payoff-label">{d.payoffTempt}</div>
            <div className="payoff-value">5</div>
            <div className="payoff-desc">{d.payoffTemptDesc}</div>
          </div>
          <div className="payoff-card sucker">
            <div className="payoff-label">{d.payoffSucker}</div>
            <div className="payoff-value">0</div>
            <div className="payoff-desc">{d.payoffSuckerDesc}</div>
          </div>
          <div className="payoff-card punishment">
            <div className="payoff-label">{d.payoffPunish}</div>
            <div className="payoff-value">1</div>
            <div className="payoff-desc">{d.payoffPunishDesc}</div>
          </div>
        </div>

        <div className="rule-callout">
          📐 <code>T &gt; R &gt; P &gt; S</code> — {d.ruleCallout}
        </div>
      </section>

      {/* ─── Stratégies ─── */}
      <section>
        <h2>{d.strategiesTitle}</h2>
        <div className="strategies-grid">
          {ALL_STRATEGIES.map(key => (
            <div key={key} className="strategy-card">
              <img src={STRATEGY_IMAGES[key]} alt={STRATEGY_LABELS[key]} />
              <h3>{STRATEGY_LABELS[key]}</h3>
              <p>{STRATEGY_DESCRIPTIONS[key]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Modes de jeu ─── */}
      <section>
        <h2>{d.modesTitle}</h2>
        <div className="modes-grid">
          {d.modes.map((mode, i) => (
            <div key={d.modePaths[i]} className="mode-card">
              <div className="mode-icon">{mode.icon}</div>
              <h3>{mode.title}</h3>
              <p>{mode.desc}</p>
              <Link to={d.modePaths[i]} className="btn">{d.startBtn}</Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
