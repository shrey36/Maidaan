import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/turfs?query=${encodeURIComponent(query)}`);
    } else {
      navigate('/turfs');
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="section" style={{ padding: '5rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div className="hero-content">
            <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>⚡ #1 Sports Turf Booking Platform</span>
            <h1 style={{ fontSize: '3.5rem', letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
              Find Your <span style={{ color: 'var(--primary)' }}>Maidaan.</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '540px' }}>
              Discover nearby sports turfs, check real-time availability, and book your next game in minutes. Pay conveniently at the venue!
            </p>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearchSubmit} className="glass-panel" style={{ display: 'flex', gap: '0.5rem', maxWidth: '520px', marginBottom: '2rem', padding: '0.5rem' }}>
              <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Search turfs, locations or sports..." 
                className="form-control" 
                style={{ border: 'none', background: 'transparent' }} 
                required 
              />
              <button type="submit" className="btn btn-primary" style={{ whitespace: 'nowrap' }}>Find Turf</button>
            </form>

            <div className="hero-buttons" style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/turfs" className="btn btn-primary">Book a Turf</Link>
              <Link to="/tournaments" className="btn btn-secondary">Explore Tournaments</Link>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="glass-panel" style={{ padding: '0.75rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-glow)' }}>
              <img 
                src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80" 
                alt="Maidaan Arena Turf" 
                style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Sports */}
      <section className="section" style={{ background: 'rgba(21, 29, 42, 0.4)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Sports</h2>
            <p className="section-subtitle">Select your favorite sport to find specialized turfs and arenas near you.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.25rem' }}>
            <Link to="/turfs?sport=Football" className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', textDecoration: 'none' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚽</div>
              <h3 style={{ fontSize: '1.1rem' }}>Football</h3>
            </Link>
            <Link to="/turfs?sport=Cricket" className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', textDecoration: 'none' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏏</div>
              <h3 style={{ fontSize: '1.1rem' }}>Box Cricket</h3>
            </Link>
            <Link to="/turfs?sport=Futsal" className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', textDecoration: 'none' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👟</div>
              <h3 style={{ fontSize: '1.1rem' }}>Futsal</h3>
            </Link>
            <Link to="/turfs?sport=Badminton" className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', textDecoration: 'none' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏸</div>
              <h3 style={{ fontSize: '1.1rem' }}>Badminton</h3>
            </Link>
            <Link to="/turfs?sport=Basketball" className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', textDecoration: 'none' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏀</div>
              <h3 style={{ fontSize: '1.1rem' }}>Basketball</h3>
            </Link>
            <Link to="/turfs?sport=Volleyball" className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', textDecoration: 'none' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏐</div>
              <h3 style={{ fontSize: '1.1rem' }}>Volleyball</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How Maidaan Works</h2>
            <p className="section-subtitle">Book your favorite sports venue in 3 effortless steps.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
            <div className="glass-panel" style={{ padding: '2.5rem 1.5rem' }}>
              <div style={{ width: '50px', height: '50px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.25rem', margin: '0 auto 1.25rem' }}>1</div>
              <h3>Find a Turf</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Browse top rated sports turfs by sport, location, price, and customer reviews.</p>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem 1.5rem' }}>
              <div style={{ width: '50px', height: '50px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.25rem', margin: '0 auto 1.25rem' }}>2</div>
              <h3>Select Date & Slot</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Pick your preferred date and available hour slot with guaranteed real-time validation.</p>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem 1.5rem' }}>
              <div style={{ width: '50px', height: '50px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.25rem', margin: '0 auto 1.25rem' }}>3</div>
              <h3>Confirm & Play</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Get instant booking reference code. Pay directly at venue when you show up to play!</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
