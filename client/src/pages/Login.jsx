import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email.trim(), password);
      if (data.role === 'ADMIN') {
        navigate(from && from.startsWith('/admin') ? from : '/admin');
      } else {
        navigate(from || '/turfs');
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network') || msg.toLowerCase().includes('failed to fetch')) {
        setError('Unable to connect to Maidaan. Please check your connection.');
      } else if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('password') || msg.toLowerCase().includes('credentials')) {
        setError('Invalid email or password.');
      } else if (msg) {
        setError(msg);
      } else {
        setError('Unable to sign in right now. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to your Maidaan account</p>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '0.5rem' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '0.75rem' }} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1.5rem' }}>
          Don't have an account? <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
