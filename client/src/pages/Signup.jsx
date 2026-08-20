import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredSport, setPreferredSport] = useState('Football');
  const [location, setLocation] = useState('Mapusa, Goa');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }
    if (!trimmedEmail) {
      setError('Please enter your email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName: trimmedName,
        email: trimmedEmail,
        phone,
        preferredSport,
        location,
        password
      });

      navigate('/turfs');
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
        setError('Unable to connect to Maidaan. Please check your connection.');
      } else {
        setError(msg || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Join Maidaan ⚽</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Create your player profile and start booking turfs</p>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-control"
              placeholder="Shreyas Naik"
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="shrey@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              placeholder="+91 98221 12345"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              <label className="form-label">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-control"
                placeholder="Mapusa, Goa"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control"
                placeholder="Repeat password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1.5rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1.5rem' }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </main>
  );
};

export default Signup;
