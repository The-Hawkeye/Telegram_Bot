import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithPopup } from '../firebase';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Login Successful:', user);
      localStorage.setItem('token', user.accessToken);
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Login Failed:', error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login to Weather Admin Dashboard</h2>
      <button className="login-button" onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginPage;
