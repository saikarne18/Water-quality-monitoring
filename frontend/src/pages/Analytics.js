import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ComposedChart, 
  ReferenceArea, ReferenceLine
} from 'recharts';
import '../styles/Analytics.css';

const Analytics = () => {
  const [selectedMetric, setSelectedMetric] = useState('waterLevel');
  const [timeRange, setTimeRange] = useState('7d');
  const [analysisData, setAnalysisData] = useState([]);

  // Historical time-series data
  const timeSeriesData = [
    { time: '00:00', waterLevel: 65, temperature: 22, ph: 7.2, anomaly: false },
    { time: '04:00', waterLevel: 68, temperature: 20, ph: 7.15, anomaly: false },
    { time: '08:00', waterLevel: 82, temperature: 24, ph: 7.25, anomaly: false },
    { time: '12:00', waterLevel: 88, temperature: 26, ph: 7.3, anomaly: false },
    { time: '16:00', waterLevel: 45, temperature: 28, ph: 7.1, anomaly: true },
    { time: '20:00', waterLevel: 52, temperature: 25, ph: 7.2, anomaly: false },
    { time: '23:59', waterLevel: 71, temperature: 23, ph: 7.25, anomaly: false },
    { time: '02:00', waterLevel: 75, temperature: 21, ph: 7.18, anomaly: false },
    { time: '06:00', waterLevel: 79, temperature: 23, ph: 7.28, anomaly: false },
    { time: '10:00', waterLevel: 85, temperature: 25, ph: 7.32, anomaly: false },
    { time: '14:00', waterLevel: 91, temperature: 27, ph: 7.35, anomaly: false },
    { time: '18:00', waterLevel: 58, temperature: 26, ph: 7.12, anomaly: true },
    { time: '22:00', waterLevel: 68, temperature: 24, ph: 7.22, anomaly: false },
  ];

  // Correlation data
  const correlationMatrix = [
    { metric: 'Water Level', waterLevel: 1.0, temperature: -0.45, ph: 0.32, turbidity: -0.68 },
    { metric: 'Temperature', waterLevel: -0.45, temperature: 1.0, ph: 0.78, turbidity: 0.42 },
    { metric: 'pH Level', waterLevel: 0.32, temperature: 0.78, ph: 1.0, turbidity: -0.25 },
    { metric: 'Turbidity', waterLevel: -0.68, temperature: 0.42, ph: -0.25, turbidity: 1.0 }
  ];

  // Trend analysis data
  const trendData = [
    { week: 'Week 1', trend: -2.5, confidence: 85 },
    { week: 'Week 2', trend: 1.2, confidence: 78 },
    { week: 'Week 3', trend: 3.8, confidence: 92 },
    { week: 'Week 4', trend: 0.9, confidence: 75 },
    { week: 'Week 5', trend: -1.5, confidence: 88 },
    { week: 'Week 6', trend: 2.1, confidence: 81 },
    { week: 'Week 7', trend: 4.2, confidence: 94 }
  ];

  // Anomaly detection results
  const anomalyData = [
    {
      id: 1,
      time: '16:00 - 2024-01-15',
      metric: 'Water Level',
      value: 45,
      expected: 75,
      severity: 'HIGH',
      type: 'Drop'
    },
    {
      id: 2,
      time: '18:00 - 2024-01-15',
      metric: 'pH Level',
      value: 7.1,
      expected: 7.3,
      severity: 'MEDIUM',
      type: 'Deviation'
    },
    {
      id: 3,
      time: '14:30 - 2024-01-14',
      metric: 'Temperature',
      value: 31,
      expected: 24,
      severity: 'MEDIUM',
      type: 'Spike'
    },
    {
      id: 4,
      time: '09:15 - 2024-01-14',
      metric: 'Turbidity',
      value: 250,
      expected: 80,
      severity: 'HIGH',
      type: 'Spike'
    },
    {
      id: 5,
      time: '22:45 - 2024-01-13',
      metric: 'Water Level',
      value: 15,
      expected: 65,
      severity: 'CRITICAL',
      type: 'Critical Drop'
    }
  ];

  // Scatter plot data - Water Level vs Temperature correlation
  const scatterData = timeSeriesData.map((item, idx) => ({
    waterLevel: item.waterLevel,
    temperature: item.temperature,
    anomaly: item.anomaly ? 3 : 1
  }));

  // Statistics cards data
  const stats = [
    {
      title: 'Total Data Points',
      value: '1,847',
      trend: '+12%',
      color: 'stat-blue',
      icon: '📊'
    },
    {
      title: 'Anomalies Detected',
      value: '23',
      trend: '-8%',
      color: 'stat-orange',
      icon: '⚠️'
    },
    {
      title: 'Avg Correlation',
      value: '0.54',
      trend: '+3%',
      color: 'stat-green',
      icon: '🔗'
    },
    {
      title: 'Data Quality',
      value: '94.2%',
      trend: '+2%',
      color: 'stat-purple',
      icon: '✅'
    }
  ];

  useEffect(() => {
    setAnalysisData(timeSeriesData);
  }, [timeRange]);

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>📈 ADVANCED ANALYTICS & INSIGHTS</h1>
        <p>Deep Dive into Water Quality Data Patterns and Anomalies</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-title">{stat.title}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-trend">{stat.trend} vs last week</div>
            </div>
          </div>
        ))}
      </div>

      {/* Time Series Analysis */}
      <div className="analytics-section">
        <div className="section-header">
          <h2>📅 Time Series Analysis with Anomaly Detection</h2>
          <div className="controls">
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="select-control">
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={analysisData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="#a0aec0" />
            <YAxis stroke="#a0aec0" yAxisId="left" />
            <YAxis stroke="#a0aec0" yAxisId="right" orientation="right" />
            <Tooltip 
              contentStyle={{ background: 'rgba(10, 14, 39, 0.95)', border: '1px solid #FF6B9D' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <ReferenceLine 
              y={75} 
              stroke="#888" 
              strokeDasharray="5 5" 
              label="Normal Range"
            />
            <Area 
              type="monotone" 
              dataKey="waterLevel" 
              fill="rgba(0, 212, 255, 0.1)" 
              stroke="#00D4FF"
              name="Water Level (%)"
              yAxisId="left"
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#FFA500" 
              strokeWidth={2}
              name="Temperature (°C)"
              yAxisId="right"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Correlation Analysis */}
      <div className="correlation-section">
        <div className="section-header">
          <h2>🔗 Correlation Matrix</h2>
          <p>Relationships between water quality metrics</p>
        </div>
        
        <div className="correlation-matrix">
          <div className="matrix-row header-row">
            <div className="matrix-cell header-cell"></div>
            <div className="matrix-cell header-cell">Water Level</div>
            <div className="matrix-cell header-cell">Temperature</div>
            <div className="matrix-cell header-cell">pH Level</div>
            <div className="matrix-cell header-cell">Turbidity</div>
          </div>
          
          {correlationMatrix.map((row, idx) => (
            <div key={idx} className="matrix-row">
              <div className="matrix-cell header-cell">{row.metric}</div>
              {['waterLevel', 'temperature', 'ph', 'turbidity'].map((key, jdx) => (
                <div 
                  key={jdx} 
                  className="matrix-cell"
                  style={{
                    backgroundColor: getCorrelationColor(row[key]),
                    color: Math.abs(row[key]) > 0.5 ? '#fff' : '#000'
                  }}
                >
                  {row[key].toFixed(2)}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="correlation-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ background: 'linear-gradient(90deg, #1DB584, #00D4FF, #FF6B9D, #8B0000)' }}></div>
            <span>Strong Positive (-1 ← Correlation → +1) Strong Negative</span>
          </div>
        </div>
      </div>

      {/* Scatter Plot - Correlation Visualization */}
      <div className="analytics-section">
        <div className="section-header">
          <h2>📍 Water Level vs Temperature Correlation</h2>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis type="number" dataKey="waterLevel" stroke="#a0aec0" label={{ value: 'Water Level (%)', position: 'insideBottomRight', offset: -5 }} />
            <YAxis type="number" dataKey="temperature" stroke="#a0aec0" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={renderScatterTooltip} />
            <Scatter 
              name="Normal" 
              data={scatterData.filter(d => !d.anomaly)} 
              fill="#00D4FF"
              fillOpacity={0.6}
            />
            <Scatter 
              name="Anomaly" 
              data={scatterData.filter(d => d.anomaly)} 
              fill="#FF6B9D"
              fillOpacity={0.8}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Analysis */}
      <div className="analytics-section">
        <div className="section-header">
          <h2>📊 Weekly Trend Analysis with Confidence Levels</h2>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="week" stroke="#a0aec0" />
            <YAxis stroke="#a0aec0" />
            <Tooltip 
              contentStyle={{ background: 'rgba(10, 14, 39, 0.95)', border: '1px solid #00D4FF' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="trend" fill="#1DB584" radius={[8, 8, 0, 0]} name="Trend (%)" />
            <Bar dataKey="confidence" fill="#FFA500" radius={[8, 8, 0, 0]} name="Confidence (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Anomaly Detection Results */}
      <div className="anomaly-section">
        <div className="section-header">
          <h2>🚨 Recent Anomalies Detected</h2>
          <p>Unusual patterns identified in the last 7 days</p>
        </div>

        <div className="anomaly-list">
          {anomalyData.map((anomaly, idx) => (
            <div key={idx} className={`anomaly-item severity-${anomaly.severity.toLowerCase()}`}>
              <div className="anomaly-severity">
                <span className={`severity-badge ${anomaly.severity.toLowerCase()}`}>
                  {anomaly.severity}
                </span>
              </div>
              
              <div className="anomaly-details">
                <div className="anomaly-metric">{anomaly.metric}</div>
                <div className="anomaly-time">{anomaly.time}</div>
                <div className="anomaly-type">{anomaly.type}</div>
              </div>
              
              <div className="anomaly-values">
                <div className="value-item">
                  <span className="label">Actual:</span>
                  <span className="value actual">{anomaly.value}</span>
                </div>
                <div className="value-item">
                  <span className="label">Expected:</span>
                  <span className="value expected">{anomaly.expected}</span>
                </div>
                <div className="value-item">
                  <span className="label">Deviation:</span>
                  <span className="value deviation">
                    {Math.abs(anomaly.value - anomaly.expected).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Summary */}
      <div className="insights-section">
        <h2>💡 Key Insights & Recommendations</h2>
        
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">📍</div>
            <h3>Strong Negative Correlation</h3>
            <p><strong>Water Level & Turbidity:</strong> -0.68 correlation indicates that as water level drops, turbidity increases significantly. Monitor turbidity closely during low water level periods.</p>
          </div>

          <div className="insight-card">
            <div className="insight-icon">🔄</div>
            <h3>Temperature Dependency</h3>
            <p><strong>Temperature & pH:</strong> 0.78 positive correlation shows pH increases with temperature. Implement temperature-dependent pH adj ustments for accurate monitoring.</p>
          </div>

          <div className="insight-card">
            <div className="insight-icon">⚡</div>
            <h3>Anomaly Patterns</h3>
            <p><strong>5 anomalies detected:</strong> 2 Critical, 2 High severity anomalies primarily occur around 14:00-18:00 window. Investigate infrastructure during these times.</p>
          </div>

          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <h3>Upward Trend</h3>
            <p><strong>Week 6-7 shows +4.2% growth:</strong> With 94% confidence. Water quality metrics trending positively. Continue current monitoring protocols.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getCorrelationColor = (value) => {
  // Color gradient from strong negative (red) to strong positive (green)
  if (value > 0.6) return '#00C851'; // Strong positive
  if (value > 0.3) return '#00D4FF'; // Moderate positive
  if (value > -0.3) return '#FFD700'; // Near zero
  if (value > -0.6) return '#FF6B9D'; // Moderate negative
  return '#8B0000'; // Strong negative
};

const renderScatterTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'rgba(10, 14, 39, 0.95)',
        padding: '10px',
        border: '1px solid #00D4FF',
        borderRadius: '5px',
        color: '#fff',
        fontSize: '12px'
      }}>
        <p>Water Level: {data.waterLevel.toFixed(1)}%</p>
        <p>Temperature: {data.temperature.toFixed(1)}°C</p>
        <p>{data.anomaly ? 'Anomaly: Yes' : 'Status: Normal'}</p>
      </div>
    );
  }
  return null;
};

export default Analytics;
