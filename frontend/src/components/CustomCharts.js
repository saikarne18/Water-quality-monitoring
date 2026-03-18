import React, { useState, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import '../styles/CustomCharts.css';

/**
 * Custom Chart Component 1: Activity Timeline Chart
 * Shows water tank activity over time with duration metrics
 */
export const ActivityTimelineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-placeholder">No data available</div>;
  }

  return (
    <div className="custom-chart-container">
      <h3>Activity Timeline - Water Level Changes</h3>
      <p className="chart-description">Duration and frequency of water level fluctuations over time</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{ value: 'Time Period', position: 'insideBottom', offset: -10 }}
          />
          <YAxis
            yAxisId="left"
            label={{ value: 'Duration (minutes)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: 'Events', angle: 90, position: 'insideRight' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #ccc' }}
            formatter={(value) => value.toFixed(2)}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="duration" fill="#8884d8" name="Duration" />
          <Bar yAxisId="right" dataKey="events" fill="#82ca9d" name="Events" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Custom Chart Component 2: Distance vs Temperature Correlation Chart
 * Shows scatter plot of distance vs temperature relationship
 */
export const CorrelationScatterChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-placeholder">No data available</div>;
  }

  // Color based on prediction class
  const getColor = (prediction) => {
    switch (prediction) {
      case 'High Usage':
        return '#EF476F';
      case 'Normal':
        return '#06D6A0';
      case 'Low Water Alert':
        return '#FFB703';
      default:
        return '#118AB2';
    }
  };

  return (
    <div className="custom-chart-container">
      <h3>Distance vs Temperature Correlation</h3>
      <p className="chart-description">Relationship between sensor distance (water level) and temperature readings</p>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="distance"
            name="Distance (cm)"
            label={{ value: 'Distance (cm)', position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis
            type="number"
            dataKey="temperature"
            name="Temperature (°C)"
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          {['High Usage', 'Normal', 'Low Water Alert', 'Leak Detection'].map((prediction) => (
            <Scatter
              key={prediction}
              name={prediction}
              data={data.filter(d => d.prediction === prediction)}
              fill={getColor(prediction)}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Custom Chart Component 3: Cumulative Prediction Count
 * Shows cumulative trend of different prediction types over time
 */
export const CumulativePredictionChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-placeholder">No data available</div>;
  }

  // Prepare data for cumulative count
  const predictionCounts = {};
  const processedData = data.map((item, index) => {
    const count = predictionCounts[item.prediction] || 0;
    predictionCounts[item.prediction] = count + 1;
    return {
      ...item,
      index,
      normalCount: predictionCounts['Normal'] || 0,
      highUsageCount: predictionCounts['High Usage'] || 0,
      lowWaterCount: predictionCounts['Low Water Alert'] || 0
    };
  });

  return (
    <div className="custom-chart-container">
      <h3>Cumulative Prediction Trends</h3>
      <p className="chart-description">Cumulative count of each prediction type over time</p>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={processedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="index"
            label={{ value: 'Sample Number', position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis
            label={{ value: 'Cumulative Count', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="normalCount"
            stackId="1"
            stroke="#06D6A0"
            fill="#06D6A0"
            name="Normal"
          />
          <Area
            type="monotone"
            dataKey="highUsageCount"
            stackId="1"
            stroke="#EF476F"
            fill="#EF476F"
            name="High Usage"
          />
          <Area
            type="monotone"
            dataKey="lowWaterCount"
            stackId="1"
            stroke="#FFB703"
            fill="#FFB703"
            name="Low Water"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Custom Chart Component 4: Prediction Confidence Distribution
 * Shows confidence score distribution across predictions
 */
export const ConfidenceDistributionChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-placeholder">No data available</div>;
  }

  return (
    <div className="custom-chart-container">
      <h3>Confidence Score Distribution</h3>
      <p className="chart-description">Model confidence distribution across all predictions</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis
            label={{ value: 'Confidence', angle: -90, position: 'insideLeft' }}
            domain={[0, 1]}
          />
          <Tooltip
            formatter={(value) => (typeof value === 'number' ? value.toFixed(3) : value)}
            contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #ccc' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="confidence"
            stroke="#118AB2"
            name="Confidence Score"
            isAnimationActive={true}
            animationDuration={500}
          />
          <Line
            type="monotone"
            dataKey="confidence_avg"
            stroke="#FFB703"
            name="Moving Average"
            strokeDasharray="5 5"
            isAnimationActive={true}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default {
  ActivityTimelineChart,
  CorrelationScatterChart,
  CumulativePredictionChart,
  ConfidenceDistributionChart
};
