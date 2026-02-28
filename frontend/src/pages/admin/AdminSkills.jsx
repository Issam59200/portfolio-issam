import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function AdminSkills() {
  const { authFetch } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [current, setCurrent] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/skills`, { headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      setItems(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setCurrent({ name: '', category: 'frontend', level: 50, icon: '', featured: false, order: 0 });
    setModal('add');
  };

  const openEdit = (item) => { setCurrent({ ...item }); setModal('edit'); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = modal === 'edit' ? `${API_URL}/skills/${current.id}` : `${API_URL}/skills`;
      const method = modal === 'edit' ? 'PUT' : 'POST';
      await authFetch(url, { method, body: JSON.stringify(current) });
      setModal(null);
      fetchItems();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette compétence ?')) return;
    await authFetch(`${API_URL}/skills/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Compétences ({items.length})</h1>
        <button className="admin-add-btn" onClick={openAdd}>+ Ajouter</button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Icône</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Niveau</th>
              <th>Featured</th>
              <th>Ordre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.icon || '—'}</td>
                <td><strong>{item.name}</strong></td>
                <td><span className="admin-badge admin-badge-blue">{item.category}</span></td>
                <td>
                  <div className="skill-bar-mini">
                    <div className="skill-bar-fill" style={{ width: `${item.level}%` }}></div>
                    <span>{item.level}%</span>
                  </div>
                </td>
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
        {items.length === 0 && <div className="admin-empty"><p>Aucune compétence</p></div>}
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{modal === 'edit' ? 'Modifier la compétence' : 'Nouvelle compétence'}</h2>
              <button className="admin-modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div className="form-group">
                <label>Nom *</label>
                <input value={current.name || ''} onChange={e => setCurrent({...current, name: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Catégorie</label>
                  <select value={current.category || 'frontend'} onChange={e => setCurrent({...current, category: e.target.value})}>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="database">Database</option>
                    <option value="devops">DevOps</option>
                    <option value="tools">Outils</option>
                    <option value="language">Langages</option>
                    <option value="framework">Framework</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Niveau ({current.level || 0}%)</label>
                  <input type="range" min="0" max="100" value={current.level || 0} onChange={e => setCurrent({...current, level: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Icône (classe ou emoji)</label>
                  <input value={current.icon || ''} onChange={e => setCurrent({...current, icon: e.target.value})} />
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
