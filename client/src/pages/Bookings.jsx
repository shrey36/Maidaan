import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../services/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/bookings/my');
      setBookings(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load user bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking slot?')) return;

    try {
      await fetchApi(`/bookings/${id}/cancel`, { method: 'PUT' });
      loadBookings();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    }
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h1 className="section-title">My Bookings Dashboard</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>Manage your upcoming turf reservations and view past match history.</p>
        </div>

        {loading ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Loading your bookings...
          </div>
        ) : error ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', color: 'var(--danger)' }}>
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>No Bookings Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't reserved any turf slots yet.</p>
            <Link to="/turfs" className="btn btn-primary">Find & Book a Turf</Link>
          </div>
        ) : (
          <div>
            {bookings.map(b => {
              const isCancelled = b.status === 'CANCELLED';
              const bookingDateObj = new Date(b.bookingDate || b.date);
              const isPast = bookingDateObj < new Date().setHours(0,0,0,0);

              let statusBadge = <span className="badge badge-status-confirmed">CONFIRMED</span>;
              if (isCancelled) statusBadge = <span className="badge badge-status-cancelled">CANCELLED</span>;
              else if (isPast) statusBadge = <span className="badge badge-secondary">COMPLETED</span>;

              const canCancel = !isCancelled && !isPast;

              return (
                <div key={b.id || b._id} className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>{b.bookingCode || b.bookingId}</span>
                      {statusBadge}
                    </div>

                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>{b.turf?.name || 'Maidaan Turf'}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      📍 {b.turf?.location || 'Goa'} • 📅 <strong>{b.bookingDate || b.date}</strong> • ⏰ <strong>{b.startTime} - {b.endTime}</strong>
                    </p>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Payment: <strong style={{ color: 'var(--accent-gold)' }}>Pay at Venue (₹{b.amount})</strong></p>
                  </div>

                  <div>
                    {canCancel && (
                      <button onClick={() => handleCancelBooking(b.id || b._id)} className="btn btn-danger btn-sm">Cancel Booking</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Bookings;
