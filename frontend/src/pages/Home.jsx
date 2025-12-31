import './Home.css';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const skills = [
    { name: 'React', level: 90, color: '#61DAFB' },
    { name: 'Laravel', level: 85, color: '#FF2D20' },
    { name: 'PHP', level: 85, color: '#777BB4' },
    { name: 'JavaScript', level: 90, color: '#F7DF1E' },
    { name: 'MySQL', level: 80, color: '#4479A1' },
    { name: 'C', level: 75, color: '#A8B9CC' },
  ];

  return (
    <main className="home">
      {/* Cursor glow effect */}
      <div 
        className="cursor-glow"
        style={{
          left: mousePosition.x + 'px',
          top: mousePosition.y + 'px'
        }}
      />

      {/* Hero Section with WOW effect */}
      <section className="hero">
        <div className="hero-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="container">
          <div className="hero-content animate-fade-in">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Disponible pour vos projets
            </div>
            
            <h1 className="hero-title">
              <span className="title-line">Bonjour, je suis</span>
              <span className="title-name gradient-text glow-text">Issam</span>
              <span className="title-line">Développeur Full Stack</span>
            </h1>

            <p className="hero-description">
              Passionné par le <strong>développement web moderne</strong>, je crée des applications 
              performantes et élégantes avec <span className="tech-highlight">Laravel</span> et <span className="tech-highlight">React</span>.
              De la conception à la mise en production, je transforme vos idées en réalité digitale.
            </p>

            <div className="hero-stats">
              <div className="stat-item animate-slide-left">
                <div className="stat-number">3+</div>
                <div className="stat-label">Projets Réalisés</div>
              </div>
              <div className="stat-item animate-slide-left" style={{ animationDelay: '0.1s' }}>
                <div className="stat-number">6</div>
                <div className="stat-label">Technologies</div>
              </div>
              <div className="stat-item animate-slide-left" style={{ animationDelay: '0.2s' }}>
                <div className="stat-number">100%</div>
                <div className="stat-label">Passion</div>
              </div>
            </div>

            <div className="hero-actions">
              <a href="#contact" className="btn btn-primary">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Me Contacter
              </a>
              <a href="/projects" className="btn btn-secondary">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                  <polyline points="17 2 12 7 7 2"></polyline>
                </svg>
                Voir mes Projets
              </a>
            </div>
          </div>

          <div className="hero-visual animate-fade-in-scale">
            <div className="visual-ring ring-1"></div>
            <div className="visual-ring ring-2"></div>
            <div className="visual-ring ring-3"></div>
            <div className="visual-center">
              <div className="center-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills-section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2 className="section-title gradient-text">Compétences & Expertise</h2>
            <p className="section-subtitle">
              Technologies que je maîtrise pour donner vie à vos projets
            </p>
          </div>

          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div 
                key={skill.name} 
                className="skill-card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="skill-header">
                  <h3 className="skill-name">{skill.name}</h3>
                  <span className="skill-percentage">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <div 
                    className="skill-progress"
                    style={{ 
                      width: `${skill.level}%`,
                      background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2 className="section-title gradient-text">Projets Réalisés</h2>
            <p className="section-subtitle">
              Découvrez mes dernières réalisations
            </p>
          </div>

          <div className="featured-grid">
            <a href="/projects" className="featured-card card animate-slide-left">
              <div className="featured-icon">
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                  <line x1="7" y1="2" x2="7" y2="22"></line>
                  <line x1="17" y1="2" x2="17" y2="22"></line>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <line x1="2" y1="7" x2="7" y2="7"></line>
                  <line x1="2" y1="17" x2="7" y2="17"></line>
                  <line x1="17" y1="7" x2="22" y2="7"></line>
                  <line x1="17" y1="17" x2="22" y2="17"></line>
                </svg>
              </div>
              <h3>Projets de Développement</h3>
              <p>Applications web en C, PHP et Laravel avec des fonctionnalités avancées</p>
              <span className="featured-link">Explorer →</span>
            </a>

            <a href="/games" className="featured-card card animate-slide-left" style={{ animationDelay: '0.1s' }}>
              <div className="featured-icon">
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <h3>Jeux Développés</h3>
              <p>Création de jeux interactifs en C avec Unity pour une expérience immersive</p>
              <span className="featured-link">Découvrir →</span>
            </a>

            <a href="/youtube" className="featured-card card animate-slide-left" style={{ animationDelay: '0.2s' }}>
              <div className="featured-icon">
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </div>
              <h3>Contenu YouTube</h3>
              <p>Tutoriels et contenus sur le développement web et la programmation</p>
              <span className="featured-link">Visionner →</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content animate-fade-in-scale">
            <h2 className="cta-title glow-text">Prêt à démarrer votre projet ?</h2>
            <p className="cta-description">
              Travaillons ensemble pour créer quelque chose d'extraordinaire
            </p>
            <a href="#contact" className="btn btn-primary btn-large">
              Démarrer la Conversation
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
