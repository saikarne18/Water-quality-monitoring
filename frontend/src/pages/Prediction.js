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

  // Fetch model info on component mount
  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/v1/model-info`);
      setModelInfo(response.data);
    } catch (error) {
      console.error('Error fetching model info:', error);
      setError('Failed to load model information');
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

    setLoading(true);
    setError(null);

    try {
      const payload = {
        distance: parseFloat(inputData.distance),
        temperature: parseFloat(inputData.temperature),
        time_features: [new Date().getHours(), new Date().getMinutes()]
      };

      const response = await axios.post(`${config.API_BASE_URL}/api/v1/predict`, payload);
      setPrediction(response.data);
      setError(null);
    } catch (error) {
      console.error('Error making prediction:', error);
      setError('Failed to make prediction. Please check your input values and backend connection.');
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for confidence chart
  const confidenceData = prediction ? [
    { name: 'Confidence', value: (prediction.confidence * 100).toFixed(1) },
    { name: 'Uncertainty', value: (((1 - prediction.confidence) * 100).toFixed(1)) }
  ] : [];

  const COLORS = ['#1f3a93', '#f39200'];

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
                disabled={loading}
              />
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
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="predict-button" disabled={loading}>
              {loading ? 'Making Prediction...' : '🔮 Predict Activity'}
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
            <div className="card activity-classes">
              <h2>🏷️ Recognized Activities</h2>
              <div className="classes-grid">
                {modelInfo && modelInfo.classes && modelInfo.classes.map((activity, index) => (
                  <div 
                    key={index} 
                    className={`activity-badge ${prediction.prediction === activity ? 'active' : ''}`}
                  >
                    {activity}
                  </div>
                ))}
              </div>
            </div>
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
