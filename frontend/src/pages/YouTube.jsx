import { useState, useEffect } from 'react';
import './YouTube.css';

const API_URL = import.meta.env.VITE_API_URL;

// Liste des shorts - il suffit de mettre les liens YouTube
const SHORTS_LINKS = [
  "https://youtube.com/shorts/85vAIsGyvSg",
  "https://youtube.com/shorts/PnD2-e_4_0w?si=M_mumDJE_roIQgRI",
  "https://youtube.com/shorts/cP7i2fN1ZQ8?si=ljeDFx-L5mMGPBHz",
  "https://youtube.com/shorts/fHXoSIuhmEE?si=Dw5OrGCShIiwwsJH",
  "https://youtube.com/shorts/z2WjLbv0gyY?si=gj898dtb2K8PZofl",
  "https://youtube.com/shorts/7aKf9_G4QAU?si=8vnEknwuhae5x4ut",
  "https://youtube.com/shorts/VcXTChFlt68?si=LauEw-JUzjz5_5X3",
  "https://youtube.com/shorts/VcXTChFlt68?si=f4uua2-JZ7jzwfXQ",
  "https://youtube.com/shorts/Fdep5IZE2Pk?si=3BrbjvDgJinNWX-x"
];

export default function YouTube() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentShortsPage, setCurrentShortsPage] = useState(0);
  const [shortsMetadata, setShortsMetadata] = useState({});
  
  const SHORTS_PER_PAGE = 6;

  useEffect(() => {
    fetchVideos();
    fetchShortsMetadata();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`${API_URL}/youtube-videos`);
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShortsMetadata = async () => {
    const metadata = {};
    
    for (const link of SHORTS_LINKS) {
      const videoId = extractShortId(link);
      if (videoId) {
        try {
          const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(link)}&format=json`);
          const data = await response.json();
          metadata[videoId] = {
            title: data.title,
            author: data.author_name
          };
        } catch (error) {
          console.error(`Error fetching metadata for ${videoId}:`, error);
          metadata[videoId] = {
            title: `Short #${videoId}`,
            author: 'YouTube'
          };
        }
      }
    }
    
    setShortsMetadata(metadata);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num;
  };

  // Extraire l'ID d'un lien YouTube Short
  const extractShortId = (url) => {
    const match = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  // Générer les données des shorts à partir des liens
  const shortsData = SHORTS_LINKS.map((link, index) => {
    const videoId = extractShortId(link);
    return {
      id: index + 1,
      url: link,
      videoId: videoId,
      thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null,
    };
  }).filter(short => short.videoId); // Garder uniquement les shorts valides

  // Calculer les pages
  const totalPages = Math.ceil(shortsData.length / SHORTS_PER_PAGE);
  const startIndex = currentShortsPage * SHORTS_PER_PAGE;
  const endIndex = startIndex + SHORTS_PER_PAGE;
  const currentShorts = shortsData.slice(startIndex, endIndex);

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

  if (loading) {
    return (
      <div className="youtube-page">
        <div className="container">
          <div className="loading">Chargement des vidéos...</div>
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
              <h1>Kizame</h1>
              <p className="channel-handle">@Kizame1</p>
              <a 
                href="https://www.youtube.com/@Kizame1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="subscribe-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                S'abonner
              </a>
            </div>
          </div>
          <p className="channel-description animate-fade-in">
            Essais vidéo sur l'IA, les fake news, l'art, le gaming et la technologie • Montage • Graphisme
          </p>
        </div>
      </section>

      <section className="videos-content section">
        <div className="container">
          <h2 className="section-title">Vidéos</h2>
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
                    <div className="featured-badge">⭐ Mise en avant</div>
                  )}
                </div>

                <div className="video-details">
                  <h3>{video.title}</h3>
                  <p className="video-description">{video.description}</p>
                  
                  <div className="video-stats">
                    {video.published_at && (
                      <span className="video-date">
                        {new Date(video.published_at).toLocaleDateString('fr-FR', { 
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
              <p>Aucune vidéo disponible pour le moment.</p>
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
                  ◀ Précédent
                </button>
                <span className="pagination-info">
                  {currentShortsPage + 1} / {totalPages}
                </span>
                <button 
                  className="pagination-btn" 
                  onClick={nextShortsPage}
                  disabled={currentShortsPage === totalPages - 1}
                >
                  Suivant ▶
                </button>
              </div>
            )}
          </div>
          <div className="shorts-carousel">
            <div className="shorts-track">
              {currentShorts.map((short) => {
                const metadata = shortsMetadata[short.videoId];
                const title = metadata?.title || `Short #${short.id}`;
                const author = metadata?.author || 'Chargement...';
                
                return (
                  <a 
                    key={short.id} 
                    href={short.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="short-card"
                  >
                    <div className="short-thumbnail">
                      <img src={short.thumbnail} alt={title} />
                      <div className="short-overlay">
                        <div className="short-play-button">▶</div>
                      </div>
                    </div>
                    <div className="short-info">
                      <h4>{title}</h4>
                      <p>{author}</p>
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
          <h2 className="section-title">Compétences Vidéo & Design</h2>
          <div className="skills-grid">
            <div className="skill-card">
              <div className="skill-icon">🎬</div>
              <h3>Montage Vidéo</h3>
              <p>Adobe Premiere Pro, After Effects</p>
            </div>
            <div className="skill-card">
              <div className="skill-icon">🎨</div>
              <h3>Graphisme</h3>
              <p>Photoshop, Canva, Design de miniatures YouTube</p>
            </div>
            <div className="skill-card">
              <div className="skill-icon">✍️</div>
              <h3>Écriture</h3>
              <p>Essais vidéo, storytelling, scripts créatifs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
