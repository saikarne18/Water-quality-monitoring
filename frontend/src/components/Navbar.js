import React from 'react';

const Navbar = ({ onToggleSidebar }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="hamburger-btn" onClick={onToggleSidebar}>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>
        
        <div className="logo">
          <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
            <defs>
              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#FF6B9D', stopOpacity: 1}} />
                <stop offset="33%" style={{stopColor: '#00D4FF', stopOpacity: 1}} />
                <stop offset="66%" style={{stopColor: '#1DB584', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#FFA500', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#waterGrad)" opacity="0.15" />
            <circle cx="30" cy="25" r="6" fill="#FF6B9D" />
            <circle cx="50" cy="15" r="7" fill="#00D4FF" />
            <circle cx="70" cy="25" r="6" fill="#1DB584" />
            <path d="M 20 40 Q 28 32 36 40 T 52 40 T 68 40 T 84 40" stroke="#FFA500" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 18 55 Q 26 47 34 55 T 50 55 T 66 55 T 82 55" stroke="#00D4FF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 25 65 L 25 82 Q 25 88 31 88 L 69 88 Q 75 88 75 82 L 75 65" fill="none" stroke="#1DB584" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 28 75 Q 32 70 36 75 T 44 75 T 52 75 T 60 75 T 68 75 L 68 82 Q 68 85 65 85 L 35 85 Q 32 85 32 82 L 32 75" fill="#00D4FF" opacity="0.6" />
            <circle cx="40" cy="35" r="3" fill="white" opacity="0.8" />
          </svg>
        </div>
      </div>
      <div className="navbar-center">
        <h1 className="navbar-title">WATER QUALITY MONITORING</h1>
        <p className="navbar-subtitle">Real-Time Analysis & Tracking System</p>
      </div>
      <div className="navbar-right">
        <div className="status-badge">
          <span className="status-dot"></span>
          <span className="status-text">LIVE</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;