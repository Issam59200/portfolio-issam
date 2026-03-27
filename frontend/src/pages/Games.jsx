import { useState, useEffect } from 'react';
import './Games.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch(`${API_URL}/games`);
      const data = await response.json();
      setGames(data.reverse());
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB';

  if (loading) {
    return (
      <div className="games-page">
        <div className="container">
          <div className="loading">{t.games.loading}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="games-page">
      <section className="games-hero">
        <div className="container">
          <h1 className="animate-fade-in">
            {t.games.title} <span className="gradient-text">{t.games.titleHighlight}</span>
          </h1>
          <p className="hero-subtitle animate-fade-in">
            {t.games.subtitle}
          </p>
        </div>
      </section>

      <section className="games-content section">
        <div className="container">
          <div className="games-grid">
            {games.map((game, index) => (
              <div
                key={game.id}
                className="game-card animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="game-image">
                  <img
                    src={`${API_URL.replace('/api', '')}/${game.thumbnail}`}
                    alt={game.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Game+Image';
                    }}
                  />
                  <div className="game-type-badge">{game.game_type}</div>
                </div>

                <div className="game-content">
                  <h3>{lang === 'en' && game.title_en ? game.title_en : game.title}</h3>
                  <p className="game-tech">
                    <strong>{t.games.technology}</strong> {game.technology}
                  </p>
                  <p className="game-description">{lang === 'en' && game.description_en ? game.description_en : game.description}</p>

                  {game.release_date && (
                    <p className="game-date">
                      {t.games.released} {new Date(game.release_date).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  )}

                  <div className="game-actions">
                    {game.play_url && (
                      <a href={game.play_url} target="_blank" rel="noopener noreferrer" className="btn-play">
                        {t.games.play}
                      </a>
                    )}
                    {game.video_url && (
                      <a href={game.video_url} target="_blank" rel="noopener noreferrer" className="btn-video">
                        {t.games.video}
                      </a>
                    )}
                    {game.repository_url && (
                      <a href={game.repository_url} target="_blank" rel="noopener noreferrer" className="btn-code">
                        {t.games.code}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {games.length === 0 && (
            <div className="no-games">
              <p>{t.games.noGames}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
