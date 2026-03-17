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
          <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
            {/* Outer glow background */}
            <circle cx="50" cy="50" r="48" fill="#FF6B9D" opacity="0.12" />
            {/* Water droplet 1 - Pink */}
            <circle cx="28" cy="28" r="8" fill="#FF6B9D" />
            {/* Water droplet 2 - Cyan */}
            <circle cx="50" cy="18" r="9" fill="#00D4FF" />
            {/* Water droplet 3 - Green */}
            <circle cx="72" cy="28" r="8" fill="#1DB584" />
            {/* Wave 1 - Orange */}
            <path d="M 18 45 Q 25 38 32 45 T 50 45 T 68 45 T 85 45" stroke="#FFA500" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Wave 2 - Cyan */}
            <path d="M 15 58 Q 23 50 31 58 T 50 58 T 68 58 T 86 58" stroke="#00D4FF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Water container */}
            <rect x="24" y="68" width="52" height="20" rx="3" fill="#1DB584" opacity="0.9" />
            {/* Water fill inside container */}
            <rect x="26" y="74" width="48" height="12" rx="2" fill="#00D4FF" opacity="0.8" />
            {/* Shine effect */}
            <circle cx="42" cy="72" r="4" fill="white" opacity="0.7" />
            {/* Center diamond accent */}
            <path d="M 50 50 L 54 54 L 50 58 L 46 54 Z" fill="#FF6B9D" opacity="0.8" />
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