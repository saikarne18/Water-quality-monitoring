import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark Mode">
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
        <div className="navbar-user">
          <span className="user-name">{user?.username}</span>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            🚪 Logout
          </button>
        </div>
        <div className="status-badge">
          <span className="status-dot"></span>
          <span className="status-text">LIVE</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;