import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import '../styles/ModelComparison.css';

const ModelComparison = () => {
  const [selectedMetric, setSelectedMetric] = useState('accuracy');

  // Model performance data
  const modelData = [
    {
      name: 'LSTM Baseline',
      accuracy: 85,
      f1Score: 0.83,
      trainingTime: 45,
      parameters: 15000,
      inference: 5,
      type: 'LSTM'
    },
    {
      name: 'LSTM Improved',
      accuracy: 92,
      f1Score: 0.90,
      trainingTime: 120,
      parameters: 45000,
      inference: 8,
      type: 'LSTM'
    },
    {
      name: 'CNN',
      accuracy: 88,
      f1Score: 0.86,
      trainingTime: 90,
      parameters: 18000,
      inference: 3,
      type: 'CNN'
    },
    {
      name: 'GRU',
      accuracy: 87,
      f1Score: 0.85,
      trainingTime: 60,
      parameters: 12000,
      inference: 4,
      type: 'GRU'
    }
  ];

  const comparisonMetrics = [
    {
      model: 'LSTM Improved',
      accuracy: 92,
      f1Score: 90,
      speed: 70,
      efficiency: 60,
      stability: 95
    },
    {
      model: 'CNN',
      accuracy: 88,
      f1Score: 86,
      speed: 95,
      efficiency: 80,
      stability: 80
    },
    {
      model: 'GRU',
      accuracy: 87,
      f1Score: 85,
      speed: 90,
      efficiency: 95,
      stability: 75
    },
    {
      model: 'LSTM Baseline',
      accuracy: 85,
      f1Score: 83,
      speed: 80,
      efficiency: 85,
      stability: 70
    }
  ];

  const classPerformance = [
    { class: 'Normal', LSTM: 94, CNN: 91, GRU: 88 },
    { class: 'High Usage', LSTM: 90, CNN: 87, GRU: 85 },
    { class: 'Low Alert', LSTM: 88, CNN: 85, GRU: 82 },
    { class: 'Leak', LSTM: 91, CNN: 84, GRU: 80 }
  ];

  return (
    <div className="model-comparison-page">
      <div className="comparison-header">
        <h1>🤖 MODEL COMPARISON</h1>
        <p>Performance Analytics Across Different Architectures</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card highlight">
          <div className="metric-label">Best Accuracy</div>
          <div className="metric-value">92%</div>
          <div className="metric-model">LSTM Improved ⭐</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Fastest Inference</div>
          <div className="metric-value">3ms</div>
          <div className="metric-model">CNN</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Most Efficient</div>
          <div className="metric-value">12K Params</div>
          <div className="metric-model">GRU</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Best Balance</div>
          <div className="metric-value">F1: 0.90</div>
          <div className="metric-model">LSTM Improved</div>
        </div>
      </div>

      {/* Radar Chart - Multi-metric Comparison */}
      <div className="comparison-section">
        <div className="section-header">
          <h2>📊 Multi-Dimensional Performance</h2>
          <p>Accuracy, F1-Score, Speed, Efficiency, and Stability</p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={comparisonMetrics}>
            <PolarGrid />
            <PolarAngleAxis dataKey="model" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="Accuracy" dataKey="accuracy" stroke="#FF6B9D" fill="#FF6B9D" fillOpacity={0.1} />
            <Radar name="F1-Score" dataKey="f1Score" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.1} />
            <Radar name="Speed" dataKey="speed" stroke="#1DB584" fill="#1DB584" fillOpacity={0.1} />
            <Radar name="Efficiency" dataKey="efficiency" stroke="#FFA500" fill="#FFA500" fillOpacity={0.1} />
            <Radar name="Stability" dataKey="stability" stroke="#9D4EDD" fill="#9D4EDD" fillOpacity={0.1} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Accuracy Comparison */}
      <div className="comparison-section">
        <div className="section-header">
          <h2>📈 Accuracy Comparison</h2>
          <p>Model performance on test dataset</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={modelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[80, 100]} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="accuracy" fill="#FF6B9D" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Class-wise Performance */}
      <div className="comparison-section">
        <div className="section-header">
          <h2>🎯 Per-Class Accuracy</h2>
          <p>How each model performs on different water activity classes</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={classPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="class" />
            <YAxis domain={[70, 100]} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Bar dataKey="LSTM" fill="#FF6B9D" radius={[4, 4, 0, 0]} />
            <Bar dataKey="CNN" fill="#00D4FF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="GRU" fill="#1DB584" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Training Time vs Accuracy */}
      <div className="comparison-section">
        <div className="section-header">
          <h2>⏱️ Training Time vs Accuracy Trade-off</h2>
          <p>Efficiency analysis for model selection</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={modelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="trainingTime" label={{ value: 'Training Time (seconds)', position: 'insideBottom', offset: -5 }} />
            <YAxis yAxisId="left" label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} domain={[80, 100]} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'F1-Score', angle: 90, position: 'insideRight' }} domain={[0.8, 0.95]} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#FF6B9D" strokeWidth={3} name="Accuracy (%)" />
            <Line yAxisId="right" type="monotone" dataKey="f1Score" stroke="#00D4FF" strokeWidth={3} name="F1-Score" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Comparison Table */}
      <div className="comparison-section">
        <div className="section-header">
          <h2>📋 Detailed Comparison Table</h2>
        </div>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>Accuracy</th>
                <th>F1-Score</th>
                <th>Parameters</th>
                <th>Training Time</th>
                <th>Inference (ms)</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {modelData.map((model, idx) => (
                <tr key={idx} className={model.name === 'LSTM Improved' ? 'best-model' : ''}>
                  <td className="model-name">{model.name}</td>
                  <td>{model.accuracy}%</td>
                  <td>{model.f1Score}</td>
                  <td>{(model.parameters / 1000).toFixed(1)}K</td>
                  <td>{model.trainingTime}s</td>
                  <td>{model.inference}ms</td>
                  <td>
                    {model.name === 'LSTM Improved' && <span className="badge best">⭐ Best Overall</span>}
                    {model.name === 'CNN' && <span className="badge">🚀 Fastest</span>}
                    {model.name === 'GRU' && <span className="badge">💾 Efficient</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendation */}
      <div className="comparison-section recommendation">
        <h2>💡 Model Selection Recommendation</h2>
        <div className="recommendation-box">
          <div className="recommendation-item">
            <h3>For Production (Recommended)</h3>
            <p><strong>LSTM Improved</strong> - 92% accuracy with best F1-score (0.90)</p>
            <p>Best overall performance, suitable for critical water quality monitoring applications.</p>
          </div>
          <div className="recommendation-item">
            <h3>For Real-time (Edge Devices)</h3>
            <p><strong>CNN</strong> - Fastest inference (3ms) with 88% accuracy</p>
            <p>Ideal for resource-constrained devices or low-latency requirements.</p>
          </div>
          <div className="recommendation-item">
            <h3>For Efficiency (Memory Constrained)</h3>
            <p><strong>GRU</strong> - Smallest model (12K parameters) with 87% accuracy</p>
            <p>Best for embedded systems or mobile deployments.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelComparison;
