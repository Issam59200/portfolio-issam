import { useState } from 'react';
import './Contact.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        let message = 'Erreur lors de l\'envoi';
        try {
          const data = await res.json();
          message = data.message || message;
        } catch {}
        throw new Error(message);
      }

      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <h1>Me Contacter</h1>
          <p className="hero-subtitle">Une question, une proposition ou simplement envie de discuter ? N'hésitez pas !</p>
        </div>
      </section>

      <section className="contact-body section">
        <div className="container">
          <div className="contact-grid">
            {/* Colonne formulaire */}
            <div className="contact-form-col">
              <h2>Envoyez-moi un message</h2>

              {status === 'success' && (
                <div className="contact-alert contact-alert-success">
                  Message envoyé avec succès ! Je vous répondrai dès que possible.
                </div>
              )}
              {status === 'error' && (
                <div className="contact-alert contact-alert-error">
                  {errorMsg || 'Une erreur est survenue. Veuillez réessayer.'}
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="name">Nom *</label>
                    <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Votre nom" />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="email">Email *</label>
                    <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required placeholder="votre@email.com" />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="subject">Sujet</label>
                  <input type="text" id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="Le sujet de votre message" />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea id="message" name="message" value={form.message} onChange={handleChange} required rows={8} placeholder="Votre message..." />
                </div>

                <button type="submit" className="contact-submit-btn" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>

            {/* Colonne infos */}
            <div className="contact-info-col">
              <h2>Informations</h2>
              <div className="contact-info-cards">
                <div className="contact-info-card">
                  <span className="contact-info-icon">📧</span>
                  <div>
                    <h3>Email</h3>
                    <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                      Ou envoyer directement à{' '}
                      <a
                        href="mailto:kizamesenpro@gmail.com"
                        style={{ color: '#74B9FF', fontWeight: '600', textDecoration: 'underline' }}
                      >
                        kizamesenpro@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
                <div className="contact-info-card">
                  <span className="contact-info-icon">📍</span>
                  <div>
                    <h3>Localisation</h3>
                    <p>France</p>
                  </div>
                </div>
                <div className="contact-info-card">
                  <span className="contact-info-icon">💼</span>
                  <div>
                    <h3>Disponibilité</h3>
                    <p>Ouvert aux opportunités</p>
                  </div>
                </div>
                <div className="contact-info-card">
                  <span className="contact-info-icon">🔗</span>
                  <div>
                    <h3>Réseaux</h3>
                    <div className="contact-social-links">
                      <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
                      <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
