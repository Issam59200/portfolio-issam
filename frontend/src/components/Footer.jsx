import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-gradient"></div>
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <h3>Issam</h3>
              <p>Développeur Full Stack</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Navigation</h4>
                <a href="/">Accueil</a>
                <a href="/about">À propos</a>
                <a href="/projects">Projets</a>
                <a href="/games">Jeux</a>
              </div>
              <div className="footer-section">
                <h4>Contact</h4>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://youtube.com/@Kizame1" target="_blank" rel="noopener noreferrer">YouTube</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {year} Issam. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
