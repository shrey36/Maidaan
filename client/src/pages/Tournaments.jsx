import React, { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/tournaments');
      setTournaments(data || []);
    } catch (err) {
      console.error('Failed to load tournaments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotify = (name) => {
    setToastMessage(`You have been subscribed to updates for "${name}"!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <main className="section">
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <h1 className="section-title">Sports Tournaments</h1>
            <span className="badge badge-gold">Early Access</span>
          </div>
          <p className="section-subtitle" style={{ margin: 0 }}>Compete in local leagues, win trophy championships, and earn cash prize pools.</p>
        </div>

        {toastMessage && (
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: 600 }}>
            🔔 {toastMessage}
          </div>
        )}

        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Loading tournaments...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
            {tournaments.map(t => (
              <div key={t.id || t._id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '180px' }}>
                  <img src={t.imageUrl} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80'; }} />
                  <span className="badge badge-gold" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>Early Access</span>
                  <span className="badge badge-primary" style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>{t.status}</span>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{t.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>📍 {t.location} • Organiser: {t.organizer}</p>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{t.description}</p>

                  <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '0.8rem 0', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PRIZE POOL</div>
                      <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{t.prizePool}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ENTRY FEE</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.1rem' }}>₹{t.entryFee}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TEAMS</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.1rem' }}>Max {t.maxTeams}</div>
                    </div>
                  </div>

                  <button onClick={() => handleNotify(t.name)} className="btn btn-primary btn-block">🔔 Notify Me / Pre-Register</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Tournaments;
