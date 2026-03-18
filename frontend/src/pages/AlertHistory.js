import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import config from '../config';
import '../styles/AlertHistory.css';

export default function AlertHistory() {
  const { user, token } = useAuth();
  const { isDark } = useTheme();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch alert history
  useEffect(() => {
    fetchAlertHistory();
  }, [token]);

  // Filter alerts when type changes
  useEffect(() => {
    if (filterType === 'all') {
      setFilteredAlerts(alerts);
    } else {
      setFilteredAlerts(alerts.filter(a => a.alert_type === filterType));
    }
    setPage(1);
  }, [alerts, filterType]);

  const fetchAlertHistory = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await axios.get(
        `${config.API_BASE_URL}/api/v1/alerts/history?limit=100`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Handle response - might be array or object with alerts property
      const alertsData = Array.isArray(response.data) ? response.data : response.data.alerts || [];
      setAlerts(alertsData);
      setFilteredAlerts(alertsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching alert history:', error);
      // Set empty array on error but don't mark as error to avoid disrupting UI
      setAlerts([]);
      setFilteredAlerts([]);
      setLoading(false);
    }
  };

  const getAlertIcon = (alertType) => {
    if (alertType.includes('High Water')) return '🌊';
    if (alertType.includes('Low Water')) return '💧';
    if (alertType.includes('Temperature')) return '🌡️';
    if (alertType.includes('Test')) return '🧪';
    return '⚠️';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getAlertColor = (alertType) => {
    if (alertType.includes('High Water')) return 'high-water';
    if (alertType.includes('Low Water')) return 'low-water';
    if (alertType.includes('Temperature')) return 'temperature';
    if (alertType.includes('Test')) return 'test';
    return 'default';
  };

  // Pagination
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAlerts = filteredAlerts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);

  const handlePrevious = () => {
    setPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setPage(prev => Math.min(totalPages, prev + 1));
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchAlertHistory();
  };

  if (loading) {
    return (
      <div className={`alert-history ${isDark ? 'dark' : ''}`}>
        <div className="loading-spinner">Loading alert history...</div>
      </div>
    );
  }

  return (
    <div className={`alert-history ${isDark ? 'dark' : ''}`}>
      <div className="history-container">
        <div className="history-header">
          <h1>Alert History</h1>
          <p className="subtitle">View and manage your past alerts</p>
        </div>

        {alerts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h2>No Alerts Yet</h2>
            <p>When anomalies are detected and alerts are triggered, they will appear here.</p>
            <p>Go to <strong>Alert Preferences</strong> to configure your alert settings.</p>
          </div>
        ) : (
          <>
            {/* Filter and Controls */}
            <div className="controls-section">
              <div className="filter-group">
                <label htmlFor="alert-filter">Filter by Type:</label>
                <select
                  id="alert-filter"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Alerts ({alerts.length})</option>
                  <option value="High Water Level Alert">
                    High Water ({alerts.filter(a => a.alert_type === 'High Water Level Alert').length})
                  </option>
                  <option value="Low Water Level Alert">
                    Low Water ({alerts.filter(a => a.alert_type === 'Low Water Level Alert').length})
                  </option>
                  <option value="High Temperature Alert">
                    High Temperature ({alerts.filter(a => a.alert_type === 'High Temperature Alert').length})
                  </option>
                  <option value="Test Alert">
                    Test ({alerts.filter(a => a.alert_type === 'Test Alert').length})
                  </option>
                </select>
              </div>

              <button className="btn-refresh" onClick={handleRefresh}>
                🔄 Refresh
              </button>
            </div>

            {/* Statistics */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <div className="stat-label">Total Alerts</div>
                  <div className="stat-value">{alerts.length}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🌊</div>
                <div className="stat-info">
                  <div className="stat-label">High Water Level</div>
                  <div className="stat-value">
                    {alerts.filter(a => a.alert_type === 'High Water Level Alert').length}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💧</div>
                <div className="stat-info">
                  <div className="stat-label">Low Water Level</div>
                  <div className="stat-value">
                    {alerts.filter(a => a.alert_type === 'Low Water Level Alert').length}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🌡️</div>
                <div className="stat-info">
                  <div className="stat-label">Temperature Alerts</div>
                  <div className="stat-value">
                    {alerts.filter(a => a.alert_type.includes('Temperature')).length}
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts Table */}
            <div className="alerts-table-wrapper">
              <table className="alerts-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Timestamp</th>
                    <th>Distance (cm)</th>
                    <th>Temperature (°C)</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAlerts.map((alert) => (
                    <tr key={alert.id} className={`alert-row ${getAlertColor(alert.alert_type)}`}>
                      <td className="alert-type-cell">
                        <span className="alert-icon">{getAlertIcon(alert.alert_type)}</span>
                        <span className="alert-type-text">{alert.alert_type}</span>
                      </td>
                      <td className="timestamp-cell">
                        {formatDate(alert.sent_at)}
                      </td>
                      <td className="distance-cell">
                        <span className={`value-badge ${alert.distance < 30 ? 'critical' : alert.distance > 90 ? 'warning' : 'normal'}`}>
                          {alert.distance}
                        </span>
                      </td>
                      <td className="temperature-cell">
                        <span className={`value-badge ${alert.temperature > 30 ? 'critical' : 'normal'}`}>
                          {alert.temperature}
                        </span>
                      </td>
                      <td className="message-cell">{alert.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={handlePrevious}
                  disabled={page === 1}
                >
                  ← Previous
                </button>

                <div className="pagination-info">
                  Page {page} of {totalPages}
                  {filteredAlerts.length > 0 && (
                    <span> (showing {startIndex + 1}-{Math.min(endIndex, filteredAlerts.length)} of {filteredAlerts.length})</span>
                  )}
                </div>

                <button
                  className="pagination-btn"
                  onClick={handleNext}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* Info Section */}
        <div className="info-section">
          <h3>Understanding Your Alerts</h3>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">🌊</div>
              <h4>High Water Level</h4>
              <p>Triggered when water distance drops below 30 cm, indicating rising water levels.</p>
            </div>

            <div className="info-card">
              <div className="info-icon">💧</div>
              <h4>Low Water Level</h4>
              <p>Triggered when water distance exceeds 90 cm, indicating falling water levels.</p>
            </div>

            <div className="info-card">
              <div className="info-icon">🌡️</div>
              <h4>Temperature Alert</h4>
              <p>Triggered when temperature exceeds your configured threshold value.</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📊</div>
              <h4>Data Insights</h4>
              <p>Use this historical data to understand patterns and optimize your alert settings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
