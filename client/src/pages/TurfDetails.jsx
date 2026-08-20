import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TurfDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [turf, setTurf] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loading, setLoading] = useState(true);
  const [slotLoading, setSlotLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    loadTurf();
  }, [id]);

  useEffect(() => {
    if (id && selectedDate) {
      loadSlots(selectedDate);
    }
  }, [id, selectedDate]);

  const loadTurf = async () => {
    setLoading(true);
    try {
      const data = await fetchApi(`/turfs/${id}`);
      setTurf(data);
    } catch (err) {
      setError(err.message || 'Failed to load turf details');
    } finally {
      setLoading(false);
    }
  };

  const loadSlots = async (dateStr) => {
    setSlotLoading(true);
    setSelectedSlot(null);
    try {
      const data = await fetchApi(`/turfs/${id}/availability?date=${dateStr}`);
      setSlots(data || []);
    } catch (err) {
      console.error('Failed to load slots:', err);
    } finally {
      setSlotLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!selectedSlot || !turf) return;

    setBookingError('');

    try {
      const bookingData = {
        turfId: turf.id || turf._id,
        bookingDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      };

      const booking = await fetchApi('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });

      setConfirmedBooking(booking);
    } catch (err) {
      setBookingError(err.message || 'Booking failed');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Loading turf specifications...
      </div>
    );
  }

  if (error || !turf) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--danger)' }}>
        {error || 'Turf not found'}
      </div>
    );
  }

  const sportsStr = Array.isArray(turf.sports) ? turf.sports.join(', ') : turf.sports;
  const facilitiesArr = Array.isArray(turf.facilities) ? turf.facilities : (turf.facilities || '').split(',');

  return (
    <main className="section">
      <div className="container">
        <Link to="/turfs" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>← Back to Turfs</Link>

        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '2rem' }}>
          {/* Left: Info & Slot Selector */}
          <div>
            <div style={{ position: 'relative', height: '360px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '2rem' }}>
              <img 
                src={turf.imageUrl || turf.images?.[0]} 
                alt={turf.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80'; }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,15,25,0.95), transparent)' }}></div>
              <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
                <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>{turf.turfType || 'Outdoor Turf'}</span>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{turf.name}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>📍 {turf.address || turf.location} • ★ {turf.rating || '4.8'} Rating</p>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>About {turf.name}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{turf.description}</p>
              
              <h4 style={{ marginBottom: '0.75rem' }}>Supported Sports</h4>
              <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '1.5rem' }}>⚡ {sportsStr}</p>

              <h4 style={{ marginBottom: '0.75rem' }}>Facilities Available</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {facilitiesArr.map((f, i) => (
                  <span key={i} className="badge badge-secondary" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>✓ {f.trim()}</span>
                ))}
              </div>

              <h4 style={{ marginBottom: '0.75rem' }}>Turf Rules & Guidelines</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{turf.rules || 'Standard sports shoes required. Arrive 10 minutes prior to your slot time.'}</p>
            </div>

            {/* Slot Picker Card */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.25rem' }}>Select Booking Slot</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Green slots are available for instant venue booking.</p>
                </div>

                <div style={{ minWidth: '180px' }}>
                  <label className="form-label" style={{ marginBottom: '0.2rem', fontSize: '0.8rem' }}>Booking Date</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]} 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)} 
                    className="form-control" 
                    style={{ padding: '0.5rem 0.75rem' }} 
                  />
                </div>
              </div>

              {/* Slots Container */}
              {slotLoading ? (
                <p style={{ color: 'var(--text-muted)' }}>Checking slot availability for {selectedDate}...</p>
              ) : slots.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No slots available for selected date.</p>
              ) : (
                <div className="slots-container">
                  {slots.map((slot, index) => {
                    const isSelected = selectedSlot?.startTime === slot.startTime;
                    const statusClass = slot.available ? (isSelected ? 'selected' : '') : 'disabled';

                    return (
                      <button 
                        key={index} 
                        className={`slot-btn ${statusClass}`} 
                        disabled={!slot.available} 
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot.timeSlot}
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{slot.available ? 'Available' : 'Booked'}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking Summary Box */}
          <div>
            <div style={{ position: 'sticky', top: '100px' }}>
              {bookingError && (
                <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  ❌ {bookingError}
                </div>
              )}

              {!selectedSlot ? (
                <div className="glass-panel" style={{ padding: '1.75rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Booking Summary</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Select an available date and time slot to proceed.</p>
                  
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Rate / Hour:</span>
                      <span style={{ fontWeight: 600 }}>₹{turf.pricePerHour}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Payment:</span>
                      <span className="badge badge-gold">Pay at Venue</span>
                    </div>
                  </div>

                  <button className="btn btn-primary btn-block" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Select Slot First</button>
                </div>
              ) : (
                <div className="glass-panel" style={{ padding: '1.75rem', borderColor: 'var(--primary)' }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Booking Summary</h3>
                  
                  <div style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
                    <p style={{ marginBottom: '0.4rem' }}><strong>Turf:</strong> {turf.name}</p>
                    <p style={{ marginBottom: '0.4rem' }}><strong>Date:</strong> {selectedDate}</p>
                    <p style={{ marginBottom: '0.4rem' }}><strong>Time Slot:</strong> {selectedSlot.timeSlot}</p>
                    <p style={{ marginBottom: '0.4rem' }}><strong>Duration:</strong> 1 Hour</p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Amount Due:</span>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>₹{turf.pricePerHour}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Payment Method:</span>
                      <span className="badge badge-gold">Pay at Venue</span>
                    </div>
                  </div>

                  <button onClick={handleConfirmBooking} className="btn btn-primary btn-block">Confirm Booking</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmedBooking && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem' }}>
              ✓
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Your turf slot has been successfully reserved.</p>

            <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>BOOKING REFERENCE:</span>
                <strong style={{ color: 'var(--primary)', fontFamily: 'monospace', fontSize: '1rem' }}>{confirmedBooking.bookingCode || confirmedBooking.bookingId}</strong>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                <p style={{ marginBottom: '0.3rem' }}><strong>{confirmedBooking.turf?.name || turf.name}</strong></p>
                <p style={{ marginBottom: '0.3rem', color: 'var(--text-muted)' }}>📅 Date: <span style={{ color: 'var(--text-main)' }}>{confirmedBooking.bookingDate || confirmedBooking.date}</span></p>
                <p style={{ marginBottom: '0.3rem', color: 'var(--text-muted)' }}>⏰ Time: <span style={{ color: 'var(--text-main)' }}>{confirmedBooking.startTime} - {confirmedBooking.endTime}</span></p>
                <p style={{ color: 'var(--text-muted)' }}>💰 Amount to Pay at Venue: <strong style={{ color: 'var(--primary)' }}>₹{confirmedBooking.amount}</strong></p>
              </div>
            </div>

            <button onClick={() => navigate('/bookings')} className="btn btn-primary btn-block">View My Bookings</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default TurfDetails;
