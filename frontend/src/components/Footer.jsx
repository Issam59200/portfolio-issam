import './Footer.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-gradient"></div>
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <h3>Issam</h3>
              <p>{t.footer.role}</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>{t.footer.navigation}</h4>
                <a href="/">{t.footer.home}</a>
                <a href="/about">{t.footer.about}</a>
                <a href="/projects">{t.footer.projects}</a>
                <a href="/games">{t.footer.games}</a>
              </div>
              <div className="footer-section">
                <h4>{t.footer.contact}</h4>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://youtube.com/@hackeye_xp" target="_blank" rel="noopener noreferrer">YouTube</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {year} Issam. {t.footer.rights}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
