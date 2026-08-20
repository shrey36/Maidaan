import React, { useState } from 'react';

const Auction = () => {
  const [currentBid, setCurrentBid] = useState(2500);
  const [highestBidder, setHighestBidder] = useState('Maidaan Warriors');
  const [spent, setSpent] = useState(6500);
  const totalBudget = 10000;

  const [bidsFeed, setBidsFeed] = useState([
    { team: 'Maidaan Warriors', amount: 2500, time: 'Just now' },
    { team: 'FC Goa Amateurs', amount: 2250, time: '1 min ago' },
    { team: 'Mapusa United', amount: 2000, time: '2 mins ago' }
  ]);

  const handleRaiseBid = () => {
    const increment = 250;
    if (spent + increment > totalBudget) {
      alert('Auction Budget Exceeded!');
      return;
    }

    const newBid = currentBid + increment;
    setCurrentBid(newBid);
    setHighestBidder('Maidaan Warriors (You)');
    setSpent(prev => prev + increment);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setBidsFeed(prev => [{ team: 'Maidaan Warriors (You)', amount: newBid, time: now }, ...prev]);
  };

  const remaining = totalBudget - spent;
  const progressPercent = Math.min(100, (spent / totalBudget) * 100);

  return (
    <main className="section">
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <h1 className="section-title">Player Auction Arena</h1>
            <span className="badge badge-gold">Early Access Simulation</span>
          </div>
          <p className="section-subtitle" style={{ margin: 0 }}>Build your team. Bid for star players. Own the game.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Stage */}
          <div className="glass-panel" style={{ padding: '2.5rem', position: 'relative', borderColor: 'var(--primary)' }}>
            <span className="badge badge-primary" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>🔴 LIVE AUCTION</span>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" alt="Rahul Patil" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
              <div>
                <span className="badge badge-secondary" style={{ marginBottom: '0.4rem' }}>LOT #104</span>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>Rahul Patil</h2>
                <p style={{ color: 'var(--primary)', fontWeight: 600 }}>Football • Forward / Winger</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Base Price: ₹2,000 | 28 Matches | 19 Goals</p>
              </div>
            </div>

            {/* Dashboard */}
            <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CURRENT HIGHEST BID</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{currentBid.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>HIGHEST BIDDER</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.4rem' }}>{highestBidder}</div>
              </div>
            </div>

            <button onClick={handleRaiseBid} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>⚡ Raise Bid (+₹250)</button>
          </div>

          {/* Right */}
          <div>
            <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Team Budget Tracker</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Purse:</span>
                <strong>₹10,000</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Spent:</span>
                <strong style={{ color: 'var(--danger)' }}>₹{spent.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Remaining Purse:</span>
                <strong style={{ color: 'var(--primary)' }}>₹{remaining.toLocaleString()}</strong>
              </div>

              <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Live Bid Stream</h4>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {bidsFeed.map((b, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                    <div><strong>{b.team}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{b.time}</span></div>
                    <div style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{b.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auction;
