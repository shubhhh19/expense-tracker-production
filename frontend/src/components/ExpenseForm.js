import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../services/api';
import { toast } from 'react-toastify';

const ExpenseForm = ({ categories, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    amount: initialData?.amount || '',
    description: initialData?.description || '',
    date: initialData?.date ? new Date(initialData.date) : new Date(),
    categoryId: initialData?.categoryId || '',
    note: initialData?.note || ''
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const formDataToSend = {
        description: formData.description,
        amount: formData.amount,
        date: formData.date,
        categoryId: formData.categoryId,
        note: formData.note || null
      };

      if (initialData) {
        await api.put(`/expenses/${initialData.id}`, formDataToSend);
      } else {
        await api.post('/expenses', formDataToSend);
      }

      toast.success(`Expense ${initialData ? 'updated' : 'created'} successfully`);
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${initialData ? 'update' : 'create'} expense`);
    } finally {
      setSubmitting(false);
    }
  };

  const validateForm = () => {
    // Implement form validation logic here
    return true; // Placeholder return, actual implementation needed
  };

  return (
    <Box sx={{
      p: 3,
      background: 'linear-gradient(145deg, #16213e 0%, #1a1a2e 100%)',
      borderRadius: 2,
      minHeight: 'calc(100vh - 100px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Paper elevation={0} sx={{
        p: 4,
        maxWidth: 500,
        width: '100%',
        borderRadius: 2,
        background: '#282850',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}>
        <Typography variant="h5" gutterBottom sx={{ 
          color: '#ffffff', 
          fontWeight: 600, 
          mb: 3,
          backgroundImage: 'linear-gradient(45deg, #5c6bc0, #42a5f5)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {initialData ? 'Edit Expense' : 'Add New Expense'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: '#d0d0d0' }}>$</Typography>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&.Mui-focused': {
                    borderColor: '#5c6bc0',
                    boxShadow: '0 0 0 2px rgba(92, 107, 192, 0.2)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#d0d0d0'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#5c6bc0'
                },
                '& .MuiOutlinedInput-input': {
                  color: '#ffffff'
                }
              }}
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&.Mui-focused': {
                    borderColor: '#5c6bc0',
                    boxShadow: '0 0 0 2px rgba(92, 107, 192, 0.2)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#d0d0d0'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#5c6bc0'
                },
                '& .MuiOutlinedInput-input': {
                  color: '#ffffff'
                }
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    '&.Mui-focused': {
                      borderColor: '#5c6bc0',
                      boxShadow: '0 0 0 2px rgba(92, 107, 192, 0.2)'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#d0d0d0'
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#5c6bc0'
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#ffffff'
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#d0d0d0'
                  }
                }} />}
              />
            </LocalizationProvider>

            <FormControl fullWidth sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                },
                '&.Mui-focused': {
                  borderColor: '#5c6bc0',
                  boxShadow: '0 0 0 2px rgba(92, 107, 192, 0.2)'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#d0d0d0'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#5c6bc0'
              },
              '& .MuiSelect-select': {
                color: '#ffffff'
              },
              '& .MuiSvgIcon-root': {
                color: '#d0d0d0'
              }
            }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&.Mui-focused': {
                    borderColor: '#5c6bc0',
                    boxShadow: '0 0 0 2px rgba(92, 107, 192, 0.2)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#d0d0d0'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#5c6bc0'
                },
                '& .MuiOutlinedInput-input': {
                  color: '#ffffff'
                }
              }}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => window.history.back()}
                fullWidth
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#d0d0d0',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={submitting}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 500,
                  background: 'linear-gradient(45deg, #5c6bc0, #42a5f5)',
                  boxShadow: '0 4px 10px rgba(92, 107, 192, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #3949ab, #0077c2)',
                    boxShadow: '0 6px 15px rgba(92, 107, 192, 0.4)',
                  }
                }}
              >
                {submitting ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ExpenseForm; 