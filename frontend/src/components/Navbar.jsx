import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import './Navbar.css';

const navLinkClass = ({ isActive }) =>
  `nav-link${isActive ? " nav-link-active" : ""}`;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  const isYouTubePage = location.pathname === '/youtube';
  const isProjectsPage = location.pathname === '/projects' || location.pathname.startsWith('/projects/');
  const isGamesPage = location.pathname === '/games';

  let headerClass = 'site-header';
  if (isYouTubePage) headerClass += ' site-header-youtube';
  else if (isProjectsPage) headerClass += ' site-header-projects';
  else if (isGamesPage) headerClass += ' site-header-games';

  return (
    <header className={headerClass}>
      <nav className="nav">
        <Link to="/" className="brand">
          <span className="brand-name">Issam</span>
          <span className="brand-separator">•</span>
          <span className="brand-title">Portfolio</span>
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'nav-links-open' : ''}`}>
          <NavLink
            to="/"
            className={navLinkClass}
            end
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.nav.home}
          </NavLink>
          <NavLink
            to="/about"
            className={navLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.nav.cv}
          </NavLink>
          <NavLink
            to="/projects"
            className={navLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.nav.projects}
          </NavLink>
          <NavLink
            to="/games"
            className={navLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.nav.games}
          </NavLink>
          <NavLink
            to="/youtube"
            className={navLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.nav.youtube}
          </NavLink>
          <NavLink
            to="/contact"
            className={navLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.nav.contact}
          </NavLink>

          <div className="lang-switcher">
            <button
              className={`lang-btn ${lang === 'fr' ? 'lang-btn-active' : ''}`}
              onClick={() => { setLang('fr'); setMobileMenuOpen(false); }}
              aria-label="Français"
            >
              FR
            </button>
            <span className="lang-divider">|</span>
            <button
              className={`lang-btn ${lang === 'en' ? 'lang-btn-active' : ''}`}
              onClick={() => { setLang('en'); setMobileMenuOpen(false); }}
              aria-label="English"
            >
              EN
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
