import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import config from '../config';
import '../styles/AlertPreferences.css';

export default function AlertPreferences() {
  const { user, token } = useAuth();
  const { isDark } = useTheme();
  const [preferences, setPreferences] = useState({
    email_alerts_enabled: true,
    high_water_alert: true,
    low_water_alert: true,
    temperature_alert: false,
    temperature_threshold: 30.0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Fetch current preferences
  useEffect(() => {
    fetchPreferences();
  }, [token]);

  const fetchPreferences = async () => {
    try {
      if (!token) {
        setMessage('Please log in to manage alert preferences');
        setMessageType('error');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(
        `${config.API_BASE_URL}/api/v1/alerts/preferences`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setPreferences(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setLoading(false);
      // Use default preferences if API fails
      setMessage('Using default alert preferences (API unavailable)');
      setMessageType('warning');
    }
  };

  const handleCheckboxChange = (field) => {
    setPreferences({
      ...preferences,
      [field]: !preferences[field]
    });
  };

  const handleThresholdChange = (e) => {
    const value = parseFloat(e.target.value);
    setPreferences({
      ...preferences,
      temperature_threshold: isNaN(value) ? 30.0 : value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/v1/alerts/preferences`,
        preferences,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setMessage('Alert preferences saved successfully!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage('Failed to save preferences. Please try again.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleTestAlert = async () => {
    try {
      await axios.post(
        `${config.API_BASE_URL}/api/v1/alerts/test`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setMessage('Test alert sent to your email!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error sending test alert:', error);
      setMessage('Failed to send test alert');
      setMessageType('error');
    }
  };

  if (loading) {
    return (
      <div className={`alert-preferences ${isDark ? 'dark' : ''}`}>
        <div className="loading-spinner">Loading preferences...</div>
      </div>
    );
  }

  return (
    <div className={`alert-preferences ${isDark ? 'dark' : ''}`}>
      <div className="alerts-container">
        <h1>Email Alert Preferences</h1>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="preferences-section">
          <div className="section-title">Alert Settings</div>

          <div className="preference-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={preferences.email_alerts_enabled}
                onChange={() => handleCheckboxChange('email_alerts_enabled')}
              />
              <span className="checkbox-label">Enable Email Alerts</span>
              <span className="checkbox-description">
                Receive email notifications when anomalies are detected
              </span>
            </label>
          </div>

          <div className="preference-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={preferences.high_water_alert}
                onChange={() => handleCheckboxChange('high_water_alert')}
                disabled={!preferences.email_alerts_enabled}
              />
              <span className="checkbox-label">High Water Level Alert</span>
              <span className="checkbox-description">
                Alert when water distance is less than 30 cm
              </span>
            </label>
          </div>

          <div className="preference-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={preferences.low_water_alert}
                onChange={() => handleCheckboxChange('low_water_alert')}
                disabled={!preferences.email_alerts_enabled}
              />
              <span className="checkbox-label">Low Water Level Alert</span>
              <span className="checkbox-description">
                Alert when water distance is greater than 90 cm
              </span>
            </label>
          </div>

          <div className="preference-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={preferences.temperature_alert}
                onChange={() => handleCheckboxChange('temperature_alert')}
                disabled={!preferences.email_alerts_enabled}
              />
              <span className="checkbox-label">Temperature Alert</span>
              <span className="checkbox-description">
                Alert when temperature exceeds threshold
              </span>
            </label>

            {preferences.temperature_alert && (
              <div className="threshold-input">
                <label htmlFor="temp-threshold">Temperature Threshold (°C):</label>
                <input
                  id="temp-threshold"
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={preferences.temperature_threshold}
                  onChange={handleThresholdChange}
                />
              </div>
            )}
          </div>
        </div>

        <div className="button-group">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
          <button
            className="btn-secondary"
            onClick={handleTestAlert}
          >
            Send Test Alert
          </button>
        </div>

        <div className="alert-info">
          <h3>How Alerts Work</h3>
          <ul>
            <li><strong>High Water Level Alert:</strong> Triggered when sensor distance drops below 30 cm, indicating rising water</li>
            <li><strong>Low Water Level Alert:</strong> Triggered when sensor distance exceeds 90 cm, indicating dropping water level</li>
            <li><strong>Temperature Alert:</strong> Triggered when temperature exceeds your specified threshold</li>
            <li>Alerts are saved to your alert history and can be reviewed anytime</li>
            <li>Test alert sends a sample email to verify your email configuration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
