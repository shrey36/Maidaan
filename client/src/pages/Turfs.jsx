import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchApi } from '../services/api';
import TurfCard from '../components/TurfCard';

const Turfs = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const initialSport = searchParams.get('sport') || '';
  const initialLocation = searchParams.get('location') || '';

  const [query, setQuery] = useState(initialQuery);
  const [sport, setSport] = useState(initialSport);
  const [location, setLocation] = useState(initialLocation);
  const [maxPrice, setMaxPrice] = useState(2000);

  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTurfs();
  }, [query, sport, location, maxPrice]);

  const loadTurfs = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (sport) params.append('sport', sport);
      if (location) params.append('location', location);
      if (maxPrice < 2000) params.append('maxPrice', maxPrice);

      const data = await fetchApi(`/turfs?${params.toString()}`);
      setTurfs(data);
    } catch (err) {
      setError(err.message || 'Failed to load turfs');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setSport('');
    setLocation('');
    setMaxPrice(2000);
  };

  return (
    <main className="section">
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h1 className="section-title">Discover Nearby Turfs</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>Check real-time availability and book your game slot instantly.</p>
        </div>

        {/* Filters Bar */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr', gap: '1rem', alignItems: 'end' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Search Turf Name or Area</label>
              <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                className="form-control" 
                placeholder="Search turfs, locations or sports..." 
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Sport</label>
              <select value={sport} onChange={(e) => setSport(e.target.value)} className="form-control">
                <option value="">All Sports</option>
                <option value="Football">Football</option>
                <option value="Cricket">Cricket</option>
                <option value="Futsal">Futsal</option>
                <option value="Badminton">Badminton</option>
                <option value="Basketball">Basketball</option>
                <option value="Volleyball">Volleyball</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Location</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="form-control">
                <option value="">All Locations</option>
                <option value="Mapusa">Mapusa</option>
                <option value="Porvorim">Porvorim</option>
                <option value="Panjim">Panjim</option>
                <option value="Calangute">Calangute</option>
                <option value="Candolim">Candolim</option>
                <option value="Vasco">Vasco</option>
                <option value="Margao">Margao</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">Max Price / Hr</label>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="400" 
                max="2000" 
                step="100" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }} 
              />
            </div>
          </div>
        </div>

        {/* Turf Grid Container */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Finding turfs near you...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--danger)' }}>
            {error}
          </div>
        ) : turfs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }} className="glass-panel">
            <h3 style={{ marginBottom: '0.5rem' }}>No turfs found matching your filters</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try adjusting your location, sport, or price range filter.</p>
            <button onClick={handleReset} className="btn btn-outline btn-sm">Reset Filters</button>
          </div>
        ) : (
          <div className="turf-grid">
            {turfs.map(turf => (
              <TurfCard key={turf.id || turf._id} turf={turf} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Turfs;
