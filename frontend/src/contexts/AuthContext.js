import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      console.log('Attempting to register with data:', {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        passwordLength: formData.password?.length
      });
      
      // Add a debug request to check CORS
      try {
        const debugRes = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        if (debugRes.status === 400) {
          // Check if it's a "User already exists" error
          const errorData = await debugRes.json();
          console.log('Registration error response:', errorData);
          
          if (errorData.errors && errorData.errors[0] && errorData.errors[0].msg === 'User already exists') {
            // Try logging in instead
            console.log('User already exists, attempting login...');
            const loginResult = await login({
              email: formData.email,
              password: formData.password
            });
            
            if (loginResult) {
              console.log('Login successful after registration attempt');
              // Will return true from login function if successful
              return true;
            } else {
              // Login failed, throw the original error
              toast.error('This email is already registered. Please try logging in.');
              throw new Error('User already exists');
            }
          }
        }
        
        const debugData = await debugRes.json();
        console.log('Debug fetch response:', debugData);
      } catch (debugErr) {
        console.error('Debug fetch error:', debugErr);
        
        // Try with explicit URL
        try {
          console.log('Trying with explicit URL...');
          const explicitRes = await fetch('https://expense-tracker-production-ap66.onrender.com/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          
          if (explicitRes.status === 400) {
            // Check if it's a "User already exists" error
            const errorData = await explicitRes.json();
            
            if (errorData.errors && errorData.errors[0] && errorData.errors[0].msg === 'User already exists') {
              // Try logging in instead
              console.log('User already exists, attempting login...');
              const loginResult = await login({
                email: formData.email,
                password: formData.password
              });
              
              if (loginResult) {
                return true;
              } else {
                toast.error('This email is already registered. Please try logging in.');
                throw new Error('User already exists');
              }
            }
          }
          
          const explicitData = await explicitRes.json();
          console.log('Explicit URL response:', explicitData);
          
          // If this worked, use the token from here
          if (explicitData && explicitData.token) {
            localStorage.setItem('token', explicitData.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${explicitData.token}`;
            await loadUser();
            return true;
          }
        } catch (explicitErr) {
          console.error('Explicit URL error:', explicitErr);
        }
      }
      
      // Original request
      const res = await api.post('/auth/register', formData);
      console.log('Registration success:', res.data);
      
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        await loadUser();
        return true;
      }
      return false;
    } catch (err) {
      // Check if it's a user already exists error
      if (err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        if (errors[0] && errors[0].msg === 'User already exists') {
          toast.error('This email is already registered. Please try logging in.');
          console.log('User already exists error, suggesting login instead');
        } else {
          toast.error(errors[0]?.msg || 'Registration failed');
        }
      } else {
        console.error('Registration error:', err);
        console.error('Error details:', {
          response: err.response,
          data: err.response?.data,
          status: err.response?.status,
          statusText: err.response?.statusText,
          headers: err.response?.headers,
          message: err.message
        });
      }
      throw err;
    }
  };

  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      await loadUser();
      toast.success('Login successful!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (formData) => {
    try {
      const res = await api.put('/auth/me', formData);
      setUser(res.data);
      toast.success('Profile updated successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || 'Profile update failed');
      return false;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset email sent. Please check your inbox.');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || 'Failed to send reset email');
      return false;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      await api.post('/auth/reset-password', { token, password });
      toast.success('Password reset successful. Please login with your new password.');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || 'Password reset failed');
      return false;
    }
  };

  const verifyEmail = async (token) => {
    try {
      await api.get(`/auth/verify-email?token=${token}`);
      toast.success('Email verified successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || 'Email verification failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 