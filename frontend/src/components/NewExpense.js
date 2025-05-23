import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import api from '../services/api';
import { toast } from 'react-toastify';
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

function NewExpense() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date(),
    categoryId: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/categories');
        
        if (response.data && response.data.data) {
          setCategories(response.data.data);
          if (response.data.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              categoryId: response.data.data[0].id
            }));
          }
        } else if (Array.isArray(response.data)) {
          // Handle case where API returns an array directly without data property
          setCategories(response.data);
          if (response.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              categoryId: response.data[0].id
            }));
          }
        } else {
          toast.error('Invalid category data format');
        }
      } catch (error) {
        toast.error('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setFormData(prev => ({
      ...prev,
      date: newDate
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add expenses');
      return;
    }
    setLoading(true);

    try {
      const response = await api.post('/expenses', formData);
      if (response.data.success) {
        toast.success('Expense added successfully');
        navigate('/expenses');
      } else {
        toast.error(response.data.message || 'Failed to add expense');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  // Get the icon for a category
  const getCategoryIcon = (categoryName) => {
    return categoryIcons[categoryName] || <MoreHorizIcon />;
  };

  return (
    <Box sx={{
      p: 3,
      background: '#f5f0e8',
      borderRadius: 2,
      minHeight: 'calc(100vh - 100px)',
    }}>
      <Paper elevation={0} sx={{
        p: 4,
        maxWidth: 600,
        width: '100%',
        mx: 'auto',
        borderRadius: 2,
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        overflowX: 'hidden'
      }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#333333', fontWeight: 600, mb: 3 }}>
          Add New Expense
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} sx={{ maxWidth: '100%' }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
                sx={{
                  width: '100%',
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={2}
                sx={{
                  width: '100%',
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : formData.date}
                onChange={handleDateChange}
                required
                InputLabelProps={{
                  shrink: true,
                  style: { color: '#000000', fontWeight: 500 }
                }}
                sx={{
                  width: '100%',
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
                    color: '#000000'
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#2563eb'
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#333333'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required sx={{
                width: '100%',
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
              }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  label="Category"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem
                      key={category.id}
                      value={category.id}
                      sx={{
                        color: '#333333',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                        '&.Mui-selected': { backgroundColor: 'rgba(37, 99, 235, 0.08)' }
                      }}
                    >
                      <ListItemIcon sx={{ color: '#000000' }}>
                        {getCategoryIcon(category.name)}
                      </ListItemIcon>
                      <ListItemText
                        primary={category.name}
                        primaryTypographyProps={{ sx: { color: '#333333' } }}
                        secondary={category.description || 'No description available'}
                        secondaryTypographyProps={{ sx: { color: '#666666' } }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 500,
                  boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)'
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Add Expense'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default NewExpense; 