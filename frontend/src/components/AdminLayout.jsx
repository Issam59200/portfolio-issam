import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const links = [
    { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
    { to: '/admin/projects', label: 'Projets', icon: '💻' },
    { to: '/admin/skills', label: 'Compétences', icon: '⚡' },
    { to: '/admin/games', label: 'Jeux', icon: '🎮' },
    { to: '/admin/youtube', label: 'YouTube', icon: '📺' },
    { to: '/admin/experiences', label: 'Expériences', icon: '🏢' },
    { to: '/admin/formations', label: 'Formations', icon: '🎓' },
    { to: '/admin/contacts', label: 'Messages', icon: '✉️' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <span className="admin-user">{user?.name}</span>
        </div>

        <nav className="admin-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" className="admin-nav-link" target="_blank" rel="noopener noreferrer">
            <span className="admin-nav-icon">🌐</span>
            Voir le site
          </a>
          <button onClick={handleLogout} className="admin-logout-btn">
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
