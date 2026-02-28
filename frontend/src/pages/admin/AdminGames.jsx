import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function AdminGames() {
  const { authFetch } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [current, setCurrent] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/games`, { headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      setItems(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setCurrent({ title: '', description: '', game_type: '', technology: '', thumbnail: '', featured: false, order: 0 });
    setModal('add');
  };

  const openEdit = (item) => { setCurrent({ ...item }); setModal('edit'); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = modal === 'edit' ? `${API_URL}/games/${current.id}` : `${API_URL}/games`;
      const method = modal === 'edit' ? 'PUT' : 'POST';
      await authFetch(url, { method, body: JSON.stringify(current) });
      setModal(null);
      fetchItems();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce jeu ?')) return;
    await authFetch(`${API_URL}/games/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Jeux ({items.length})</h1>
        <button className="admin-add-btn" onClick={openAdd}>+ Ajouter</button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Titre</th>
              <th>Type</th>
              <th>Technologie</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  {item.thumbnail && <img src={`/${item.thumbnail}`} alt="" className="admin-thumb" />}
                </td>
                <td><strong>{item.title}</strong></td>
                <td><span className="admin-badge admin-badge-purple">{item.game_type || '—'}</span></td>
                <td>{item.technology || '—'}</td>
                <td>{item.featured ? '⭐' : '—'}</td>
                <td className="actions">
                  <button className="btn-edit" onClick={() => openEdit(item)}>Modifier</button>
                  <button className="btn-delete" onClick={() => handleDelete(item.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="admin-empty"><p>Aucun jeu</p></div>}
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{modal === 'edit' ? 'Modifier le jeu' : 'Nouveau jeu'}</h2>
              <button className="admin-modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div className="form-group">
                <label>Titre *</label>
                <input value={current.title || ''} onChange={e => setCurrent({...current, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={current.description || ''} onChange={e => setCurrent({...current, description: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type de jeu</label>
                  <input value={current.game_type || ''} onChange={e => setCurrent({...current, game_type: e.target.value})} placeholder="Stratégie, Puzzle..." />
                </div>
                <div className="form-group">
                  <label>Technologie</label>
                  <input value={current.technology || ''} onChange={e => setCurrent({...current, technology: e.target.value})} placeholder="JavaScript, Unity..." />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Thumbnail (chemin)</label>
                  <input value={current.thumbnail || ''} onChange={e => setCurrent({...current, thumbnail: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Lien</label>
                  <input value={current.link || ''} onChange={e => setCurrent({...current, link: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input value={current.github_url || ''} onChange={e => setCurrent({...current, github_url: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Ordre</label>
                  <input type="number" value={current.order || 0} onChange={e => setCurrent({...current, order: parseInt(e.target.value) || 0})} />
                </div>
              </div>
              <div className="form-check">
                <input type="checkbox" id="featured" checked={!!current.featured} onChange={e => setCurrent({...current, featured: e.target.checked})} />
                <label htmlFor="featured">Featured</label>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn-cancel" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
