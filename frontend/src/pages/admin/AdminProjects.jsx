import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function AdminProjects() {
  const { authFetch } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [current, setCurrent] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`, { headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      setItems(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setCurrent({ title: '', description: '', category: 'web', status: 'completed', stack: '', featured: false, order: 0 });
    setModal('add');
  };

  const openEdit = (item) => {
    setCurrent({
      ...item,
      stack: Array.isArray(item.stack) ? item.stack.join(', ') : (item.stack || ''),
    });
    setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = { ...current };
      if (typeof body.stack === 'string') {
        body.stack = body.stack.split(',').map(s => s.trim()).filter(Boolean);
      }
      const url = modal === 'edit' ? `${API_URL}/projects/${current.id}` : `${API_URL}/projects`;
      const method = modal === 'edit' ? 'PUT' : 'POST';
      await authFetch(url, { method, body: JSON.stringify(body) });
      setModal(null);
      fetchItems();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce projet ?')) return;
    await authFetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Projets ({items.length})</h1>
        <button className="admin-add-btn" onClick={openAdd}>+ Ajouter</button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Ordre</th>
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
                <td><span className="admin-badge admin-badge-blue">{item.category}</span></td>
                <td><span className="admin-badge admin-badge-green">{item.status}</span></td>
                <td>{item.featured ? '⭐' : '—'}</td>
                <td>{item.order}</td>
                <td className="actions">
                  <button className="btn-edit" onClick={() => openEdit(item)}>Modifier</button>
                  <button className="btn-delete" onClick={() => handleDelete(item.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="admin-empty"><p>Aucun projet</p></div>}
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{modal === 'edit' ? 'Modifier le projet' : 'Nouveau projet'}</h2>
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
              <div className="form-group">
                <label>Description détaillée (HTML)</label>
                <textarea rows={4} value={current.detailed_description || ''} onChange={e => setCurrent({...current, detailed_description: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Catégorie</label>
                  <select value={current.category || 'web'} onChange={e => setCurrent({...current, category: e.target.value})}>
                    <option value="web">Web</option>
                    <option value="desktop">Desktop</option>
                    <option value="data">Data</option>
                    <option value="database">Database</option>
                    <option value="system">Système</option>
                    <option value="network">Réseau</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={current.status || 'completed'} onChange={e => setCurrent({...current, status: e.target.value})}>
                    <option value="completed">Terminé</option>
                    <option value="in-progress">En cours</option>
                    <option value="planned">Planifié</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Technologies (séparées par des virgules)</label>
                <input value={current.stack || ''} onChange={e => setCurrent({...current, stack: e.target.value})} placeholder="React, Node.js, MySQL" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Image (chemin)</label>
                  <input value={current.image || ''} onChange={e => setCurrent({...current, image: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Thumbnail (chemin)</label>
                  <input value={current.thumbnail || ''} onChange={e => setCurrent({...current, thumbnail: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Lien</label>
                  <input value={current.link || ''} onChange={e => setCurrent({...current, link: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>GitHub</label>
                  <input value={current.github || ''} onChange={e => setCurrent({...current, github: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>URL Vidéo</label>
                  <input value={current.video_url || ''} onChange={e => setCurrent({...current, video_url: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>URL Démo</label>
                  <input value={current.demo_url || ''} onChange={e => setCurrent({...current, demo_url: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date début</label>
                  <input type="date" value={current.start_date ? current.start_date.slice(0,10) : ''} onChange={e => setCurrent({...current, start_date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Date fin</label>
                  <input type="date" value={current.end_date ? current.end_date.slice(0,10) : ''} onChange={e => setCurrent({...current, end_date: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Rôle</label>
                  <input value={current.role || ''} onChange={e => setCurrent({...current, role: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Taille équipe</label>
                  <input type="number" value={current.team_size || ''} onChange={e => setCurrent({...current, team_size: parseInt(e.target.value) || null})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ordre</label>
                  <input type="number" value={current.order || 0} onChange={e => setCurrent({...current, order: parseInt(e.target.value) || 0})} />
                </div>
                <div className="form-group form-check" style={{alignSelf: 'flex-end', paddingBottom: '0.6rem'}}>
                  <input type="checkbox" id="featured" checked={!!current.featured} onChange={e => setCurrent({...current, featured: e.target.checked})} />
                  <label htmlFor="featured" style={{marginBottom: 0}}>Featured</label>
                </div>
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
