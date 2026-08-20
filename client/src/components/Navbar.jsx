import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav class="navbar">
      <div class="container nav-container">
        <Link to="/" class="brand-logo">
          ⚽ Maidaan<span>.</span>
        </Link>
        
        <ul className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <li><Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link></li>
          <li><Link to="/turfs" className={`nav-link ${isActive('/turfs') || location.pathname.startsWith('/turfs/') ? 'active' : ''}`}>Find Turf</Link></li>
          <li><Link to="/players" className={`nav-link ${isActive('/players') ? 'active' : ''}`}>Players</Link></li>
          {isLoggedIn && <li><Link to="/team" className={`nav-link ${isActive('/team') ? 'active' : ''}`}>My Team</Link></li>}
          <li><Link to="/tournaments" className={`nav-link ${isActive('/tournaments') ? 'active' : ''}`}>Tournaments</Link></li>
          <li><Link to="/auction" className={`nav-link ${isActive('/auction') ? 'active' : ''}`}>Auctions</Link></li>
          {isLoggedIn && <li><Link to="/bookings" className={`nav-link ${isActive('/bookings') ? 'active' : ''}`}>My Bookings</Link></li>}
          {isAdmin && <li><Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>Admin Panel</Link></li>}
        </ul>

        <div class="nav-actions">
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="btn btn-secondary btn-sm">
                <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', marginRight: '4px' }}></span>
                {(user.fullName || user.name || 'User').split(' ')[0]}
              </Link>
              <button onClick={logout} className="btn btn-outline btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}

          <button 
            className="mobile-toggle" 
            onClick={() => setMobileOpen(!mobileOpen)} 
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
