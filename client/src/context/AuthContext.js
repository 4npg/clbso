import React, { createContext, useState, useEffect, useContext } from 'react';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import api from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Verify token with backend
      api.get('/auth/me')
        .then(res => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      console.error('Firebase is not configured. Please set up your .env file with Firebase credentials.');
      return { success: false, error: 'Firebase is not configured. Please check your environment variables.' };
    }
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Send to backend for verification
      const response = await api.post('/auth/login', {
        email: firebaseUser.email,
        firebaseToken: await firebaseUser.getIdToken()
      });

      const { token, member } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(member));
      setUser(member);
      
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      
      // Provide more helpful error messages
      let errorMessage = error.message;
      
      // Firebase authentication errors
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/invalid-api-key') {
        errorMessage = 'Firebase configuration error. Please check your .env file and ensure your Firebase project is properly set up.';
        console.error('💡 Make sure:');
        console.error('   1. Your Firebase API key is correct');
        console.error('   2. Google Sign-In is enabled in Firebase Console');
        console.error('   3. Your auth domain matches your Firebase project');
        console.error('   4. Check: https://console.firebase.google.com > Authentication > Sign-in method');
      }
      // Backend API errors
      else if (error.response) {
        const apiError = error.response.data;
        errorMessage = apiError.message || 'Server error occurred. Please try again.';
        
        if (error.response.status === 404) {
          errorMessage = 'Your account is not registered. Please contact an administrator to be added to the system.';
        } else if (error.response.status === 503) {
          errorMessage = 'Database connection error. Please check if the server is running and MongoDB is connected.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please check the server logs or contact support.';
        }
        
        console.error('API Error:', apiError);
      }
      // Network errors
      else if (error.request) {
        errorMessage = 'Cannot connect to server. Please make sure the backend server is running on port 5000.';
        console.error('Network error - server may not be running');
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    if (!auth) {
      // If Firebase is not configured, just clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      return;
    }
    
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if Firebase sign out fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'leader'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

