import { Link, NavLink, useLocation, Outlet } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import './Dilemme.css';

const HEADERS = {
  fr: {
    '/dilemme':          { title: 'Le Dilemme du Prisonnier Itéré', subtitle: 'Explorez la dynamique de la coopération et de la trahison' },
    '/dilemme/duel':     { title: 'Mode Duel 1v1', subtitle: 'Affrontez deux stratégies sur plusieurs manches' },
    '/dilemme/tournoi':  { title: 'Mode Tournoi', subtitle: 'Compétition round-robin entre 2 à 8 stratégies' },
    '/dilemme/evolution': { title: 'Mode Évolution', subtitle: 'Simulation génétique sur plusieurs générations' },
    '/dilemme/sandbox':  { title: 'Mode Sandbox', subtitle: 'Expérimentez librement avec les stratégies et paramètres en temps réel' },
  },
  en: {
    '/dilemme':          { title: "The Iterated Prisoner's Dilemma", subtitle: 'Explore the dynamics of cooperation and betrayal' },
    '/dilemme/duel':     { title: 'Duel Mode 1v1', subtitle: 'Pit two strategies against each other over multiple rounds' },
    '/dilemme/tournoi':  { title: 'Tournament Mode', subtitle: 'Round-robin competition between 2 to 8 strategies' },
    '/dilemme/evolution': { title: 'Evolution Mode', subtitle: 'Genetic simulation over multiple generations' },
    '/dilemme/sandbox':  { title: 'Sandbox Mode', subtitle: 'Freely experiment with strategies and parameters in real time' },
  },
};

const NAV = {
  fr: { back: '← Portfolio', home: 'Accueil', duel: 'Duel', tournoi: 'Tournoi', evolution: 'Évolution', sandbox: 'Sandbox', footer1: 'Le Dilemme du Prisonnier Itéré — Simulation Interactive', footer2: 'Inspiré de la' },
  en: { back: '← Portfolio', home: 'Home', duel: 'Duel', tournoi: 'Tournament', evolution: 'Evolution', sandbox: 'Sandbox', footer1: "The Iterated Prisoner's Dilemma — Interactive Simulation", footer2: 'Inspired by' },
};

export default function DilemmeLayout() {
  const location = useLocation();
  const { lang, setLang } = useLanguage();
  const headers = HEADERS[lang] || HEADERS.fr;
  const nav = NAV[lang] || NAV.fr;
  const headerInfo = headers[location.pathname] || headers['/dilemme'];
  const isAccueil = location.pathname === '/dilemme';

  return (
    <div className="dilemme-page">
      {/* ─── Navigation cyberpunk ─── */}
      <nav>
        <div>
          <ul>
            <li><Link to="/" className="nav-link back-link">{nav.back}</Link></li>
            <li><div className="nav-separator" /></li>
            <li><NavLink to="/dilemme" end className="nav-link">{nav.home}</NavLink></li>
            <li><NavLink to="/dilemme/duel" className="nav-link">{nav.duel}</NavLink></li>
            <li><NavLink to="/dilemme/tournoi" className="nav-link">{nav.tournoi}</NavLink></li>
            <li><NavLink to="/dilemme/evolution" className="nav-link">{nav.evolution}</NavLink></li>
            <li><NavLink to="/dilemme/sandbox" className="nav-link">{nav.sandbox}</NavLink></li>
            <li><div className="nav-separator" /></li>
            <li>
              <div className="dilemme-lang-switcher">
                <button
                  className={`dilemme-lang-btn ${lang === 'fr' ? 'dilemme-lang-btn-active' : ''}`}
                  onClick={() => setLang('fr')}
                >
                  FR
                </button>
                <span className="dilemme-lang-divider">|</span>
                <button
                  className={`dilemme-lang-btn ${lang === 'en' ? 'dilemme-lang-btn-active' : ''}`}
                  onClick={() => setLang('en')}
                >
                  EN
                </button>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* ─── Header (sauf accueil qui a son propre hero) ─── */}
      {!isAccueil && (
        <header>
          <h1>{headerInfo.title}</h1>
          <p>{headerInfo.subtitle}</p>
        </header>
      )}

      {/* ─── Contenu ─── */}
      <main>
        <Outlet />
      </main>

      {/* ─── Footer ─── */}
      <footer>
        <p>{nav.footer1}</p>
        <p>{nav.footer2} <a href="https://ncase.me/trust/" target="_blank" rel="noreferrer">Nicky Case</a></p>
      </footer>
    </div>
  );
}
