import React, { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [query, setQuery] = useState('');
  const [sport, setSport] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    loadPlayers();
  }, [query, sport, skillLevel]);

  const loadPlayers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (sport) params.append('sport', sport);
      if (skillLevel) params.append('skillLevel', skillLevel);

      const data = await fetchApi(`/players?${params.toString()}`);
      setPlayers(data || []);
    } catch (err) {
      console.error('Failed to load players:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section">
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h1 className="section-title">Player Directory</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>Connect with local players, discover teammates, and scout talent for your squad.</p>
        </div>

        {/* Filters Bar */}
        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              className="form-control" 
              placeholder="Search by name, position or location..." 
            />
            <select value={sport} onChange={(e) => setSport(e.target.value)} className="form-control">
              <option value="">All Sports</option>
              <option value="Football">Football</option>
              <option value="Cricket">Cricket</option>
              <option value="Futsal">Futsal</option>
            </select>
            <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className="form-control">
              <option value="">All Skill Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Pro">Pro</option>
            </select>
          </div>
        </div>

        {/* Players Grid */}
        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Loading player directory...</p>
        ) : players.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }} className="glass-panel">
            <p style={{ color: 'var(--text-muted)' }}>No players found matching criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {players.map(p => (
              <div key={p.id || p._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img 
                    src={p.avatarUrl || p.profileImage} 
                    alt={p.name} 
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'; }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.15rem' }}>{p.name}</h3>
                    <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>{p.sport} • {p.position}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>📍 {p.location}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '0.6rem 0' }}>
                  <div><strong>Matches:</strong> {p.matchesPlayed || 0}</div>
                  <div><strong>Goals/Pts:</strong> {p.goalsPoints || p.goals || 0}</div>
                  <div><span className="badge badge-gold">{p.skillLevel}</span></div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flex: 1 }}>"{p.bio || 'Dedicated team player.'}"</p>

                <button onClick={() => setSelectedPlayer(p)} className="btn btn-secondary btn-sm btn-block">View Full Profile</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Player Modal */}
      {selectedPlayer && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img src={selectedPlayer.avatarUrl || selectedPlayer.profileImage} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                <div>
                  <h3 style={{ fontSize: '1.3rem' }}>{selectedPlayer.name}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>{selectedPlayer.sport} • {selectedPlayer.position}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>✕</button>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <p style={{ marginBottom: '0.3rem' }}><strong>Team:</strong> <span style={{ color: 'var(--text-main)' }}>{selectedPlayer.teamName || selectedPlayer.team || 'Free Agent'}</span></p>
              <p style={{ marginBottom: '0.3rem' }}><strong>Career Stats:</strong> <span style={{ color: 'var(--primary)' }}>{selectedPlayer.matchesPlayed} Matches | {selectedPlayer.goalsPoints || selectedPlayer.goals} Goals</span></p>
              <p><strong>Availability:</strong> <span style={{ color: 'var(--text-muted)' }}>{selectedPlayer.availability || 'Available'}</span></p>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>{selectedPlayer.bio}</p>

            <button onClick={() => setSelectedPlayer(null)} className="btn btn-primary btn-block">Close Profile</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Players;
