import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-logo">⚽ Maidaan<span>.</span></div>
            <p>Your Game. Your Maidaan. Premium sports turf discovery and booking platform.</p>
          </div>
          <div>
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li><Link to="/turfs">Sports Turfs</Link></li>
              <li><Link to="/players">Player Directory</Link></li>
              <li><Link to="/team">My Team</Link></li>
              <li><Link to="/tournaments">Tournaments</Link></li>
              <li><Link to="/auction">Player Auction</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Support</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Locations</h4>
            <ul className="footer-links">
              <li><Link to="/turfs?location=Mapusa">Mapusa</Link></li>
              <li><Link to="/turfs?location=Panjim">Panjim</Link></li>
              <li><Link to="/turfs?location=Porvorim">Porvorim</Link></li>
              <li><Link to="/turfs?location=Calangute">Calangute</Link></li>
              <li><Link to="/turfs?location=Margao">Margao</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Maidaan. All rights reserved. Built for sports lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
