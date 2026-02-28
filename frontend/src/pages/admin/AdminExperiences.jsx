import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function AdminExperiences() {
  const { authFetch } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [current, setCurrent] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/experiences`, { headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      setItems(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setCurrent({ company: '', position: '', type: 'stage', description: '', technologies: '', start_date: '', end_date: '', current: false, order: 0 });
    setModal('add');
  };

  const openEdit = (item) => {
    setCurrent({
      ...item,
      technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : (item.technologies || ''),
    });
    setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = { ...current };
      if (typeof body.technologies === 'string') {
        body.technologies = body.technologies.split(',').map(s => s.trim()).filter(Boolean);
      }
      const url = modal === 'edit' ? `${API_URL}/experiences/${current.id}` : `${API_URL}/experiences`;
      const method = modal === 'edit' ? 'PUT' : 'POST';
      await authFetch(url, { method, body: JSON.stringify(body) });
      setModal(null);
      fetchItems();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette expérience ?')) return;
    await authFetch(`${API_URL}/experiences/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Expériences ({items.length})</h1>
        <button className="admin-add-btn" onClick={openAdd}>+ Ajouter</button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Entreprise</th>
              <th>Poste</th>
              <th>Type</th>
              <th>Période</th>
              <th>En cours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td><strong>{item.company}</strong></td>
                <td>{item.position}</td>
                <td><span className="admin-badge admin-badge-purple">{item.type || '—'}</span></td>
                <td>
                  {item.start_date ? new Date(item.start_date).toLocaleDateString('fr-FR') : '—'}
                  {' → '}
                  {item.current ? 'Présent' : (item.end_date ? new Date(item.end_date).toLocaleDateString('fr-FR') : '—')}
                </td>
                <td>{item.current ? '✓' : '—'}</td>
                <td className="actions">
                  <button className="btn-edit" onClick={() => openEdit(item)}>Modifier</button>
                  <button className="btn-delete" onClick={() => handleDelete(item.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="admin-empty"><p>Aucune expérience</p></div>}
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{modal === 'edit' ? 'Modifier l\'expérience' : 'Nouvelle expérience'}</h2>
              <button className="admin-modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Entreprise *</label>
                  <input value={current.company || ''} onChange={e => setCurrent({...current, company: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Poste *</label>
                  <input value={current.position || ''} onChange={e => setCurrent({...current, position: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select value={current.type || 'stage'} onChange={e => setCurrent({...current, type: e.target.value})}>
                    <option value="stage">Stage</option>
                    <option value="alternance">Alternance</option>
                    <option value="cdi">CDI</option>
                    <option value="cdd">CDD</option>
                    <option value="freelance">Freelance</option>
                    <option value="benevolat">Bénévolat</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Lieu</label>
                  <input value={current.location || ''} onChange={e => setCurrent({...current, location: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={current.description || ''} onChange={e => setCurrent({...current, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Technologies (séparées par des virgules)</label>
                <input value={current.technologies || ''} onChange={e => setCurrent({...current, technologies: e.target.value})} placeholder="React, Laravel, MySQL" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date début</label>
                  <input type="date" value={current.start_date ? current.start_date.slice(0,10) : ''} onChange={e => setCurrent({...current, start_date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Date fin</label>
                  <input type="date" value={current.end_date ? current.end_date.slice(0,10) : ''} onChange={e => setCurrent({...current, end_date: e.target.value})} disabled={current.current} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>URL Entreprise</label>
                  <input value={current.company_url || ''} onChange={e => setCurrent({...current, company_url: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Ordre</label>
                  <input type="number" value={current.order || 0} onChange={e => setCurrent({...current, order: parseInt(e.target.value) || 0})} />
                </div>
              </div>
              <div className="form-check">
                <input type="checkbox" id="current" checked={!!current.current} onChange={e => setCurrent({...current, current: e.target.checked})} />
                <label htmlFor="current">En cours actuellement</label>
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
