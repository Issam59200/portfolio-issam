import { useState, useEffect } from 'react';
import './Projects.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const categories = ['all', ...new Set(projects.map(p => p.category))];

  if (loading) {
    return (
      <div className="projects-page">
        <div className="container">
          <div className="loading">Chargement des projets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <section className="projects-hero">
        <div className="container">
          <h1 className="animate-fade-in">
            Mes <span className="gradient-text">Projets</span>
          </h1>
          <p className="hero-subtitle animate-fade-in">
            Découvrez mes réalisations en développement web, logiciel et programmation système
          </p>
        </div>
      </section>

      <section className="projects-content section">
        <div className="container">
          <div className="projects-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'Tous' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="projects-grid">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="project-card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {project.video_url && (
                  <div className="project-video">
                    <video 
                      controls 
                      poster={project.thumbnail ? `${API_URL.replace('/api', '')}/${project.thumbnail}` : undefined}
                      className="project-video-player"
                    >
                      <source src={`${API_URL.replace('/api', '')}/${project.video_url}`} type="video/mp4" />
                      Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                    <div className="project-overlay">
                      <span className="project-category">{project.category}</span>
                      <span className={`project-status status-${project.status}`}>
                        {project.status === 'completed' ? 'Terminé' : 
                         project.status === 'in-progress' ? 'En cours' : 'Archivé'}
                      </span>
                    </div>
                  </div>
                )}

                {!project.video_url && project.thumbnail && (
                  <div className="project-thumbnail">
                    <img src={`${API_URL.replace('/api', '')}/${project.thumbnail}`} alt={project.title} />
                    <div className="project-overlay">
                      <span className="project-category">{project.category}</span>
                      <span className={`project-status status-${project.status}`}>
                        {project.status === 'completed' ? 'Terminé' : 
                         project.status === 'in-progress' ? 'En cours' : 'Archivé'}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  
                  {project.stack && project.stack.length > 0 && (
                    <div className="project-stack">
                      {project.stack.map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  )}

                  {project.role && (
                    <p className="project-role">
                      <strong>Rôle :</strong> {project.role}
                      {project.team_size && ` • Équipe de ${project.team_size}`}
                    </p>
                  )}

                  <div className="project-links">
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn-demo">
                        Voir le projet
                      </a>
                    )}
                    {project.repository_url && (
                      <a href={project.repository_url} target="_blank" rel="noopener noreferrer" className="btn-github">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="no-results">
              <p>Aucun projet trouvé dans cette catégorie.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
