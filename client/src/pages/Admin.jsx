import React, { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('turfs');

  const [turfs, setTurfs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Turf Form State
  const [newTurfName, setNewTurfName] = useState('');
  const [newTurfLocation, setNewTurfLocation] = useState('');
  const [newTurfAddress, setNewTurfAddress] = useState('');
  const [newTurfSports, setNewTurfSports] = useState('Football, Cricket, Futsal');
  const [newTurfPrice, setNewTurfPrice] = useState(800);
  const [newTurfImage, setNewTurfImage] = useState('');
  const [newTurfDesc, setNewTurfDesc] = useState('');

  useEffect(() => {
    if (activeTab === 'turfs') loadTurfs();
    if (activeTab === 'bookings') loadBookings();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'tournaments') loadTournaments();
  }, [activeTab]);

  const loadTurfs = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/turfs');
      setTurfs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/admin/bookings');
      setBookings(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/admin/users');
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTournaments = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/tournaments');
      setTournaments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTurf = async (id) => {
    if (!window.confirm('Are you sure you want to delete this turf?')) return;
    try {
      await fetchApi(`/admin/turfs/${id}`, { method: 'DELETE' });
      loadTurfs();
    } catch (err) {
      alert(err.message || 'Failed to delete turf');
    }
  };

  const handleAddTurf = async (e) => {
    e.preventDefault();
    try {
      await fetchApi('/admin/turfs', {
        method: 'POST',
        body: JSON.stringify({
          name: newTurfName,
          location: newTurfLocation,
          address: newTurfAddress,
          sports: newTurfSports,
          pricePerHour: Number(newTurfPrice),
          rating: 4.8,
          imageUrl: newTurfImage || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80',
          description: newTurfDesc,
          facilities: 'Parking, Washroom, Floodlights, Changing Room',
          rules: 'Standard sports shoes required.',
          contactPhone: '+91 98221 00000',
          availableToday: true,
          turfType: 'Outdoor'
        })
      });

      setShowAddModal(false);
      loadTurfs();
    } catch (err) {
      alert(err.message || 'Failed to add turf');
    }
  };

  return (
    <main className="section">
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>Manage turfs, view user bookings, monitor users and tournament registrations.</p>
        </div>

        {/* Admin Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          <button onClick={() => setActiveTab('turfs')} className={`btn ${activeTab === 'turfs' ? 'btn-primary' : 'btn-secondary'}`}>Turf Management</button>
          <button onClick={() => setActiveTab('bookings')} className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}>Booking Management</button>
          <button onClick={() => setActiveTab('users')} className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}>User Directory</button>
          <button onClick={() => setActiveTab('tournaments')} className={`btn ${activeTab === 'tournaments' ? 'btn-primary' : 'btn-secondary'}`}>Tournaments</button>
        </div>

        {/* Tab 1: Turfs */}
        {activeTab === 'turfs' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>System Sports Turfs ({turfs.length})</h3>
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">+ Add New Turf</button>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading turfs...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>ID</th>
                      <th style={{ padding: '0.75rem' }}>Name</th>
                      <th style={{ padding: '0.75rem' }}>Location</th>
                      <th style={{ padding: '0.75rem' }}>Sports</th>
                      <th style={{ padding: '0.75rem' }}>Price/Hr</th>
                      <th style={{ padding: '0.75rem' }}>Rating</th>
                      <th style={{ padding: '0.75rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {turfs.map(t => (
                      <tr key={t.id || t._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem' }}>#{String(t.id || t._id).substring(0, 6)}</td>
                        <td style={{ padding: '0.75rem', fontWeight: 600 }}>{t.name}</td>
                        <td style={{ padding: '0.75rem' }}>{t.location}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--primary)' }}>{Array.isArray(t.sports) ? t.sports.join(', ') : t.sports}</td>
                        <td style={{ padding: '0.75rem', fontWeight: 600 }}>₹{t.pricePerHour}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--accent-gold)' }}>★ {t.rating || '4.5'}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <button onClick={() => handleDeleteTurf(t.id || t._id)} className="btn btn-danger btn-sm">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Bookings */}
        {activeTab === 'bookings' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>All System Bookings ({bookings.length})</h3>
            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading bookings...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>Booking Code</th>
                      <th style={{ padding: '0.75rem' }}>User</th>
                      <th style={{ padding: '0.75rem' }}>Turf</th>
                      <th style={{ padding: '0.75rem' }}>Date & Time</th>
                      <th style={{ padding: '0.75rem' }}>Amount</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id || b._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)' }}>{b.bookingCode || b.bookingId}</td>
                        <td style={{ padding: '0.75rem' }}>{b.user?.fullName || b.user?.name || 'User'} ({b.user?.email})</td>
                        <td style={{ padding: '0.75rem' }}>{b.turf?.name || 'Turf'}</td>
                        <td style={{ padding: '0.75rem' }}>{b.bookingDate || b.date} • {b.startTime}</td>
                        <td style={{ padding: '0.75rem', fontWeight: 600 }}>₹{b.amount}</td>
                        <td style={{ padding: '0.75rem' }}><span className={`badge ${b.status === 'CONFIRMED' ? 'badge-status-confirmed' : 'badge-status-cancelled'}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Users */}
        {activeTab === 'users' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>System Users Directory ({users.length})</h3>
            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading users...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>ID</th>
                      <th style={{ padding: '0.75rem' }}>Name</th>
                      <th style={{ padding: '0.75rem' }}>Email</th>
                      <th style={{ padding: '0.75rem' }}>Phone</th>
                      <th style={{ padding: '0.75rem' }}>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id || u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem' }}>#{String(u.id || u._id).substring(0, 6)}</td>
                        <td style={{ padding: '0.75rem', fontWeight: 600 }}>{u.fullName || u.name}</td>
                        <td style={{ padding: '0.75rem' }}>{u.email}</td>
                        <td style={{ padding: '0.75rem' }}>{u.phone || 'N/A'}</td>
                        <td style={{ padding: '0.75rem' }}><span className={`badge ${u.role === 'ADMIN' ? 'badge-gold' : 'badge-primary'}`}>{u.role}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Tournaments */}
        {activeTab === 'tournaments' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Tournaments Overview ({tournaments.length})</h3>
            <p style={{ color: 'var(--text-muted)' }}>Admin tournament creation ready.</p>
          </div>
        )}
      </div>

      {/* Add Turf Modal */}
      {showAddModal && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Add New Sports Turf</h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>

            <form onSubmit={handleAddTurf}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Turf Name</label>
                  <input type="text" value={newTurfName} onChange={(e) => setNewTurfName(e.target.value)} className="form-control" placeholder="e.g. Panjim Arena" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Location / City</label>
                  <input type="text" value={newTurfLocation} onChange={(e) => setNewTurfLocation(e.target.value)} className="form-control" placeholder="e.g. Panjim, Goa" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Address</label>
                <input type="text" value={newTurfAddress} onChange={(e) => setNewTurfAddress(e.target.value)} className="form-control" placeholder="Street address..." required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Sports (Comma Separated)</label>
                  <input type="text" value={newTurfSports} onChange={(e) => setNewTurfSports(e.target.value)} className="form-control" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Price / Hour (₹)</label>
                  <input type="number" value={newTurfPrice} onChange={(e) => setNewTurfPrice(e.target.value)} className="form-control" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="url" value={newTurfImage} onChange={(e) => setNewTurfImage(e.target.value)} className="form-control" placeholder="https://images.unsplash.com/..." />
              </div>

              <div className="form-group">
                <label className="form-label">Turf Description</label>
                <textarea value={newTurfDesc} onChange={(e) => setNewTurfDesc(e.target.value)} className="form-control" rows="3" required></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Turf</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Admin;
