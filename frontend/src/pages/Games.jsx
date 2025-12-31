import { useState, useEffect } from 'react';
import './Games.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch(`${API_URL}/games`);
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="games-page">
        <div className="container">
          <div className="loading">Chargement des jeux...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="games-page">
      <section className="games-hero">
        <div className="container">
          <h1 className="animate-fade-in">
            Mes <span className="gradient-text">Jeux</span>
          </h1>
          <p className="hero-subtitle animate-fade-in">
            Exploration ludique : développement de jeux vidéo et game design
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
                  <h3>{game.title}</h3>
                  <p className="game-tech">
                    <strong>Technologie :</strong> {game.technology}
                  </p>
                  <p className="game-description">{game.description}</p>

                  {game.release_date && (
                    <p className="game-date">
                      Sortie : {new Date(game.release_date).toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </p>
                  )}

                  <div className="game-actions">
                    {game.play_url && (
                      <a href={game.play_url} target="_blank" rel="noopener noreferrer" className="btn-play">
                        🎮 Jouer
                      </a>
                    )}
                    {game.video_url && (
                      <a href={game.video_url} target="_blank" rel="noopener noreferrer" className="btn-video">
                        🎬 Vidéo
                      </a>
                    )}
                    {game.repository_url && (
                      <a href={game.repository_url} target="_blank" rel="noopener noreferrer" className="btn-code">
                        💻 Code
                      </a>
                    )}
                  </div>

                  {game.screenshots && game.screenshots.length > 1 && (
                    <div className="game-screenshots">
                      {game.screenshots.slice(1, 4).map((screenshot, i) => (
                        <img 
                          key={i} 
                          src={`${API_URL.replace('/api', '')}/${screenshot}`}
                          alt={`${game.title} screenshot ${i + 1}`}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {games.length === 0 && (
            <div className="no-games">
              <p>Aucun jeu disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
