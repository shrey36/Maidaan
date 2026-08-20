import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchApi } from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

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
      const data = await fetchApi(`/auth/reset-password/${token}`, {
        method: 'POST',
        body: JSON.stringify({ password, confirmPassword })
      });
      setMessage(data.message || 'Password reset successfully. You can now sign in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
        setError('Unable to connect to Maidaan. Please check your connection.');
      } else {
        setError(msg || 'Unable to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Reset Password</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Choose a new secure password</p>
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

        {!message && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="At least 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
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

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1.25rem' }} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1.5rem' }}>
          <Link to="/login">Back to Sign In</Link>
        </p>
      </div>
    </main>
  );
};

export default ResetPassword;
