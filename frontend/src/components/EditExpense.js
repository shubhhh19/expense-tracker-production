import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import ExpenseForm from './ExpenseForm';
import api from '../services/api';
import { toast } from 'react-toastify';

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch expense by ID
        const expenseResponse = await api.get(`/expenses/${id}`);
        
        // Fetch categories for the form dropdown
        const categoryResponse = await api.get('/categories');
        
        setExpense(expenseResponse.data.data);
        setCategories(categoryResponse.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch expense data. Please try again.');
        toast.error('Error loading expense data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSuccess = () => {
    toast.success('Expense updated successfully');
    navigate('/expenses');
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        sx={{
          background: 'linear-gradient(145deg, #16213e 0%, #1a1a2e 100%)'
        }}
      >
        <CircularProgress sx={{ color: '#5c6bc0' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} sx={{ background: 'linear-gradient(145deg, #16213e 0%, #1a1a2e 100%)' }}>
        <Alert 
          severity="error" 
          sx={{ 
            backgroundColor: 'rgba(244, 67, 54, 0.15)', 
            color: '#ff7961',
            '.MuiAlert-icon': {
              color: '#ff7961'
            }
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <ExpenseForm 
        categories={categories} 
        initialData={expense} 
        onSuccess={handleSuccess} 
      />
    </Box>
  );
};

export default EditExpense; 