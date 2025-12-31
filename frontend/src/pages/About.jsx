import { useState, useEffect } from 'react';
import './About.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function About() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(`${API_URL.replace('/api', '')}/storage/experiences/picture.jpeg`);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_URL}/skills`);
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categoryNames = {
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Base de Données',
    devops: 'DevOps',
    design: 'Design Graphique',
    montage: 'Montage Vidéo',
    gamedev: 'Développement de Jeux'
  };

  const languages = [
    { name: 'Français', level: 'Natif'},
    { name: 'Anglais', level: 'Courant (B2)'},
    { name: 'Arabe', level: 'Notions' }
  ];

  const passions = [
    {
      icon: '🎮',
      title: 'Gaming',
      description: 'Passionné par les jeux vidéo et leur conception, j\'explore les mécaniques de jeu et crée mes propres expériences ludiques.'
    },
    {
      icon: '💻',
      title: 'Développement Web',
      description: 'Création d\'applications web modernes avec Laravel et React, de la conception à la mise en production.'
    },
    {
      icon: '🎬',
      title: 'Création de Contenu',
      description: 'Production de vidéos YouTube sur l\'IA, les fake news, le gaming et la technologie avec montage professionnel.'
    },
    {
      icon: '🎨',
      title: 'Design & Créativité',
      description: 'Design graphique, création de miniatures YouTube et d\'interfaces utilisateur attrayantes.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content animate-fade-in">
            <div className="profile-section">
              <div className="profile-image-container">
                {profileImage ? (
                  <img src={profileImage} alt="Issam" className="profile-image" />
                ) : (
                  <div className="profile-placeholder">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <p className="placeholder-text">Photo de profil</p>
                  </div>
                )}
              </div>
            </div>

            <div className="hero-text">
              <h1 className="gradient-text">Issam</h1>
              <h2 className="subtitle">Développeur Full Stack & Créateur de Contenu</h2>
              <p className="bio">
                Passionné par le développement web et la création de contenu numérique, je combine 
                compétences techniques et créativité pour transformer des idées en réalité digitale. 
                Du code à la vidéo, en passant par le game design, j'explore différentes facettes de 
                la création numérique avec curiosité et détermination.
              </p>

              {/* Langues en compact */}
              <div className="languages-inline">
                {languages.map((lang) => (
                  <div key={lang.name} className="language-tag">
                    <span className="lang-flag">{lang.flag}</span>
                    <span className="lang-info">
                      <strong>{lang.name}</strong> - {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CV Video Section */}
      <section className="cv-video-section section">
        <div className="container">
          <h2 className="section-title gradient-text animate-fade-in">Mon CV en Vidéo (English)</h2>
          <div className="video-container animate-fade-in">
            <video 
              controls 
              className="cv-video-player"
              poster=""
            >
              <source src={`${API_URL.replace('/api', '')}/storage/skills/Cvanglais.mp4`} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </div>
        </div>
      </section>

      {/* Passions Section */}
      <section className="passions-section section">
        <div className="container">
          <h2 className="section-title gradient-text animate-fade-in">Mes Passions</h2>
          <div className="passions-grid">
            {passions.map((passion, index) => (
              <div 
                key={passion.title} 
                className="passion-card card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="passion-icon">{passion.icon}</div>
                <h3>{passion.title}</h3>
                <p>{passion.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compétences Techniques Section - Style Jeux Vidéo */}
      <section className="technical-skills-section section">
        <div className="container">
          <h2 className="section-title gradient-text animate-fade-in">Compétences Techniques</h2>
          <p className="section-subtitle">Niveau d'expérience par technologie</p>
          
          {loading ? (
            <div className="loading">Chargement des compétences...</div>
          ) : (
            <div className="skills-categories">
              {Object.entries(groupedSkills).map(([category, categorySkills], index) => (
                <div 
                  key={category} 
                  className="skill-category animate-slide-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="category-title">{categoryNames[category] || category}</h3>
                  <div className="skills-list">
                    {categorySkills
                      .sort((a, b) => b.level - a.level)
                      .map(skill => {
                        const level = Math.floor(skill.level / 20); // 0-5 levels
                        const currentXP = skill.level % 20; // Progress dans le level actuel
                        return (
                          <div key={skill.id} className="skill-item-game">
                            <div className="skill-header-game">
                              <span className="skill-name-game">{skill.name}</span>
                              <span className="skill-level-badge">Lvl {level}</span>
                            </div>
                            <div className="xp-bar-container">
                              <div className="xp-bar-bg">
                                <div 
                                  className="xp-bar-fill"
                                  style={{ 
                                    width: `${(currentXP / 20) * 100}%`,
                                    animationDelay: `${index * 0.1}s`
                                  }}
                                >
                                  <div className="xp-shine"></div>
                                </div>
                              </div>
                              <div className="xp-text">
                                <span>XP: {skill.level}/100</span>
                              </div>
                            </div>
                            {skill.years_experience && (
                              <div className="skill-experience">
                                <span className="exp-icon">⏱️</span>
                                <span>{skill.years_experience} an{skill.years_experience > 1 ? 's' : ''} d'expérience</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta section">
        <div className="container">
          <div className="cta-card animate-fade-in-scale">
            <h2 className="glow-text">Intéressé par une collaboration ?</h2>
            <p>N'hésitez pas à me contacter pour discuter de vos projets !</p>
            <a href="mailto:contact@issam.dev" className="btn btn-primary">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Me Contacter
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
