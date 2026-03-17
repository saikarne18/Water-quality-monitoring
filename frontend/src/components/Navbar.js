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
          <img src="/image.png" alt="College Logo" className="logo-img" />
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