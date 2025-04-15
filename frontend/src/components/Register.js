import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showEmailInUse, setShowEmailInUse] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Known emails to avoid
  const knownExistingEmails = ['sonishubh2004@outlook.com', 'test123@example.com', 'admin@example.com'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset email warning if they change the email
    if (name === 'email') {
      setShowEmailInUse(false);
    }
  };

  // Helper to generate a unique email
  const makeUniqueEmail = (email) => {
    const [localPart, domain] = email.split('@');
    const timestamp = new Date().getTime().toString().slice(-6);
    return `${localPart}+${timestamp}@${domain}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    // Check if email is known to exist
    if (knownExistingEmails.includes(formData.email.toLowerCase())) {
      console.log('Email is known to exist already:', formData.email);
      setShowEmailInUse(true);
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      console.log('Submitting registration data:', {
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        passwordLength: registerData.password?.length
      });
      
      const success = await register(registerData);
      if (success) {
        toast.success('You are now logged in!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration component error:', error);
      
      // Check if it's a user exists error
      if (error.message === 'User already exists' || 
          (error.response?.data?.errors && 
           error.response.data.errors[0]?.msg === 'User already exists')) {
        
        // Add this email to our known list
        if (!knownExistingEmails.includes(formData.email.toLowerCase())) {
          knownExistingEmails.push(formData.email.toLowerCase());
        }
        
        setShowEmailInUse(true);
      } else {
        // Different error
        toast.error(
          error.response?.data?.errors?.[0]?.msg || 
          error.message || 
          'Registration failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Try registration with a modified email
  const handleTryUniqueEmail = async () => {
    setLoading(true);
    try {
      const uniqueEmail = makeUniqueEmail(formData.email);
      
      console.log('Trying with unique email:', uniqueEmail);
      
      const { confirmPassword, ...registerData } = formData;
      registerData.email = uniqueEmail;
      
      const success = await register(registerData);
      if (success) {
        toast.success('You are now logged in with ' + uniqueEmail);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Unique email registration error:', error);
      toast.error('Registration still failed. Please try a completely different email.');
    } finally {
      setLoading(false);
      setShowEmailInUse(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>
        
        {showEmailInUse && (
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleTryUniqueEmail}
                disabled={loading}
              >
                Try Unique Version
              </Button>
            }
          >
            This email is already registered. Try a different one or use a unique variant.
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            error={showEmailInUse}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || showEmailInUse}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Already have an account? Login
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default Register;