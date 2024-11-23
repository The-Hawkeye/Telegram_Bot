import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Check if the user is authenticated via Firebase and if the token is in localStorage
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!user && !!token);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) return <div>Loading...</div>;

  // If the user is not authenticated or the token is missing, redirect to the login page
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
