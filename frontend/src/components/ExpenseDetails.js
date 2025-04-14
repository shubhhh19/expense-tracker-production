import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Chip
} from '@mui/material';
import { format } from 'date-fns';

const ExpenseDetails = ({ expense, onEdit, onDelete }) => {
  const handleViewReceipt = () => {
    window.open(expense.receipt, '_blank');
  };

  return (
    <Paper elevation={3} sx={{ 
      p: 3, 
      maxWidth: 600, 
      mx: 'auto',
      background: '#282850',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ 
          color: '#ffffff',
          fontWeight: 600,
          backgroundImage: 'linear-gradient(45deg, #5c6bc0, #42a5f5)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Expense Details
        </Typography>
        <Box>
          <Button
            variant="outlined"
            sx={{ 
              mr: 1,
              color: '#5c6bc0',
              borderColor: '#5c6bc0',
              '&:hover': {
                borderColor: '#42a5f5',
                backgroundColor: 'rgba(92, 107, 192, 0.1)'
              }
            }}
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: '#f44336',
              borderColor: '#f44336',
              '&:hover': {
                borderColor: '#d32f2f',
                backgroundColor: 'rgba(244, 67, 54, 0.1)'
              }
            }}
            onClick={onDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.15)' }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ color: '#ffffff' }}>
            Amount: ${expense.amount}
          </Typography>
          {expense.isRecurring && (
            <Chip
              label={`Recurring: ${expense.recurringFrequency}`}
              sx={{
                color: '#ffffff',
                borderColor: '#5c6bc0',
                backgroundColor: 'rgba(92, 107, 192, 0.1)'
              }}
              variant="outlined"
            />
          )}
        </Box>

        <Typography variant="body1" sx={{ color: '#d0d0d0' }}>
          <strong>Description:</strong> {expense.description}
        </Typography>

        <Typography variant="body1" sx={{ color: '#d0d0d0' }}>
          <strong>Date:</strong> {format(new Date(expense.date), 'MMM dd, yyyy')}
        </Typography>

        <Typography variant="body1" sx={{ color: '#d0d0d0' }}>
          <strong>Category:</strong> {expense.Category?.name}
        </Typography>

        {expense.note && (
          <Box>
            <Typography variant="body1" sx={{ mb: 1, color: '#d0d0d0' }}>
              <strong>Note:</strong>
            </Typography>
            <Paper variant="outlined" sx={{ 
              p: 2,
              bgcolor: 'rgba(92, 107, 192, 0.1)',
              borderColor: 'rgba(92, 107, 192, 0.2)'
            }}>
              <Typography variant="body2" sx={{ 
                whiteSpace: 'pre-wrap',
                color: '#ffffff'
              }}>
                {expense.note}
              </Typography>
            </Paper>
          </Box>
        )}

        {expense.receipt && (
          <Box>
            <Typography variant="body1" sx={{ mb: 1, color: '#d0d0d0' }}>
              <strong>Receipt:</strong>
            </Typography>
            <Button
              variant="outlined"
              sx={{
                color: '#5c6bc0',
                borderColor: '#5c6bc0',
                '&:hover': {
                  borderColor: '#42a5f5',
                  backgroundColor: 'rgba(92, 107, 192, 0.1)'
                }
              }}
              onClick={handleViewReceipt}
            >
              View Receipt
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ExpenseDetails; 