import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from "./Pages/LoginPage";
import Dashboard from './Pages/Dashboard'; 
import ProtectedRoute from './Pages/ProtectedRoute'; 
import { Navigate } from 'react-router-dom'; // Add Navigate import for redirection
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider

const App = () => {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        <Routes>
          {/* Default route, redirects to login page */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Login route */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Dashboard route, protected by ProtectedRoute */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
