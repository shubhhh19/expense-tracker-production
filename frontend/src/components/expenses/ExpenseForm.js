import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import api from '../../utils/api';
import { toast } from 'react-toastify';
// Import icons for categories
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FlightIcon from '@mui/icons-material/Flight';
import PetsIcon from '@mui/icons-material/Pets';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// Map of category icons
const categoryIcons = {
  'Food & Dining': <RestaurantIcon />,
  'Shopping': <ShoppingCartIcon />,
  'Housing': <HomeIcon />,
  'Transportation': <DirectionsCarIcon />,
  'Healthcare': <LocalHospitalIcon />,
  'Education': <SchoolIcon />,
  'Entertainment': <SportsEsportsIcon />,
  'Travel': <FlightIcon />,
  'Pets': <PetsIcon />,
  'Other': <MoreHorizIcon />
};

const ExpenseForm = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data || []);
        if (response.data?.length > 0) {
          setCategory(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const validateForm = () => {
    if (!description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    if (!category) {
      setError('Please select a category');
      return false;
    }
    if (!date) {
      setError('Please select a date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const expenseData = {
        description: description.trim(),
        amount: parseFloat(amount),
        date: date, // Already in YYYY-MM-DD format from the date input
        categoryId: category,
        isRecurring: false,
        recurringFrequency: null
      };

      await api.post('/expenses', expenseData);

      toast.success('Expense added successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error adding expense:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add expense';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get the category icon
  const getCategoryIcon = (categoryName) => {
    return categoryIcons[categoryName] || <MoreHorizIcon />;
  };

  return (
    <Container maxWidth="sm" sx={{
      minHeight: 'calc(100vh - 100px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      pt: 4,
      background: '#f5f0e8',
    }}>
      <Paper elevation={0} sx={{
        p: 4,
        borderRadius: 2,
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ color: '#333333', fontWeight: 600, mb: 3 }}>
          Add Expense
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            required
            disabled={isLoading}
            error={!!error && error.includes('Description')}
            sx={{
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                '&:hover': {
                  borderColor: '#bdbdbd'
                },
                '&.Mui-focused': {
                  borderColor: '#2563eb',
                  boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#555555'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#2563eb'
              },
              '& .MuiOutlinedInput-input': {
                color: '#333333'
              }
            }}
          />
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
            required
            disabled={isLoading}
            error={!!error && error.includes('amount')}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputProps: { min: "0", step: "0.01" }
            }}
            sx={{
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                '&:hover': {
                  borderColor: '#bdbdbd'
                },
                '&.Mui-focused': {
                  borderColor: '#2563eb',
                  boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#555555'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#2563eb'
              },
              '& .MuiOutlinedInput-input': {
                color: '#333333'
              }
            }}
          />
          <FormControl
            fullWidth
            margin="normal"
            error={!!error && error.includes('category')}
            sx={{
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                '&:hover': {
                  borderColor: '#bdbdbd'
                },
                '&.Mui-focused': {
                  borderColor: '#2563eb',
                  boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#555555'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#2563eb'
              },
              '& .MuiSelect-select': {
                color: '#333333'
              }
            }}
          >
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={isLoading || categories.length === 0}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: 'background.paper',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    '& .MuiMenuItem-root': {
                      py: 1.5,
                      px: 2,
                      color: '#333333'
                    }
                  }
                }
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': {
                    bgcolor: 'rgba(37, 99, 235, 0.08)'
                  }
                }}>
                  <ListItemIcon sx={{ color: 'primary.main', minWidth: 36 }}>
                    {getCategoryIcon(cat.name)}
                  </ListItemIcon>
                  <ListItemText
                    primary={cat.name}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        color: '#333333'
                      }
                    }}
                    secondary={cat.description}
                    secondaryTypographyProps={{
                      sx: {
                        fontSize: '0.75rem',
                        color: '#666666'
                      }
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            margin="normal"
            required
            disabled={isLoading}
            error={!!error && error.includes('date')}
            InputLabelProps={{
              shrink: true,
              style: { color: '#333333', fontWeight: 500 }
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                '&:hover': {
                  borderColor: '#bdbdbd'
                },
                '&.Mui-focused': {
                  borderColor: '#2563eb',
                  boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#333333'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#2563eb'
              },
              '& .MuiOutlinedInput-input': {
                color: '#333333'
              }
            }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              mt: 1,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 500,
              boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Adding Expense...' : 'Add Expense'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ExpenseForm; 