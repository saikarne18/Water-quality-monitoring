import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import config from '../config';
import '../styles/CSVUpload.css';

const CSVUpload = () => {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Please log in first to upload CSV files');
      return;
    }
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${config.API_BASE_URL}/api/v1/upload-csv`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setResults(response.data);
      setSuccess(true);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = 'distance,temperature,node_id\n94.5,20.8,NODE_001\n75.2,22.1,NODE_001\n55.8,19.5,NODE_001';
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', 'sample_data.csv');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="csv-upload-page">
      <div className="csv-container">
        <div className="csv-header">
          <h1>📊 Batch Prediction Upload</h1>
          <p>Upload a CSV file with sensor data for batch predictions</p>
        </div>

        {!token && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            color: '#856404',
            padding: '12px 20px',
            borderRadius: '4px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            ⚠️ Please log in to use batch upload feature
          </div>
        )}

        <div className="csv-content">
          {/* Upload Section */}
          <div className="upload-section">
            <h2>Upload CSV File</h2>

            <form onSubmit={handleUpload}>
              {/* Drag & Drop Area */}
              <div
                className={`drop-zone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="file-input"
                  id="csv-input"
                  disabled={loading}
                />
                <label htmlFor="csv-input" className="drop-label">
                  <span className="drop-icon">📁</span>
                  <span className="drop-text">
                    {file ? `Selected: ${file.name}` : 'Drag CSV file here or click to browse'}
                  </span>
                  <span className="drop-hint">CSV format: distance, temperature, node_id</span>
                </label>
              </div>

              {/* Error Message */}
              {error && <div className="error-message">{error}</div>}

              {/* Buttons */}
              <div className="button-group">
                <button
                  type="submit"
                  className="upload-button"
                  disabled={!file || loading}
                >
                  {loading ? '⏳ Uploading...' : '🚀 Upload & Predict'}
                </button>
                <button
                  type="button"
                  className="sample-button"
                  onClick={downloadSampleCSV}
                  disabled={loading}
                >
                  📥 Sample CSV
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          {success && results && (
            <div className="results-section">
              <h2>✅ Upload Results</h2>

              <div className="results-summary">
                <div className="result-stat">
                  <span className="stat-label">Total Rows</span>
                  <span className="stat-value">{results.total_rows}</span>
                </div>
                <div className="result-stat">
                  <span className="stat-label">Processed</span>
                  <span className="stat-value success-value">{results.processed_rows}</span>
                </div>
                <div className="result-stat">
                  <span className="stat-label">Errors</span>
                  <span className={`stat-value ${results.errors.length > 0 ? 'error-value' : 'success-value'}`}>
                    {results.errors.length}
                  </span>
                </div>
              </div>

              {/* Predictions Table */}
              {results.predictions && results.predictions.length > 0 && (
                <div className="predictions-table">
                  <h3>Predictions</h3>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Node ID</th>
                          <th>Distance (cm)</th>
                          <th>Temperature (°C)</th>
                          <th>Prediction</th>
                          <th>Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.predictions.map((pred, idx) => (
                          <tr key={idx}>
                            <td className="node-cell">{pred.node_id}</td>
                            <td>{pred.distance.toFixed(1)}</td>
                            <td>{pred.temperature.toFixed(1)}</td>
                            <td className="prediction-cell">{pred.prediction}</td>
                            <td className="confidence-cell">
                              <div className="confidence-bar">
                                <div
                                  className="confidence-fill"
                                  style={{
                                    width: `${Math.round(pred.confidence * 100)}%`,
                                    backgroundColor: pred.confidence > 0.85 ? '#1DB584' : '#FFA500'
                                  }}
                                />
                                <span className="confidence-text">{Math.round(pred.confidence * 100)}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Errors */}
              {results.errors && results.errors.length > 0 && (
                <div className="errors-section">
                  <h3>⚠️ Errors ({results.errors.length})</h3>
                  <ul className="errors-list">
                    {results.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="info-box">
            <h3>📋 CSV Format Requirements</h3>
            <ul>
              <li><strong>Headers:</strong> distance, temperature, node_id</li>
              <li><strong>distance:</strong> Water level distance in cm (numeric)</li>
              <li><strong>temperature:</strong> Water temperature in Celsius (numeric)</li>
              <li><strong>node_id:</strong> Sensor node identifier (text, optional)</li>
              <li><strong>Example:</strong> 94.5, 20.8, NODE_001</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVUpload;
