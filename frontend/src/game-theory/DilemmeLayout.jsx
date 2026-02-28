import { Link, NavLink, useLocation, Outlet } from 'react-router-dom';
import './Dilemme.css';

const HEADERS = {
  '/dilemme':           { title: 'Le Dilemme du Prisonnier Itéré', subtitle: 'Explorez la dynamique de la coopération et de la trahison' },
  '/dilemme/duel':      { title: 'Mode Duel 1v1', subtitle: 'Affrontez deux stratégies sur plusieurs manches' },
  '/dilemme/tournoi':   { title: 'Mode Tournoi', subtitle: 'Compétition round-robin entre 2 à 8 stratégies' },
  '/dilemme/evolution':  { title: 'Mode Évolution', subtitle: 'Simulation génétique sur plusieurs générations' },
  '/dilemme/sandbox':   { title: 'Mode Sandbox', subtitle: 'Expérimentez librement avec les stratégies et paramètres en temps réel' },
};

export default function DilemmeLayout() {
  const location = useLocation();
  const headerInfo = HEADERS[location.pathname] || HEADERS['/dilemme'];
  const isAccueil = location.pathname === '/dilemme';

  return (
    <div className="dilemme-page">
      {/* ─── Navigation cyberpunk ─── */}
      <nav>
        <div>
          <ul>
            <li><Link to="/" className="nav-link back-link">← Portfolio</Link></li>
            <li><div className="nav-separator" /></li>
            <li><NavLink to="/dilemme" end className="nav-link">Accueil</NavLink></li>
            <li><NavLink to="/dilemme/duel" className="nav-link">Duel</NavLink></li>
            <li><NavLink to="/dilemme/tournoi" className="nav-link">Tournoi</NavLink></li>
            <li><NavLink to="/dilemme/evolution" className="nav-link">Évolution</NavLink></li>
            <li><NavLink to="/dilemme/sandbox" className="nav-link">Sandbox</NavLink></li>
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
        <p>Le Dilemme du Prisonnier Itéré — Simulation Interactive</p>
        <p>Inspiré de la <a href="https://ncase.me/trust/" target="_blank" rel="noreferrer">théorie des jeux de Nicky Case</a></p>
      </footer>
    </div>
  );
}
