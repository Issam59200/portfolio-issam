import { useState } from 'react';
import './Contact.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const { t } = useLanguage();

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
        let message = t.contact.sendError;
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
      setErrorMsg(err.message || t.contact.errorDefault);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <h1>{t.contact.title}</h1>
          <p className="hero-subtitle">{t.contact.subtitle}</p>
        </div>
      </section>

      <section className="contact-body section">
        <div className="container">
          <div className="contact-grid">
            {/* Colonne formulaire */}
            <div className="contact-form-col">
              <h2>{t.contact.formTitle}</h2>

              {status === 'success' && (
                <div className="contact-alert contact-alert-success">
                  {t.contact.successMsg}
                </div>
              )}
              {status === 'error' && (
                <div className="contact-alert contact-alert-error">
                  {errorMsg || t.contact.errorDefault}
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="name">{t.contact.labelName}</label>
                    <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required placeholder={t.contact.placeholderName} />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="email">{t.contact.labelEmail}</label>
                    <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required placeholder={t.contact.placeholderEmail} />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="subject">{t.contact.labelSubject}</label>
                  <input type="text" id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder={t.contact.placeholderSubject} />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="message">{t.contact.labelMessage}</label>
                  <textarea id="message" name="message" value={form.message} onChange={handleChange} required rows={8} placeholder={t.contact.placeholderMessage} />
                </div>

                <button type="submit" className="contact-submit-btn" disabled={status === 'sending'}>
                  {status === 'sending' ? t.contact.sending : t.contact.send}
                </button>
              </form>
            </div>

            {/* Colonne infos */}
            <div className="contact-info-col">
              <h2>{t.contact.infoTitle}</h2>
              <div className="contact-info-cards">
                <div className="contact-info-card">
                  <span className="contact-info-icon">📧</span>
                  <div>
                    <h3>{t.contact.emailLabel}</h3>
                    <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                      {t.contact.emailOr}{' '}
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
                    <h3>{t.contact.locationLabel}</h3>
                    <p>{t.contact.locationValue}</p>
                  </div>
                </div>
                <div className="contact-info-card">
                  <span className="contact-info-icon">💼</span>
                  <div>
                    <h3>{t.contact.availLabel}</h3>
                    <p>{t.contact.availValue}</p>
                  </div>
                </div>
                <div className="contact-info-card">
                  <span className="contact-info-icon">🔗</span>
                  <div>
                    <h3>{t.contact.networksLabel}</h3>
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
