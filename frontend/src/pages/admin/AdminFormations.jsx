import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function AdminFormations() {
  const { authFetch } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [current, setCurrent] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/formations`, { headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      setItems(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setCurrent({ school: '', degree: '', field: '', description: '', skills_acquired: '', start_date: '', end_date: '', current: false, order: 0 });
    setModal('add');
  };

  const openEdit = (item) => {
    setCurrent({
      ...item,
      skills_acquired: Array.isArray(item.skills_acquired) ? item.skills_acquired.join(', ') : (item.skills_acquired || ''),
    });
    setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = { ...current };
      if (typeof body.skills_acquired === 'string') {
        body.skills_acquired = body.skills_acquired.split(',').map(s => s.trim()).filter(Boolean);
      }
      const url = modal === 'edit' ? `${API_URL}/formations/${current.id}` : `${API_URL}/formations`;
      const method = modal === 'edit' ? 'PUT' : 'POST';
      await authFetch(url, { method, body: JSON.stringify(body) });
      setModal(null);
      fetchItems();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette formation ?')) return;
    await authFetch(`${API_URL}/formations/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Formations ({items.length})</h1>
        <button className="admin-add-btn" onClick={openAdd}>+ Ajouter</button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>École</th>
              <th>Diplôme</th>
              <th>Domaine</th>
              <th>Période</th>
              <th>En cours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td><strong>{item.school}</strong></td>
                <td>{item.degree}</td>
                <td><span className="admin-badge admin-badge-green">{item.field || '—'}</span></td>
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
        {items.length === 0 && <div className="admin-empty"><p>Aucune formation</p></div>}
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{modal === 'edit' ? 'Modifier la formation' : 'Nouvelle formation'}</h2>
              <button className="admin-modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <div className="form-group">
                <label>École / Université *</label>
                <input value={current.school || ''} onChange={e => setCurrent({...current, school: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Diplôme *</label>
                  <input value={current.degree || ''} onChange={e => setCurrent({...current, degree: e.target.value})} placeholder="Licence, Master, BTS..." />
                </div>
                <div className="form-group">
                  <label>Domaine</label>
                  <input value={current.field || ''} onChange={e => setCurrent({...current, field: e.target.value})} placeholder="Informatique, Réseaux..." />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={current.description || ''} onChange={e => setCurrent({...current, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Compétences acquises (séparées par des virgules)</label>
                <input value={current.skills_acquired || ''} onChange={e => setCurrent({...current, skills_acquired: e.target.value})} placeholder="JavaScript, Python, SQL" />
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
                  <label>URL École</label>
                  <input value={current.school_url || ''} onChange={e => setCurrent({...current, school_url: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Logo (chemin)</label>
                  <input value={current.logo || ''} onChange={e => setCurrent({...current, logo: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ordre</label>
                  <input type="number" value={current.order || 0} onChange={e => setCurrent({...current, order: parseInt(e.target.value) || 0})} />
                </div>
                <div className="form-check" style={{alignSelf: 'flex-end', paddingBottom: '0.6rem'}}>
                  <input type="checkbox" id="current" checked={!!current.current} onChange={e => setCurrent({...current, current: e.target.checked})} />
                  <label htmlFor="current" style={{marginBottom: 0}}>En cours</label>
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
