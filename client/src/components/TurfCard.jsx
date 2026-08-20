import React from 'react';
import { Link } from 'react-router-dom';

const TurfCard = ({ turf }) => {
  const sportsStr = Array.isArray(turf.sports) ? turf.sports.join(', ') : turf.sports;

  return (
    <div className="turf-card">
      <div className="turf-card-img-wrapper">
        <img 
          src={turf.imageUrl || turf.images?.[0]} 
          alt={turf.name} 
          className="turf-card-img" 
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80'; }}
        />
        <span className="badge badge-primary turf-card-badge">{turf.turfType || 'Outdoor'}</span>
      </div>
      <div className="turf-card-body">
        <h3 className="turf-title">{turf.name}</h3>
        <div className="turf-location">📍 {turf.location}</div>
        <div className="turf-sports">⚡ {sportsStr}</div>
        
        <div className="turf-card-footer">
          <div className="turf-price">
            ₹{turf.pricePerHour} <span>/ hour</span>
          </div>
          <div className="turf-rating">
            ★ {turf.rating ? turf.rating.toFixed(1) : '4.5'}
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Link to={`/turfs/${turf.id || turf._id}`} className="btn btn-primary btn-block">Book Turf</Link>
        </div>
      </div>
    </div>
  );
};

export default TurfCard;
