import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function AdminContacts() {
  const { authFetch } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await authFetch(`${API_URL}/contacts`);
      const data = await res.json();
      setItems(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce message ?')) return;
    await authFetch(`${API_URL}/contacts/${id}`, { method: 'DELETE' });
    setSelected(null);
    fetchItems();
  };

  const toggleRead = async (item) => {
    await authFetch(`${API_URL}/contacts/${item.id}/read`, {
      method: 'PUT',
    });
    fetchItems();
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  const unreadCount = items.filter(i => !i.read).length;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Messages ({items.length}) {unreadCount > 0 && <span className="admin-badge admin-badge-red">{unreadCount} non lu{unreadCount > 1 ? 's' : ''}</span>}</h1>
      </div>

      <div className="admin-contacts-layout">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Nom</th>
                <th>Email</th>
                <th>Sujet</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className={!item.read ? 'unread-row' : ''} onClick={() => setSelected(item)} style={{cursor: 'pointer'}}>
                  <td>{!item.read && <span className="unread-dot">●</span>}</td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.email}</td>
                  <td>{item.subject || '—'}</td>
                  <td>{item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR') : '—'}</td>
                  <td className="actions" onClick={e => e.stopPropagation()}>
                    <button className="btn-edit" onClick={() => toggleRead(item)}>
                      {item.read ? 'Non lu' : 'Lu'}
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(item.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="admin-empty"><p>Aucun message</p></div>}
        </div>

        {selected && (
          <div className="admin-contact-detail">
            <div className="admin-contact-detail-header">
              <h3>{selected.subject || 'Sans sujet'}</h3>
              <button className="admin-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="admin-contact-detail-meta">
              <p><strong>De :</strong> {selected.name} ({selected.email})</p>
              {selected.phone && <p><strong>Tél :</strong> {selected.phone}</p>}
              <p><strong>Date :</strong> {selected.created_at ? new Date(selected.created_at).toLocaleString('fr-FR') : '—'}</p>
            </div>
            <div className="admin-contact-detail-body">
              <p>{selected.message}</p>
            </div>
            <div className="admin-contact-detail-actions">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || ''}`} className="btn-save">
                Répondre par email
              </a>
              <button className="btn-delete" onClick={() => handleDelete(selected.id)}>Supprimer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
