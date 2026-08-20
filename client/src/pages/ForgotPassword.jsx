import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setDevResetUrl('');
    setLoading(true);

    try {
      const data = await fetchApi('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() })
      });
      setMessage(data.message || 'If an account with that email exists, a password reset link has been sent.');
      if (data.resetUrl) {
        setDevResetUrl(data.resetUrl);
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
        setError('Unable to connect to Maidaan. Please check your connection.');
      } else {
        setError(msg || 'Unable to process request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Forgot Password</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#16a34a', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {message}
          </div>
        )}

        {devResetUrl && (
          <div style={{ background: 'var(--bg-surface)', border: '1px dashed var(--primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.35rem', color: 'var(--primary)' }}>[DEV ONLY] Reset link:</div>
            <a href={devResetUrl} style={{ wordBreak: 'break-all', color: 'var(--primary)' }}>{devResetUrl}</a>
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

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1.25rem' }} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1.5rem' }}>
          <Link to="/login">Back to Sign In</Link>
        </p>
      </div>
    </main>
  );
};

export default ForgotPassword;
