import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function AdminYouTube() {
  const { authFetch } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [current, setCurrent] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/youtube-videos`, { headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      setItems(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setCurrent({ title: '', video_id: '', video_url: '', description: '', category: '', featured: false, order: 0 });
    setModal('add');
  };

  const openEdit = (item) => { setCurrent({ ...item }); setModal('edit'); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = modal === 'edit' ? `${API_URL}/youtube-videos/${current.id}` : `${API_URL}/youtube-videos`;
      const method = modal === 'edit' ? 'PUT' : 'POST';
      await authFetch(url, { method, body: JSON.stringify(current) });
      setModal(null);
      fetchItems();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette vidéo ?')) return;
    await authFetch(`${API_URL}/youtube-videos/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Vidéos YouTube ({items.length})</h1>
        <button className="admin-add-btn" onClick={openAdd}>+ Ajouter</button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Aperçu</th>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Video ID</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  {item.video_id && (
                    <img src={`https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`} alt="" className="admin-thumb" style={{width: '80px'}} />
                  )}
                </td>
                <td><strong>{item.title}</strong></td>
                <td><span className="admin-badge admin-badge-red">{item.category || '—'}</span></td>
                <td><code>{item.video_id}</code></td>
                <td>{item.featured ? '⭐' : '—'}</td>
                <td className="actions">
                  <button className="btn-edit" onClick={() => openEdit(item)}>Modifier</button>
                  <button className="btn-delete" onClick={() => handleDelete(item.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="admin-empty"><p>Aucune vidéo</p></div>}
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{modal === 'edit' ? 'Modifier la vidéo' : 'Nouvelle vidéo'}</h2>
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
                  <label>Video ID *</label>
                  <input value={current.video_id || ''} onChange={e => setCurrent({...current, video_id: e.target.value})} placeholder="dQw4w9WgXcQ" />
                </div>
                <div className="form-group">
                  <label>URL complète</label>
                  <input value={current.video_url || ''} onChange={e => setCurrent({...current, video_url: e.target.value})} placeholder="https://youtube.com/watch?v=..." />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Catégorie</label>
                  <input value={current.category || ''} onChange={e => setCurrent({...current, category: e.target.value})} placeholder="Tutorial, Projet..." />
                </div>
                <div className="form-group">
                  <label>Thumbnail URL</label>
                  <input value={current.thumbnail_url || ''} onChange={e => setCurrent({...current, thumbnail_url: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Durée</label>
                  <input value={current.duration || ''} onChange={e => setCurrent({...current, duration: e.target.value})} placeholder="10:30" />
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
