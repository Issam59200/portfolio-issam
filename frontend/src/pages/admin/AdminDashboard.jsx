import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function AdminDashboard() {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const publicEndpoints = ['projects', 'skills', 'games', 'youtube-videos', 'experiences', 'formations'];
        const publicResults = await Promise.all(
          publicEndpoints.map(e => fetch(`${API_URL}/${e}`, { headers: { 'Accept': 'application/json' } }).then(r => r.json()).catch(() => []))
        );
        // contacts nécessite l'authentification
        let contactsData = [];
        try {
          const contactsRes = await authFetch(`${API_URL}/contacts`);
          if (contactsRes.ok) contactsData = await contactsRes.json();
        } catch {}
        const results = [...publicResults, contactsData];
        setStats({
          projects: results[0]?.length || 0,
          skills: results[1]?.length || 0,
          games: results[2]?.length || 0,
          videos: results[3]?.length || 0,
          experiences: results[4]?.length || 0,
          formations: results[5]?.length || 0,
          contacts: results[6]?.length || 0,
          unreadContacts: Array.isArray(results[6]) ? results[6].filter(c => !c.read).length : 0,
        });
      } catch {
        setStats({});
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="admin-loading">Chargement...</div>;

  const cards = [
    { icon: '💻', value: stats?.projects || 0, label: 'Projets' },
    { icon: '⚡', value: stats?.skills || 0, label: 'Compétences' },
    { icon: '🎮', value: stats?.games || 0, label: 'Jeux' },
    { icon: '📺', value: stats?.videos || 0, label: 'Vidéos YouTube' },
    { icon: '🏢', value: stats?.experiences || 0, label: 'Expériences' },
    { icon: '🎓', value: stats?.formations || 0, label: 'Formations' },
    { icon: '✉️', value: stats?.contacts || 0, label: 'Messages' },
    { icon: '🔔', value: stats?.unreadContacts || 0, label: 'Non lus' },
  ];

  return (
    <div className="admin-dashboard">
      <h1>Tableau de bord</h1>
      <div className="admin-stats-grid">
        {cards.map((card, i) => (
          <div key={i} className="admin-stat-card">
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
