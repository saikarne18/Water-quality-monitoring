import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import NodeCreation from './pages/NodeCreation';
import Prediction from './pages/Prediction';
import ModelComparison from './pages/ModelComparison';
import Analytics from './pages/Analytics';
import CSVUpload from './pages/CSVUpload';
import RealtimePrediction from './pages/RealtimePrediction';
import AlertPreferences from './pages/AlertPreferences';
import AlertHistory from './pages/AlertHistory';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // If not authenticated, show login/signup or redirect
  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  // If authenticated, show main app
  return (
    <Router>
      <div className="App">
        <Navbar onToggleSidebar={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/node-creation" element={<NodeCreation />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/model-comparison" element={<ModelComparison />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/csv-upload" element={<CSVUpload />} />
            <Route path="/realtime-prediction" element={<RealtimePrediction />} />
            <Route path="/alert-preferences" element={<AlertPreferences />} />
            <Route path="/alert-history" element={<AlertHistory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;