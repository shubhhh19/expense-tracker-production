import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  TablePagination,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
import { useNavigate } from 'react-router-dom';
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
  'Other': <MoreHorizIcon />
};

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(8, 0, 0, 0.05)',
  '& .MuiTableCell-head': {
    backgroundColor: '#ffffff',
    fontWeight: 600,
    color: '#333333',
    borderBottom: '2px solid #000000'
  },
  '& .MuiTableRow-root': {
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  '& .MuiTableCell-body': {
    color: '#ffffff',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
}));

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view expenses');
        return;
      }
      const response = await api.get('/expenses');
      if (response.data.success) {
        setExpenses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleMenuClick = (event, expense) => {
    setAnchorEl(event.currentTarget);
    setSelectedExpense(expense);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedExpense(null);
  };

  const handleEdit = () => {
    navigate(`/expenses/edit/${selectedExpense.id}`);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await api.delete(`/expenses/${selectedExpense.id}`);
      
      if (response.data.success) {
        toast.success('Expense deleted successfully');
        await fetchExpenses();
      } else {
        toast.error('Failed to delete expense: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error(error.response?.data?.message || 'Failed to delete expense. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedExpense(null);
      setLoading(false);
    }
  };

  // Get the icon for a category
  const getCategoryIcon = (categoryName) => {
    return categoryIcons[categoryName] || <MoreHorizIcon />;
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.description.toLowerCase().includes(search.toLowerCase()) ||
    expense.category.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      p: 3,
      background: 'linear-gradient(145deg, #16213e 0%, #1a1a2e 100%)',
      borderRadius: 2,
      minHeight: 'calc(100vh - 100px)',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ 
          color: '#ffffff', 
          fontWeight: 600,
          backgroundImage: 'linear-gradient(45deg, #5c6bc0, #42a5f5)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Expenses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/expenses/new')}
          sx={{ 
            borderRadius: 2,
            background: 'linear-gradient(45deg, #5c6bc0, #42a5f5)',
            boxShadow: '0 4px 10px rgba(92, 107, 192, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #3949ab, #0077c2)',
              boxShadow: '0 6px 15px rgba(92, 107, 192, 0.4)',
            }
          }}
        >
          Add Expense
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ color: '#d0d0d0', mb: 1, fontWeight: 500 }}>
          Search by description or category
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search expenses..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 500,
            '& .MuiOutlinedInput-root': {
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease-in-out',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.3)'
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
                borderColor: '#5c6bc0'
              }
            },
            '& .MuiOutlinedInput-input': {
              padding: '12px 14px',
              color: '#ffffff'
            }
          }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress sx={{ color: '#5c6bc0' }} />
        </Box>
      ) : filteredExpenses.length === 0 ? (
        <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center', background: 'rgba(255, 255, 255, 0.05)' }}>
          <Typography variant="h6" color="#ffffff">
            No expenses found
          </Typography>
          <Typography variant="body2" color="#d0d0d0" sx={{ mt: 1 }}>
            {search ? 'Try a different search term' : 'Add your first expense to get started'}
          </Typography>
        </Paper>
      ) : (
        <>
          <StyledTableContainer component={Paper} sx={{ 
            background: '#282850', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#ffffff', py: 2, backgroundColor: 'rgba(92, 107, 192, 0.2)' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#ffffff', py: 2, backgroundColor: 'rgba(92, 107, 192, 0.2)' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#ffffff', py: 2, backgroundColor: 'rgba(92, 107, 192, 0.2)' }}>Category</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#ffffff', py: 2, backgroundColor: 'rgba(92, 107, 192, 0.2)' }}>Amount</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#ffffff', py: 2, backgroundColor: 'rgba(92, 107, 192, 0.2)' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExpenses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((expense) => (
                    <TableRow key={expense.id} sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: 'rgba(255, 255, 255, 0.03)'
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(92, 107, 192, 0.1)'
                      },
                      '&:last-child td, &:last-child th': {
                        borderBottom: 0
                      },
                      transition: 'background-color 0.2s ease'
                    }}>
                      <TableCell sx={{ color: '#ffffff', py: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        {new Date(expense.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ color: '#ffffff', py: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>{expense.description}</TableCell>
                      <TableCell sx={{ py: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ListItemIcon sx={{ minWidth: 36, color: '#5c6bc0' }}>
                            {getCategoryIcon(expense.category.name)}
                          </ListItemIcon>
                          <Typography variant="body2" sx={{ color: '#ffffff' }}>
                            {expense.category.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 500, py: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        ${parseFloat(expense.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <IconButton
                          size="small"
                          aria-label="edit"
                          onClick={() => {
                            navigate(`/expenses/edit/${expense.id}`);
                          }}
                          sx={{ 
                            mr: 1, 
                            backgroundColor: 'rgba(66, 165, 245, 0.15)',
                            color: '#42a5f5',
                            '&:hover': {
                              backgroundColor: 'rgba(66, 165, 245, 0.25)',
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          aria-label="delete"
                          onClick={(e) => {
                            setSelectedExpense(expense);
                            setDeleteDialogOpen(true);
                          }}
                          sx={{ 
                            backgroundColor: 'rgba(244, 67, 54, 0.15)',
                            color: '#ff7961',
                            '&:hover': {
                              backgroundColor: 'rgba(244, 67, 54, 0.25)',
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </StyledTableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredExpenses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              backgroundColor: '#282850',
              borderRadius: '0 0 12px 12px',
              color: '#ffffff',
              '& .MuiTablePagination-toolbar': {
                color: '#ffffff'
              },
              '& .MuiTablePagination-selectIcon': {
                color: '#ffffff'
              }
            }}
          />
        </>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            backgroundColor: '#282850',
            maxWidth: '400px',
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#ffffff', 
          fontWeight: 600, 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          pb: 2
        }}>
          Delete Expense
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography sx={{ color: '#d0d0d0' }}>
            Are you sure you want to delete the expense <strong>{selectedExpense?.description}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: '#a0a0a0', mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            sx={{ 
              borderRadius: 2,
              color: '#d0d0d0',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained" 
            disabled={loading}
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)'
              }
            }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Expenses; 