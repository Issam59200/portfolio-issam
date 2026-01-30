import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProjectDetail.css';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/projects/${id}`);
        if (!response.ok) {
          throw new Error('Projet non trouvé');
        }
        const data = await response.json();
        setProject(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="project-detail-container">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail-container">
        <div className="error">
          <p>{error}</p>
          <Link to="/projects" className="back-link">← Retour aux projets</Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  // Parse JSON fields
  const stack = typeof project.stack === 'string' ? JSON.parse(project.stack) : project.stack || [];
  const objectives = project.objectives ? (typeof project.objectives === 'string' ? JSON.parse(project.objectives) : project.objectives) : [];
  const technologies = project.technologies_details ? (typeof project.technologies_details === 'string' ? JSON.parse(project.technologies_details) : project.technologies_details) : {};
  const challenges = project.challenges ? (typeof project.challenges === 'string' ? JSON.parse(project.challenges) : project.challenges) : [];
  const achievements = project.achievements ? (typeof project.achievements === 'string' ? JSON.parse(project.achievements) : project.achievements) : [];
  const screenshots = project.screenshots ? (typeof project.screenshots === 'string' ? JSON.parse(project.screenshots) : project.screenshots) : [];

  return (
    <div className="project-detail-container">
      <Link to="/projects" className="back-link">← Retour aux projets</Link>
      
      <div className="project-detail-header">
        <h1>{project.title}</h1>
        <div className="project-meta">
          <span className="project-category">{project.category}</span>
          <span className="project-status">{project.status}</span>
          {project.start_date && (
            <span className="project-dates">
              {new Date(project.start_date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`}
            </span>
          )}
        </div>
      </div>

      {project.thumbnail && !project.video_url && (
        <div className="project-thumbnail-large">
          <img src={`http://localhost:8000/${project.thumbnail}`} alt={project.title} />
        </div>
      )}

      <div className="project-detail-content">
        <section className="project-section">
          <h2>Vue d'ensemble</h2>
          <p className="project-description">{project.description}</p>
        </section>

        {project.detailed_description && (
          <section className="project-section detailed-content">
            <div 
              className="detailed-description" 
              dangerouslySetInnerHTML={{ __html: project.detailed_description }}
            />
          </section>
        )}

        {/* Pour le projet Dataviz Spotify, afficher les images directement */}
        {project.id === 6 && (
          <section className="project-section dataviz-gallery">
            <h2>Visualisations</h2>
            <div className="dataviz-images-grid">
              {[75, 76, 77, 78, 79, 80].map((num) => (
                <div key={num} className="dataviz-image-item">
                  <img 
                    src={`http://localhost:8000/storage/projects/${num}.png`} 
                    alt={`Visualisation Spotify ${num}`} 
                    onError={(e) => {
                      console.error(`Erreur chargement image ${num}`);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {stack.length > 0 && (
          <section className="project-section">
            <h2>Technologies utilisées</h2>
            <div className="tech-stack">
              {stack.map((tech, index) => (
                <span key={index} className="tech-badge">{tech}</span>
              ))}
            </div>
          </section>
        )}

        {objectives.length > 0 && (
          <section className="project-section">
            <h2>Objectifs</h2>
            <ul className="objectives-list">
              {objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </section>
        )}

        {Object.keys(technologies).length > 0 && (
          <section className="project-section">
            <h2>Technologies détaillées</h2>
            <div className="technologies-details">
              {Object.entries(technologies).map(([tech, description], index) => (
                <div key={index} className="tech-detail-item">
                  <strong>{tech}</strong>: {description}
                </div>
              ))}
            </div>
          </section>
        )}

        {challenges.length > 0 && (
          <section className="project-section">
            <h2>Défis rencontrés</h2>
            <ul className="challenges-list">
              {challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </section>
        )}

        {achievements.length > 0 && (
          <section className="project-section">
            <h2>Réalisations</h2>
            <ul className="achievements-list">
              {achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </section>
        )}

        {project.role && (
          <section className="project-section">
            <h2>Mon rôle</h2>
            <p>{project.role}</p>
            {project.team_size && project.team_size > 1 && (
              <p className="team-info">Équipe de {project.team_size} personnes</p>
            )}
          </section>
        )}

        {/* Screenshots section seulement si ce n'est pas le projet Dataviz (déjà affiché plus haut) */}
        {screenshots.length > 0 && project.id !== 6 && (
          <section className="project-section">
            <h2>Captures d'écran</h2>
            <div className="screenshots-grid">
              {screenshots.map((screenshot, index) => (
                <div key={index} className="screenshot-item">
                  <img 
                    src={`http://localhost:8000/${screenshot}`} 
                    alt={`Capture ${index + 1}`} 
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {project.video_url && (
          <section className="project-section">
            <h2>Vidéo de démonstration</h2>
            <div className="video-container">
              <video 
                controls 
                preload="metadata"
                className="project-video"
                onLoadedMetadata={(e) => {
                  e.target.currentTime = 1;
                }}
              >
                <source src={`http://localhost:8000/${project.video_url}#t=1`} type="video/mp4" />
                Votre navigateur ne supporte pas la balise vidéo.
              </video>
            </div>
          </section>
        )}

        {project.report_pdf && project.id !== 10 && (
          <section className="project-section">
            <h2>Rapport de projet</h2>
            <a 
              href={`http://localhost:8000/${project.report_pdf}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="pdf-link"
            >
              📄 Télécharger le rapport PDF
            </a>
          </section>
        )}

        {(project.link || project.github || (project.demo_url && project.id !== 10)) && (
          <section className="project-section project-links">
            <h2>Liens</h2>
            <div className="links-container">
              {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link-btn demo-link"
                >
                  🌐 Voir la démo
                </a>
              )}
              {project.github && (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link-btn github-link"
                >
                  💻 Voir sur GitHub
                </a>
              )}
            </div>
          </section>
        )}

        {/* Pour le projet Dilemme du Prisonnier, afficher l'iframe sans section Liens */}
        {project.id === 10 && project.demo_url && (
          <section className="project-section">
            <h2>Démonstration Interactive</h2>
            <p className="iframe-notice">Le jeu s'ouvre dans une fenêtre intégrée ci-dessous. Pour une meilleure expérience, vous pouvez ouvrir le jeu dans un nouvel onglet en cliquant sur le bouton ci-dessous.</p>
            <div className="iframe-actions">
              <a 
                href="http://localhost:8001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="project-link-btn demo-link"
              >
                🎮 Ouvrir le jeu en plein écran
              </a>
            </div>
            <div className="iframe-container">
              <iframe 
                src="http://localhost:8001" 
                title="Dilemme du Prisonnier"
                className="project-iframe"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;
