import { Link, NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  `nav-link${isActive ? " nav-link-active" : ""}`;

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="nav">
        <Link to="/" className="brand">Issam • Portfolio</Link>
        <div className="nav-links">
          <NavLink to="/" className={navLinkClass} end>
            Accueil
          </NavLink>
          <NavLink to="/projects" className={navLinkClass}>
            Projets
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            À propos
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
