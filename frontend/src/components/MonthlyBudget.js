import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CategoryIcon from '@mui/icons-material/Category';
import { toast } from 'react-toastify';
import api from '../services/api';

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
  'Bills & Utilities': <PhoneIcon />,
  'Salary': <WorkIcon />,
  'Investments': <ShowChartIcon />,
  'Freelance': <BusinessCenterIcon />,
  'Gifts': <CardGiftcardIcon />,
  'Other': <MoreHorizIcon />
};

const BudgetCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const ProgressBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    backgroundColor: value > 100 ? theme.palette.error.main :
      value > 80 ? theme.palette.warning.main :
        theme.palette.success.main,
  },
  marginTop: 5,
  marginBottom: 8,
}));

// Enhanced text styling for better visibility
const SpentText = styled(Typography)(({ theme }) => ({
  color: '#cbd5e1',
  fontWeight: 500,
  fontSize: '0.875rem',
  marginBottom: '4px',
}));

const RemainingText = styled(Typography)(({ theme, negative }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  color: negative ? theme.palette.error.main : theme.palette.success.main,
}));

const BudgetAmount = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  color: '#f8fafc',
  marginBottom: '12px',
}));

function MonthlyBudget() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    period: 'monthly'
  });
  const [error, setError] = useState('');

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/budgets');
      
      if (response.data.success) {
        setBudgets(response.data.data);
      } else {
        toast.error('Failed to fetch budgets');
      }
    } catch (error) {
      toast.error('Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const handleOpenDialog = (budget = null) => {
    setSelectedBudget(budget);
    setFormData({
      amount: budget ? budget.amount : '',
      categoryId: budget ? budget.categoryId : '',
      period: budget ? budget.period : 'monthly'
    });
    setError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBudget(null);
    setFormData({ amount: '', categoryId: '', period: 'monthly' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || !formData.categoryId) {
      setError('Please fill in all fields');
      return;
    }

    try {
      let startDate, endDate;

      if (formData.period === 'yearly') {
        startDate = new Date();
        startDate.setMonth(0, 1); // January 1st
        endDate = new Date();
        endDate.setMonth(11, 31); // December 31st
      } else {
        startDate = new Date();
        startDate.setDate(1); // First day of current month
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0); // Last day of current month
      }

      const budgetData = {
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId,
        period: formData.period,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };

      if (selectedBudget) {
        await api.put(`/budgets/${selectedBudget.id}`, budgetData);
        toast.success('Budget updated successfully');
      } else {
        await api.post('/budgets', budgetData);
        toast.success('Budget added successfully');
      }

      handleCloseDialog();
      fetchBudgets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save budget');
    }
  };

  const handleDelete = async (budgetId) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    try {
      await api.delete(`/budgets/${budgetId}`);
      toast.success('Budget deleted successfully');
      fetchBudgets();
    } catch (error) {
      toast.error('Failed to delete budget');
    }
  };

  const getCategoryIcon = (categoryName) => {
    return categoryIcons[categoryName] || <CategoryIcon />;
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        background: '#0f172a',
        borderRadius: 2
      }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      p: 3,
      background: '#0f172a',
      borderRadius: 2,
      minHeight: 'calc(100vh - 100px)',
      color: '#f8fafc'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountBalanceWalletIcon
            sx={{
              fontSize: 36,
              color: 'primary.main',
              mr: 2
            }}
          />
          <Typography variant="h4" component="h1" sx={{ color: '#f8fafc', fontWeight: 700 }}>
            Monthly Budgets
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Add Budget
        </Button>
      </Box>

      <Grid container spacing={3}>
        {budgets.map((budget) => (
          <Grid item xs={12} sm={6} md={4} key={budget.id}>
            <BudgetCard sx={{ background: '#1e293b', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getCategoryIcon(budget.category.name)}
                  </ListItemIcon>
                  <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                    {budget.category.name}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(budget)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(budget.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500, display: 'block', mb: 0.5 }}>
                  Budget Amount
                </Typography>
                <BudgetAmount>
                  ${parseFloat(budget.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </BudgetAmount>
              </Box>

              <Box sx={{ mb: 2 }}>
                <SpentText>
                  Spent: ${budget.spent.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </SpentText>
                <ProgressBar
                  variant="determinate"
                  value={Math.min(budget.percentageUsed, 100)}
                />
              </Box>

              <RemainingText negative={budget.remaining < 0}>
                Remaining: ${budget.remaining < 0 ? '-' : ''}${Math.abs(budget.remaining).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </RemainingText>
            </BudgetCard>
          </Grid>
        ))}
      </Grid>

      {/* Budget Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1e293b',
            color: '#f8fafc'
          }
        }}
      >
        <DialogTitle sx={{ color: '#f8fafc' }}>
          {selectedBudget ? 'Edit Budget' : 'Add New Budget'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <FormControl fullWidth sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1e293b',
                borderRadius: 2,
                border: '1px solid #475569',
                '&:hover': {
                  borderColor: '#64748b'
                },
                '&.Mui-focused': {
                  borderColor: '#3b82f6',
                  boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#cbd5e1'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#3b82f6'
              },
              '& .MuiSelect-select': {
                color: '#f8fafc'
              },
              '& .MuiMenuItem-root': {
                color: '#f8fafc'
              }
            }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                label="Category"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: '#1e293b',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      '& .MuiMenuItem-root': {
                        py: 1.5,
                        px: 2,
                        color: '#f8fafc'
                      }
                    }
                  }
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#f8fafc',
                    '&:hover': {
                      bgcolor: 'rgba(59, 130, 246, 0.15)'
                    },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(59, 130, 246, 0.2)'
                    }
                  }}>
                    <ListItemIcon sx={{ color: 'primary.main', minWidth: 36 }}>
                      {getCategoryIcon(category.name)}
                    </ListItemIcon>
                    <ListItemText
                      primary={category.name}
                      primaryTypographyProps={{
                        sx: {
                          fontWeight: 500,
                          color: '#f8fafc'
                        }
                      }}
                      secondary={category.description}
                      secondaryTypographyProps={{
                        sx: {
                          fontSize: '0.75rem',
                          color: '#cbd5e1'
                        }
                      }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1e293b',
                borderRadius: 2,
                border: '1px solid #475569',
                '&:hover': {
                  borderColor: '#64748b'
                },
                '&.Mui-focused': {
                  borderColor: '#3b82f6',
                  boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#cbd5e1'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#3b82f6'
              },
              '& .MuiSelect-select': {
                color: '#f8fafc'
              }
            }}>
              <InputLabel>Period</InputLabel>
              <Select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                label="Period"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: '#1e293b',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      '& .MuiMenuItem-root': {
                        color: '#f8fafc',
                        '&:hover': {
                          bgcolor: 'rgba(59, 130, 246, 0.15)'
                        },
                        '&.Mui-selected': {
                          bgcolor: 'rgba(59, 130, 246, 0.2)'
                        }
                      }
                    }
                  }
                }}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: '#cbd5e1' }}>$</Typography>,
              }}
              inputProps={{ min: "0", step: "0.01" }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#1e293b',
                  borderRadius: 2,
                  border: '1px solid #475569',
                  '&:hover': {
                    borderColor: '#64748b'
                  },
                  '&.Mui-focused': {
                    borderColor: '#3b82f6',
                    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#cbd5e1'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#3b82f6'
                },
                '& .MuiOutlinedInput-input': {
                  color: '#f8fafc'
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedBudget ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MonthlyBudget; 