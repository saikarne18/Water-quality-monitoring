import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import config from '../config';
import '../styles/RealtimePrediction.css';

const RealtimePrediction = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [stats, setStats] = useState({ total: 0, highWater: 0, normalWater: 0, lowWater: 0 });
  const [chartData, setChartData] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      // Determine WebSocket protocol and host
      let wsUrl;
      try {
        // Parse the API base URL to get the host
        const apiUrl = new URL(config.API_BASE_URL);
        const protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
        wsUrl = `${protocol}//${apiUrl.host}/ws/predictions`;
      } catch (error) {
        // Fallback to simple parsing if URL parsing fails
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = config.API_BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
        wsUrl = `${protocol}//${host}/ws/predictions`;
      }
      
      console.log('Connecting to WebSocket:', wsUrl);
      
      try {
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          // Send initial message
          try {
            wsRef.current.send(JSON.stringify({ type: 'connect', message: 'Connected' }));
          } catch (e) {
            console.log('WebSocket already in progress');
          }
        };

        wsRef.current.onmessage = (event) => {
          try {
            const message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            
            if (message.type === 'prediction' || message.prediction) {
              const prediction = message.data || message;
              
              // Update latest prediction
              setLatestPrediction(prediction);
              
              // Add to predictions list (keep last 20)
              setPredictions(prev => [prediction, ...prev.slice(0, 19)]);
              
              // Update chart data (keep last 10)
              setChartData(prev => [
                {
                  time: new Date(prediction.timestamp || Date.now()).toLocaleTimeString(),
                  distance: prediction.distance || 0,
                  temperature: prediction.temperature || 0,
                  confidence: Math.round((prediction.confidence || 0) * 100)
                },
                ...prev.slice(0, 9)
              ].reverse());
              
              // Update stats
              setStats(prev => ({
                total: prev.total + 1,
                highWater: prediction.prediction === 'High Water Level' ? prev.highWater + 1 : prev.highWater,
                normalWater: prediction.prediction === 'Normal Water Level' ? prev.normalWater + 1 : prev.normalWater,
                lowWater: prediction.prediction === 'Low Water Level' ? prev.lowWater + 1 : prev.lowWater
              }));
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };

        wsRef.current.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          // Attempt reconnection after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setIsConnected(false);
        // Attempt reconnection after 3 seconds
        setTimeout(connectWebSocket, 3000);
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const getStatusColor = (prediction) => {
    if (!prediction) return '#999';
    if (prediction.prediction === 'High Water Level') return '#FF6B9D';
    if (prediction.prediction === 'Normal Water Level') return '#1DB584';
    return '#FFA500';
  };

  const getStatusIcon = (prediction) => {
    if (!prediction) return '⚪';
    if (prediction.prediction === 'High Water Level') return '🔴';
    if (prediction.prediction === 'Normal Water Level') return '🟢';
    return '🟡';
  };

  return (
    <div className="realtime-page">
      <div className="realtime-container">
        {/* Header */}
        <div className="realtime-header">
          <h1>🔴 Real-Time Prediction Stream</h1>
          <p>Live sensor data and AI predictions</p>
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-indicator"></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {/* Main Grid */}
        <div className="realtime-grid">
          {/* Left Column - Live Prediction */}
          <div className="live-section">
            {latestPrediction ? (
              <div className="live-card">
                <h2>Latest Prediction</h2>
                <div className="prediction-display">
                  <div className="prediction-icon">
                    {getStatusIcon(latestPrediction)}
                  </div>
                  <div className="prediction-info">
                    <div className="prediction-label">
                      {latestPrediction.prediction}
                    </div>
                    <div className="prediction-time">
                      {new Date(latestPrediction.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="live-data">
                  <div className="data-item">
                    <span className="data-label">Distance</span>
                    <span className="data-value">{latestPrediction.distance} cm</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Temperature</span>
                    <span className="data-value">{latestPrediction.temperature}°C</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Confidence</span>
                    <span className="data-value">{Math.round(latestPrediction.confidence * 100)}%</span>
                  </div>
                </div>

                <div className="confidence-gauge">
                  <div className="gauge-background">
                    <div
                      className="gauge-fill"
                      style={{
                        width: `${latestPrediction.confidence * 100}%`,
                        backgroundColor: latestPrediction.confidence > 0.85 ? '#1DB584' : '#FFA500'
                      }}
                    />
                  </div>
                  <span className="gauge-text">Confidence Score</span>
                </div>
              </div>
            ) : (
              <div className="live-card empty">
                <p>Waiting for predictions...</p>
              </div>
            )}

            {/* Statistics */}
            <div className="stats-card">
              <h2>Statistics</h2>
              <div className="stats-grid">
                <div className="stat-item total">
                  <span className="stat-icon">📊</span>
                  <span className="stat-label">Total</span>
                  <span className="stat-count">{stats.total}</span>
                </div>
                <div className="stat-item high">
                  <span className="stat-icon">🔴</span>
                  <span className="stat-label">High</span>
                  <span className="stat-count">{stats.highWater}</span>
                </div>
                <div className="stat-item normal">
                  <span className="stat-icon">🟢</span>
                  <span className="stat-label">Normal</span>
                  <span className="stat-count">{stats.normalWater}</span>
                </div>
                <div className="stat-item low">
                  <span className="stat-icon">🟡</span>
                  <span className="stat-label">Low</span>
                  <span className="stat-count">{stats.lowWater}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Charts */}
          <div className="charts-section">
            {chartData.length > 0 && (
              <div className="chart-card">
                <h2>Distance & Temperature Trends</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A3E5E" />
                    <XAxis dataKey="time" stroke="#A0AEC0" />
                    <YAxis stroke="#A0AEC0" yAxisId="left" />
                    <YAxis stroke="#A0AEC0" yAxisId="right" orientation="right" />
                    <Tooltip
                      contentStyle={{
                        background: '#16213E',
                        border: '1px solid #00D4FF',
                        borderRadius: '8px'
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="distance"
                      stroke="#00D4FF"
                      dot={false}
                      strokeWidth={2}
                      animationDuration={300}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="temperature"
                      stroke="#FF6B9D"
                      dot={false}
                      strokeWidth={2}
                      animationDuration={300}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {chartData.length > 0 && (
              <div className="chart-card">
                <h2>Confidence Scores</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData.slice(-5)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A3E5E" />
                    <XAxis dataKey="time" stroke="#A0AEC0" />
                    <YAxis stroke="#A0AEC0" />
                    <Tooltip
                      contentStyle={{
                        background: '#16213E',
                        border: '1px solid #1DB584',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar
                      dataKey="confidence"
                      fill="#1DB584"
                      radius={[8, 8, 0, 0]}
                      animationDuration={300}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Recent Predictions List */}
        <div className="predictions-list-section">
          <h2>Recent Predictions</h2>
          <div className="predictions-list">
            {predictions.slice(0, 10).map((pred, idx) => (
              <div key={idx} className="prediction-item">
                <div className="item-icon">
                  {getStatusIcon(pred)}
                </div>
                <div className="item-info">
                  <div className="item-main">
                    <span className="item-time">
                      {new Date(pred.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="item-prediction">
                      {pred.prediction}
                    </span>
                  </div>
                  <div className="item-details">
                    <span>{pred.distance} cm</span>
                    <span>•</span>
                    <span>{pred.temperature}°C</span>
                    <span>•</span>
                    <span>{Math.round(pred.confidence * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimePrediction;
