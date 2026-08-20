import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredSport, setPreferredSport] = useState('Football');
  const [location, setLocation] = useState('Mapusa, Goa');

  const [totalBookings, setTotalBookings] = useState(0);
  const [upcomingBookings, setUpcomingBookings] = useState(0);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || user.name || '');
      setPhone(user.phone || '');
      setPreferredSport(user.preferredSport || 'Football');
      setLocation(user.location || 'Mapusa, Goa');
    }
    loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      const bookings = await fetchApi('/bookings/my');
      setTotalBookings(bookings.length);
      const upcoming = bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.bookingDate || b.date) >= new Date().setHours(0,0,0,0)).length;
      setUpcomingBookings(upcoming);
    } catch (err) {
      console.error('Failed to load profile stats:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const updated = await fetchApi('/users/me', {
        method: 'PUT',
        body: JSON.stringify({ fullName, phone, preferredSport, location })
      });

      updateUser(updated);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h1 className="section-title">User Profile</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>Manage your account details and sports preferences.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Left: Summary */}
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '90px', height: '90px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1rem', border: '2px solid var(--primary)' }}>
              👤
            </div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{user?.fullName || user?.name || 'User'}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{user?.email}</p>
            <span className="badge badge-primary">{user?.role === 'ADMIN' ? 'Admin' : 'Player / User'}</span>

            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1.5rem', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-around' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{totalBookings}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL BOOKINGS</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-gold)' }}>{upcomingBookings}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UPCOMING</div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Edit Personal Details</h3>

            {message && (
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                ✓ {message}
              </div>
            )}

            {error && (
              <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  className="form-control" 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="form-control" 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Sport</label>
                <select value={preferredSport} onChange={(e) => setPreferredSport(e.target.value)} className="form-control">
                  <option value="Football">Football</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Futsal">Futsal</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Basketball">Basketball</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location / City</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  className="form-control" 
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Profile Updates</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
