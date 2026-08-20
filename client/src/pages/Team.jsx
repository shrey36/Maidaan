import React, { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';

const Team = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  const [teamName, setTeamName] = useState('');
  const [teamSport, setTeamSport] = useState('Football');
  const [teamDesc, setTeamDesc] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/teams/my');
      if (res.message || !res.id) {
        setTeam(null);
      } else {
        setTeam(res);
      }
    } catch (err) {
      setTeam(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await fetchApi('/teams', {
        method: 'POST',
        body: JSON.stringify({ name: teamName, sport: teamSport, description: teamDesc })
      });
      loadTeam();
    } catch (err) {
      setError(err.message || 'Failed to create team');
    }
  };

  const handleRemovePlayer = async (playerId) => {
    if (!team) return;
    try {
      await fetchApi(`/teams/${team.id || team._id}/remove-player/${playerId}`, { method: 'DELETE' });
      loadTeam();
    } catch (err) {
      alert(err.message || 'Failed to remove player');
    }
  };

  const openAddPlayerModal = async () => {
    setShowAddModal(true);
    try {
      const allPlayers = await fetchApi('/players');
      setAvailablePlayers(allPlayers || []);
      if (allPlayers.length > 0) {
        setSelectedPlayerId(allPlayers[0].id || allPlayers[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmAddPlayer = async () => {
    if (!selectedPlayerId || !team) return;
    try {
      await fetchApi(`/teams/${team.id || team._id}/add-player/${selectedPlayerId}`, { method: 'POST' });
      setShowAddModal(false);
      loadTeam();
    } catch (err) {
      alert(err.message || 'Failed to add player');
    }
  };

  if (loading) {
    return (
      <main className="section">
        <div className="container" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading team details...
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        {!team ? (
          <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Create Your Team</h2>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>Build your squad, add players, and get ready for local turf matches and upcoming tournaments.</p>
            
            {error && (
              <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleCreateTeam}>
              <div className="form-group">
                <label className="form-label">Team Name</label>
                <input 
                  type="text" 
                  value={teamName} 
                  onChange={(e) => setTeamName(e.target.value)} 
                  className="form-control" 
                  placeholder="e.g. Maidaan Warriors" 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Sport</label>
                <select value={teamSport} onChange={(e) => setTeamSport(e.target.value)} className="form-control">
                  <option value="Football">Football</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Futsal">Futsal</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Basketball">Basketball</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Team Description / Motto</label>
                <textarea 
                  value={teamDesc} 
                  onChange={(e) => setTeamDesc(e.target.value)} 
                  className="form-control" 
                  rows="3" 
                  placeholder="Describe your team vision or motto..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-block">Create Squad</button>
            </form>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            {/* Squad Info */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>{team.sport} Team</span>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{team.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>"{team.description}"</p>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Captain:</span>
                  <span>{team.captain?.fullName || team.captain?.name || 'Shrey'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Squad Strength:</span>
                  <span className="badge badge-gold">{(team.members || []).length} / {team.maxSquadSize || 11} Players</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Auction Spent:</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{team.budgetSpent}</span>
                </div>
              </div>

              <button onClick={openAddPlayerModal} className="btn btn-primary btn-block">+ Add Player to Squad</button>
            </div>

            {/* Roster List */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Active Squad Roster</h3>
              {(team.members || []).length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No players in squad yet. Click "+ Add Player to Squad" to add registered players.</p>
              ) : (
                team.members.map(p => (
                  <div key={p.id || p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={p.avatarUrl || p.profileImage} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'; }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.position} • {p.skillLevel}</div>
                      </div>
                    </div>
                    <button onClick={() => handleRemovePlayer(p.id || p._id)} className="btn btn-danger btn-sm">Remove</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Player Modal */}
      {showAddModal && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <h3 style={{ marginBottom: '0.5rem' }}>Add Player to Squad</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Select registered player from the Maidaan directory.</p>

            <div className="form-group">
              <label className="form-label">Select Player</label>
              <select value={selectedPlayerId} onChange={(e) => setSelectedPlayerId(e.target.value)} className="form-control">
                {availablePlayers.map(p => (
                  <option key={p.id || p._id} value={p.id || p._id}>
                    {p.name} ({p.position} - {p.sport})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setShowAddModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleConfirmAddPlayer} className="btn btn-primary" style={{ flex: 1 }}>Add Player</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Team;
