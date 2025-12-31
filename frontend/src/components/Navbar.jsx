import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import './Navbar.css';

const navLinkClass = ({ isActive }) =>
  `nav-link${isActive ? " nav-link-active" : ""}`;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isYouTubePage = location.pathname === '/youtube';

  return (
    <header className={`site-header ${isYouTubePage ? 'site-header-youtube' : ''}`}>
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
            Accueil
          </NavLink>
          <NavLink 
            to="/about" 
            className={navLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            💼 CV
          </NavLink>
          <NavLink 
            to="/projects" 
            className={navLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            Projets
          </NavLink>
          <NavLink 
            to="/games" 
            className={navLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            🎮 Jeux
          </NavLink>
          <NavLink 
            to="/youtube" 
            className={navLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            📺 YouTube
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
