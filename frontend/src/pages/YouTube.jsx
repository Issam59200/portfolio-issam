import { useState, useEffect } from 'react';
import './YouTube.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function YouTube() {
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentShortsPage, setCurrentShortsPage] = useState(0);
  const { t, lang } = useLanguage();

  const SHORTS_PER_PAGE = 6;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`${API_URL}/youtube-videos`);
      const data = await response.json();

      const isShort = (v) => v.is_short === 1 || v.is_short === true || v.category === 'short' || v.category === 'shorts';
      const longVideos = data.filter(v => !isShort(v));
      const shortVideos = data.filter(v => isShort(v)).reverse();

      setVideos(longVideos);
      setShorts(shortVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(shorts.length / SHORTS_PER_PAGE);
  const startIndex = currentShortsPage * SHORTS_PER_PAGE;
  const endIndex = startIndex + SHORTS_PER_PAGE;
  const currentShorts = shorts.slice(startIndex, endIndex);

  const nextShortsPage = () => {
    if (currentShortsPage < totalPages - 1) {
      setCurrentShortsPage(prev => prev + 1);
    }
  };

  const prevShortsPage = () => {
    if (currentShortsPage > 0) {
      setCurrentShortsPage(prev => prev - 1);
    }
  };

  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB';

  if (loading) {
    return (
      <div className="youtube-page">
        <div className="container">
          <div className="loading">{t.youtube.loading}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="youtube-page">
      <section className="youtube-hero">
        <div className="container">
          <div className="youtube-channel-header animate-fade-in">
            <div className="channel-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div className="channel-info">
              <h1>HACKEYE.xp</h1>
              <p className="channel-handle">@hackeye_xp</p>
              <a
                href="https://www.youtube.com/@hackeye_xp"
                target="_blank"
                rel="noopener noreferrer"
                className="subscribe-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                {t.youtube.subscribe}
              </a>
            </div>
          </div>
          <p className="channel-description animate-fade-in">
            {t.youtube.channelDesc}
          </p>
        </div>
      </section>

      <section className="videos-content section">
        <div className="container">
          <h2 className="section-title">{t.youtube.videos}</h2>
          <div className="videos-grid">
            {videos.map((video, index) => (
              <a
                key={video.id}
                href={video.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="video-card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="video-thumbnail">
                  <img
                    src={video.thumbnail || video.youtube_thumbnail || `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`}
                    alt={video.title}
                    onError={(e) => {
                      e.target.src = `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`;
                    }}
                  />
                  <div className="play-overlay">
                    <svg viewBox="0 0 24 24" fill="white" width="48" height="48">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  {video.featured && (
                    <div className="featured-badge">{t.youtube.featured}</div>
                  )}
                </div>

                <div className="video-details">
                  <h3>{lang === 'en' && video.title_en ? video.title_en : video.title}</h3>
                  <p className="video-description">{lang === 'en' && video.description_en ? video.description_en : video.description}</p>

                  <div className="video-stats">
                    {video.published_at && (
                      <span className="video-date">
                        {new Date(video.published_at).toLocaleDateString(locale, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>

                  {video.tags && video.tags.length > 0 && (
                    <div className="video-tags">
                      {video.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>

          {videos.length === 0 && (
            <div className="no-videos">
              <p>{t.youtube.noVideos}</p>
            </div>
          )}
        </div>
      </section>

      <section className="shorts-section section">
        <div className="container">
          <div className="shorts-header">
            <h2 className="section-title">
              <span className="shorts-icon">▶️</span> Shorts
            </h2>
            {totalPages > 1 && (
              <div className="shorts-pagination">
                <button
                  className="pagination-btn"
                  onClick={prevShortsPage}
                  disabled={currentShortsPage === 0}
                >
                  {t.youtube.previous}
                </button>
                <span className="pagination-info">
                  {currentShortsPage + 1} / {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={nextShortsPage}
                  disabled={currentShortsPage === totalPages - 1}
                >
                  {t.youtube.next}
                </button>
              </div>
            )}
          </div>
          <div className="shorts-carousel">
            <div className="shorts-track">
              {currentShorts.map((short) => {
                return (
                  <a
                    key={short.id}
                    href={short.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="short-card"
                  >
                    <div className="short-thumbnail">
                      <img
                        src={short.thumbnail || `https://img.youtube.com/vi/${short.video_id}/maxresdefault.jpg`}
                        alt={short.title}
                        onError={(e) => {
                          e.target.src = `https://img.youtube.com/vi/${short.video_id}/hqdefault.jpg`;
                        }}
                      />
                      <div className="short-overlay">
                        <div className="short-play-button">▶</div>
                      </div>
                    </div>
                    <div className="short-info">
                      <h4>{short.title}</h4>
                      {short.duration_seconds && (
                        <p>{short.duration_seconds}s</p>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="skills-showcase section">
        <div className="container">
          <h2 className="section-title">{t.youtube.skillsTitle}</h2>
          <div className="skills-grid">
            <div className="skill-card">
              <div className="skill-icon">🎬</div>
              <h3>{t.youtube.editing}</h3>
              <p>{t.youtube.editingDesc}</p>
            </div>
            <div className="skill-card">
              <div className="skill-icon">🎨</div>
              <h3>{t.youtube.graphic}</h3>
              <p>{t.youtube.graphicDesc}</p>
            </div>
            <div className="skill-card">
              <div className="skill-icon">✍️</div>
              <h3>{t.youtube.writing}</h3>
              <p>{t.youtube.writingDesc}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
