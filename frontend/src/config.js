// src/config.js
// Central config for API URLs and other constants

// Determine environment and use correct API URL
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment 
  ? (process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000")
  : "https://water-quality-monitoring-9qmp.onrender.com";

const config = {
  API_BASE_URL,
  SENSOR_DATA_URL: `${API_BASE_URL}/sensor-data`,
  TANK_PARAMETERS_URL: `${API_BASE_URL}/tank-parameters`,
};

export default config;
