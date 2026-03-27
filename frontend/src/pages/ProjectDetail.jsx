import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProjectDetail.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || '';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, lang } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${API_URL}/projects/${id}`);
        if (!response.ok) {
          throw new Error(t.projectDetail.notFound);
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
        <div className="loading">{t.projectDetail.loading}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail-container">
        <div className="error">
          <p>{error}</p>
          <Link to="/projects" className="back-link">{t.projectDetail.backToProjects}</Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const parseJson = (val) => {
    if (!val) return [];
    if (typeof val === 'string') { try { return JSON.parse(val); } catch { return []; } }
    return val;
  };

  const stack = parseJson(project.stack);
  const objectivesRaw = lang === 'en' && project.objectives_en ? project.objectives_en : project.objectives;
  const challengesRaw = lang === 'en' && project.challenges_en ? project.challenges_en : project.challenges;
  const achievementsRaw = lang === 'en' && project.achievements_en ? project.achievements_en : project.achievements;
  const objectives = parseJson(objectivesRaw);
  const technologies = project.technologies_details ? (typeof project.technologies_details === 'string' ? JSON.parse(project.technologies_details) : project.technologies_details) : {};
  const challenges = parseJson(challengesRaw);
  const achievements = parseJson(achievementsRaw);
  const screenshots = parseJson(project.screenshots);

  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB';

  return (
    <div className="project-detail-container">
      <Link to="/projects" className="back-link">{t.projectDetail.backToProjects}</Link>

      <div className="project-detail-header">
        <h1>{lang === 'en' && project.title_en ? project.title_en : project.title}</h1>
        <div className="project-meta">
          <span className="project-category">{project.category}</span>
          <span className="project-status">{project.status}</span>
          {project.start_date && (
            <span className="project-dates">
              {new Date(project.start_date).toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
              {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString(locale, { month: 'long', year: 'numeric' })}`}
            </span>
          )}
        </div>
      </div>

      {project.thumbnail && !project.video_url && (
        <div className="project-thumbnail-large">
          <img src={`${STORAGE_URL}/${project.thumbnail}`} alt={project.title} />
        </div>
      )}

      <div className="project-detail-content">
        <section className="project-section">
          <h2>{t.projectDetail.overview}</h2>
          <p className="project-description">{lang === 'en' && project.description_en ? project.description_en : project.description}</p>
        </section>

        {(project.detailed_description || project.detailed_description_en) && (
          <section className="project-section detailed-content">
            <div
              className="detailed-description"
              dangerouslySetInnerHTML={{ __html: lang === 'en' && project.detailed_description_en ? project.detailed_description_en : project.detailed_description }}
            />
          </section>
        )}

        {project.id === 6 && (
          <section className="project-section dataviz-gallery">
            <h2>{t.projectDetail.visualizations}</h2>
            <div className="dataviz-images-grid">
              {[75, 76, 77, 78, 79, 80].map((num) => (
                <div key={num} className="dataviz-image-item">
                  <img
                    src={`${STORAGE_URL}/storage/projects/${num}.png`}
                    alt={`${t.projectDetail.visualizations} Spotify ${num}`}
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
            <h2>{t.projectDetail.techUsed}</h2>
            <div className="tech-stack">
              {stack.map((tech, index) => (
                <span key={index} className="tech-badge">{tech}</span>
              ))}
            </div>
          </section>
        )}

        {objectives.length > 0 && (
          <section className="project-section">
            <h2>{t.projectDetail.objectives}</h2>
            <ul className="objectives-list">
              {objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </section>
        )}

        {Object.keys(technologies).length > 0 && (
          <section className="project-section">
            <h2>{t.projectDetail.techDetailed}</h2>
            <div className="technologies-details">
              {Object.entries(
                lang === 'en' && project.technologies_details_en
                  ? (typeof project.technologies_details_en === 'string' ? JSON.parse(project.technologies_details_en) : project.technologies_details_en)
                  : technologies
              ).map(([tech, description], index) => (
                <div key={index} className="tech-detail-item">
                  <strong>{tech}</strong>: {description}
                </div>
              ))}
            </div>
          </section>
        )}

        {challenges.length > 0 && (
          <section className="project-section">
            <h2>{t.projectDetail.challenges}</h2>
            <ul className="challenges-list">
              {challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </section>
        )}

        {achievements.length > 0 && (
          <section className="project-section">
            <h2>{t.projectDetail.achievements}</h2>
            <ul className="achievements-list">
              {achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </section>
        )}

        {project.role && (
          <section className="project-section">
            <h2>{t.projectDetail.myRole}</h2>
            <p>{lang === 'en' && project.role_en ? project.role_en : project.role}</p>
            {project.team_size && project.team_size > 1 && (
              <p className="team-info">
                {t.projectDetail.teamOf} {project.team_size} {t.projectDetail.teamPeople}
              </p>
            )}
          </section>
        )}

        {screenshots.length > 0 && project.id !== 6 && (
          <section className="project-section">
            <h2>{t.projectDetail.screenshots}</h2>
            <div className="screenshots-grid">
              {screenshots.map((screenshot, index) => (
                <div key={index} className="screenshot-item">
                  <img
                    src={`${STORAGE_URL}/${screenshot}`}
                    alt={`${t.projectDetail.screenshot} ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {project.video_url && (
          <section className="project-section">
            <h2>{t.projectDetail.demoVideo}</h2>
            <div className="video-container">
              <video
                controls
                preload="metadata"
                className="project-video"
                onLoadedMetadata={(e) => {
                  e.target.currentTime = 1;
                }}
              >
                <source src={`${STORAGE_URL}/${project.video_url}#t=1`} type="video/mp4" />
                {t.projectDetail.videoUnsupported}
              </video>
            </div>
          </section>
        )}

        {project.report_pdf && project.id !== 10 && (
          <section className="project-section">
            <h2>{t.projectDetail.projectReport}</h2>
            <a
              href={`${STORAGE_URL}/${project.report_pdf}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pdf-link"
            >
              {t.projectDetail.downloadReport}
            </a>
          </section>
        )}

        {(project.link || project.github || (project.demo_url && project.id !== 10)) && (
          <section className="project-section project-links">
            <h2>{t.projectDetail.links}</h2>
            <div className="links-container">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-btn demo-link"
                >
                  {t.projectDetail.viewDemo}
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-btn github-link"
                >
                  {t.projectDetail.viewGithub}
                </a>
              )}
            </div>
          </section>
        )}

        {project.id === 10 && (
          <section className="project-section">
            <h2>{t.projectDetail.interactiveDemo}</h2>
            <p>{t.projectDetail.dilemmeDesc}</p>
            <div className="iframe-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="/dilemme" className="project-link-btn demo-link">{t.projectDetail.accessGame}</a>
              <a href="/dilemme/duel" className="project-link-btn">{t.projectDetail.modeDuel}</a>
              <a href="/dilemme/tournoi" className="project-link-btn">{t.projectDetail.modeTournoi}</a>
              <a href="/dilemme/evolution" className="project-link-btn">{t.projectDetail.modeEvolution}</a>
              <a href="/dilemme/sandbox" className="project-link-btn">{t.projectDetail.modeSandbox}</a>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;
