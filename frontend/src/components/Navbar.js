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
          <svg width="40" height="40" viewBox="0 0 225 235" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="225" height="235" fill="#2BBF59"/>
            <text x="112" y="170" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="bold" fill="white" textAnchor="middle">HITAM</text>
          </svg>
        </div>
      </div>
      
      <div className="navbar-center">
        <h1 className="navbar-title">HITAM Water Quality Monitoring</h1>
      </div>
    </nav>
  );
};

export default Navbar;