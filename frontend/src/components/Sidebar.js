import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <nav className="sidebar-nav">
          <button
            className={`sidebar-btn ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => handleNavigation('/')}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            Home
          </button>
          
          <button
            className={`sidebar-btn ${location.pathname === '/prediction' ? 'active' : ''}`}
            onClick={() => handleNavigation('/prediction')}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            Prediction
          </button>
          
          <button
            className={`sidebar-btn ${location.pathname === '/node-creation' ? 'active' : ''}`}
            onClick={() => handleNavigation('/node-creation')}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
            </svg>
            Node Creation
          </button>

          <button
            className={`sidebar-btn ${location.pathname === '/model-comparison' ? 'active' : ''}`}
            onClick={() => handleNavigation('/model-comparison')}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <line x1="3" y1="3" x2="21" y2="3" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
              <line x1="3" y1="21" x2="21" y2="21" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
            Model Comparison
          </button>

          <button
            className={`sidebar-btn ${location.pathname === '/analytics' ? 'active' : ''}`}
            onClick={() => handleNavigation('/analytics')}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            Analytics
          </button>

          <button
            className={`sidebar-btn ${location.pathname === '/csv-upload' ? 'active' : ''}`}
            onClick={() => handleNavigation('/csv-upload')}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M12 2v16M2 12h16M7 9l5-5 5 5" />
            </svg>
            CSV Upload
          </button>

          <button
            className={`sidebar-btn ${location.pathname === '/realtime-prediction' ? 'active' : ''}`}
            onClick={() => handleNavigation('/realtime-prediction')}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="5" r="2" />
              <circle cx="5" cy="19" r="2" />
              <path d="M12 14v4m-2-2h4m0-6v-2m2 2h-2" />
            </svg>
            Real-Time Stream
          </button>

          <button
            className={`sidebar-btn ${location.pathname === '/alert-preferences' ? 'active' : ''}`}
            onClick={() => handleNavigation('/alert-preferences')}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            Manage Alerts
          </button>

          <button
            className={`sidebar-btn ${location.pathname === '/alert-history' ? 'active' : ''}`}
            onClick={() => handleNavigation('/alert-history')}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Alert History
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;