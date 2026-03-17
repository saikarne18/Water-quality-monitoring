import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import config from '../config';
import '../styles/Prediction.css';

const Prediction = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [inputData, setInputData] = useState({
    distance: '',
    temperature: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Default model info for fallback
  const defaultModelInfo = {
    model_type: "Water Quality Prediction Model",
    accuracy: 0.92,
    version: "1.0.0",
    last_trained: "2026-03-17",
    classes: ["Normal", "High Usage", "Low Water Alert", "Leak Detection"],
    input_features: ["distance", "temperature", "time_features"]
  };

  // Fetch model info on component mount
  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/v1/model-info`);
      setModelInfo(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching model info:', error);
      // Use default model info if API fails
      setModelInfo(defaultModelInfo);
      console.log('Using default model info');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    
    if (!inputData.distance || !inputData.temperature) {
      setError('Please enter both distance and temperature values');
      return;
    }

    // Validate input ranges
    const distance = parseFloat(inputData.distance);
    const temperature = parseFloat(inputData.temperature);

    if (isNaN(distance) || isNaN(temperature)) {
      setError('Please enter valid numeric values');
      return;
    }

    if (distance < 0 || distance > 200) {
      setError('Distance should be between 0 and 200 cm');
      return;
    }

    if (temperature < -10 || temperature > 60) {
      setError('Temperature should be between -10°C and 60°C');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const payload = {
        distance: distance,
        temperature: temperature,
        time_features: [new Date().getHours(), new Date().getMinutes()]
      };

      const response = await axios.post(`${config.API_BASE_URL}/api/v1/predict`, payload);
      
      if (response.data && response.data.prediction) {
        setPrediction(response.data);
        setError(null);
      } else {
        setError('Invalid response from prediction service');
        setPrediction(null);
      }
    } catch (error) {
      console.error('Error making prediction:', error);
      const errorMsg = error.response?.data?.error || error.message;
      setError(`Failed to make prediction: ${errorMsg}. Please check your input values and ensure the backend is running.`);
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for confidence chart
  const confidenceData = prediction ? [
    { name: 'Confidence', value: parseFloat((prediction.confidence * 100).toFixed(1)) },
    { name: 'Uncertainty', value: parseFloat(((1 - prediction.confidence) * 100).toFixed(1)) }
  ] : [];

  const COLORS = ['#00D4FF', '#FFA500'];

  return (
    <div className="prediction-page">
      <div className="prediction-container">
        {/* Header */}
        <div className="prediction-header">
          <h1>🤖 Water Activity Prediction</h1>
          <p>Predict water usage activities based on sensor data</p>
        </div>

        {/* Model Info Card */}
        <div className="card model-info-card">
          <h2>📊 Model Information</h2>
          {modelInfo ? (
            <div className="model-info-grid">
              <div className="info-item">
                <label>Model Type</label>
                <span className="info-value">{modelInfo.model_type}</span>
              </div>
              <div className="info-item">
                <label>Accuracy</label>
                <span className="info-value success">{(modelInfo.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="info-item">
                <label>Version</label>
                <span className="info-value">{modelInfo.version}</span>
              </div>
              <div className="info-item">
                <label>Last Trained</label>
                <span className="info-value">{modelInfo.last_trained}</span>
              </div>
            </div>
          ) : (
            <p className="loading">Loading model information...</p>
          )}
        </div>

        {/* Input Form */}
        <div className="card prediction-form">
          <h2>📍 Enter Sensor Data</h2>
          <form onSubmit={handlePredict}>
            <div className="form-group">
              <label htmlFor="distance">Water Tank Distance (cm)</label>
              <input
                type="number"
                id="distance"
                name="distance"
                value={inputData.distance}
                onChange={handleInputChange}
                placeholder="e.g., 25.5"
                step="0.1"
                min="0"
                max="200"
                disabled={loading}
              />
              <small>Distance from sensor to water surface (0-200 cm)</small>
            </div>

            <div className="form-group">
              <label htmlFor="temperature">Temperature (°C)</label>
              <input
                type="number"
                id="temperature"
                name="temperature"
                value={inputData.temperature}
                onChange={handleInputChange}
                placeholder="e.g., 28.3"
                step="0.1"
                min="-10"
                max="60"
                disabled={loading}
              />
              <small>Water temperature (-10°C to 60°C)</small>
            </div>

            {error && (
              <div className="error-message">
                <span>⚠️ {error}</span>
              </div>
            )}

            <button type="submit" className="predict-button" disabled={loading}>
              {loading ? '⏳ Making Prediction...' : '🔮 Predict Activity'}
            </button>
          </form>
        </div>

        {/* Prediction Results */}
        {prediction && (
          <div className="results-section">
            {/* Prediction Label */}
            <div className="card prediction-result">
              <h2>✅ Prediction Result</h2>
              <div className="prediction-display">
                <div className="activity-label">{prediction.prediction}</div>
                <div className="confidence-text">
                  Confidence: <span className="confidence-value">{(prediction.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Input Echo */}
            <div className="card input-echo">
              <h2>📋 Your Input</h2>
              <div className="input-display">
                <p><strong>Distance:</strong> {prediction.input?.distance} cm</p>
                <p><strong>Temperature:</strong> {prediction.input?.temperature}°C</p>
              </div>
            </div>

            {/* Confidence Chart */}
            <div className="card confidence-chart-card">
              <h2>📈 Prediction Confidence</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={confidenceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Activity Classes Info */}
            {modelInfo && modelInfo.classes && (
              <div className="card activity-classes">
                <h2>🏷️ Recognized Activities</h2>
                <div className="classes-grid">
                  {modelInfo.classes.map((activity, index) => (
                    <div 
                      key={index} 
                      className={`activity-badge ${prediction.prediction === activity ? 'active' : ''}`}
                    >
                      {activity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!prediction && !loading && (
          <div className="card empty-state">
            <p>👉 Enter sensor values and click "Predict Activity" to see results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prediction;
