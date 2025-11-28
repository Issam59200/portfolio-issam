export default function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="badge">Disponible pour de nouveaux projets</span>
            <h1 className="hero-title">
              Salut, je suis <span className="highlight">Issam</span> 👋
            </h1>
            <p className="hero-subtitle">
              Développeur Web Fullstack passionné par la création d'applications
              modernes et performantes avec <strong>Laravel</strong> et <strong>React</strong>.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#contact">
                Me contacter
              </a>
              <a className="btn btn-secondary" href="#skills">
                Mes compétences
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills-section">
        <div className="container">
          <h2 className="section-title">Compétences & Technologies</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Frontend</h3>
              <ul className="skill-list">
                <li>React.js</li>
                <li>JavaScript (ES6+)</li>
                <li>HTML5 & CSS3</li>
                <li>Vite</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Backend</h3>
              <ul className="skill-list">
                <li>Laravel</li>
                <li>PHP 8+</li>
                <li>API REST</li>
                <li>Eloquent ORM</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Base de données</h3>
              <ul className="skill-list">
                <li>MySQL</li>
                <li>PostgreSQL</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Outils & DevOps</h3>
              <ul className="skill-list">
                <li>Git & GitHub</li>
                <li>Docker</li>
                <li>Composer & npm</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <h2 className="section-title">À propos</h2>
            <p className="about-text">
              Développeur fullstack avec une solide expérience en développement web moderne.
              Je me spécialise dans la création d'applications performantes et évolutives,
              en combinant des backends robustes avec Laravel et des interfaces utilisateur
              réactives avec React.
            </p>
            <p className="about-text">
              Passionné par les bonnes pratiques de développement, l'architecture logicielle
              et l'optimisation des performances. Toujours à la recherche de nouveaux défis
              et d'opportunités pour apprendre et grandir.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-card">
            <h2 className="contact-title">Travaillons ensemble</h2>
            <p className="contact-text">
              Vous avez un projet en tête ? Une idée à concrétiser ?
              N'hésitez pas à me contacter pour en discuter.
            </p>
            <a className="btn btn-primary" href="mailto:issam.contact@example.com">
              Envoyez-moi un message
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
