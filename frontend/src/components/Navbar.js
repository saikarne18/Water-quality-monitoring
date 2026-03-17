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
          <img src="/image.png" alt="HITAM Logo" className="logo-img" />
        </div>
      </div>
      
      <div className="navbar-center">
        <h1 className="navbar-title">HITAM Water Quality Monitoring</h1>
      </div>
    </nav>
  );
};

export default Navbar;