import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ALL_STRATEGIES, STRATEGY_LABELS, STRATEGY_IMAGES, STRATEGY_DESCRIPTIONS } from './constants';

export default function DilemmeAccueil() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const modes = [
    { path: '/dilemme/duel', icon: '⚔️', title: 'Duel 1v1', desc: 'Affrontez deux stratégies face-à-face. Jouez vous-même ou observez une simulation automatique.' },
    { path: '/dilemme/tournoi', icon: '🏆', title: 'Tournoi', desc: 'Organisez un tournoi round-robin entre 2 à 8 stratégies et découvrez la meilleure.' },
    { path: '/dilemme/evolution', icon: '🧬', title: 'Évolution', desc: 'Simulez l\'évolution naturelle d\'une population de stratégies par sélection.' },
    { path: '/dilemme/sandbox', icon: '🧪', title: 'Sandbox', desc: 'Mode libre : ajustez la population, les gains et observez l\'écosystème évoluer.' },
  ];

  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="hero-section">
        <h1>Le Dilemme du Prisonnier Itéré</h1>
        <p>Explorez la dynamique de la coopération et de la trahison à travers des simulations interactives</p>
      </section>

      {/* ─── Explication du dilemme ─── */}
      <section>
        <h2>Qu'est-ce que le Dilemme du Prisonnier ?</h2>
        <p style={{ color: 'var(--text-light)', lineHeight: 1.8 }}>
          Deux joueurs doivent simultanément choisir de <strong style={{ color: 'var(--success)' }}>coopérer</strong> ou de{' '}
          <strong style={{ color: 'var(--danger)' }}>trahir</strong>. Leurs gains dépendent de la combinaison de leurs choix :
        </p>

        {/* Payoff Cards */}
        <div className="payoff-grid">
          <div className="payoff-card reward">
            <div className="payoff-label">Récompense (R)</div>
            <div className="payoff-value">3</div>
            <div className="payoff-desc">Coopération mutuelle</div>
          </div>
          <div className="payoff-card temptation">
            <div className="payoff-label">Tentation (T)</div>
            <div className="payoff-value">5</div>
            <div className="payoff-desc">Trahir un coopérateur</div>
          </div>
          <div className="payoff-card sucker">
            <div className="payoff-label">Dupe (S)</div>
            <div className="payoff-value">0</div>
            <div className="payoff-desc">Coopérer avec un traître</div>
          </div>
          <div className="payoff-card punishment">
            <div className="payoff-label">Punition (P)</div>
            <div className="payoff-value">1</div>
            <div className="payoff-desc">Trahison mutuelle</div>
          </div>
        </div>

        <div className="rule-callout">
          📐 La règle fondamentale : <code>T &gt; R &gt; P &gt; S</code> et <code>2R &gt; T + S</code> — 
          La tentation de trahir est forte, mais la coopération mutuelle bat toute exploitation systématique.
        </div>
      </section>

      {/* ─── Stratégies ─── */}
      <section>
        <h2>Les Stratégies</h2>
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
        <h2>Modes de Jeu</h2>
        <div className="modes-grid">
          {modes.map(mode => (
            <div key={mode.path} className="mode-card">
              <div className="mode-icon">{mode.icon}</div>
              <h3>{mode.title}</h3>
              <p>{mode.desc}</p>
              <Link to={mode.path} className="btn">Commencer</Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
