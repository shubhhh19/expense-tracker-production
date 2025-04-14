import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Line } from 'react-chartjs-2';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  background: '#ffffff',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  background: '#ffffff',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    monthlyExpenses: 0,
    monthlyBudget: 0,
    totalBudget: 0,
    recentExpenses: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to view dashboard');
          return;
        }
        
        // Get dashboard data and budgets in parallel
        const [dashboardResponse, budgetsResponse] = await Promise.all([
          api.get('/dashboard'),
          api.get('/budgets')
        ]);

        if (dashboardResponse.data.success) {
          const dashboardData = dashboardResponse.data.data;
          
          // Calculate total budget from budgets if available
          if (budgetsResponse.data.success && budgetsResponse.data.data) {
            const budgets = budgetsResponse.data.data;
            
            // Calculate total budget from all active budgets
            // Filter for active budgets (where current date is between start and end dates)
            const today = new Date();
            const activeBudgets = budgets.filter(budget => {
              const startDate = new Date(budget.startDate);
              const endDate = new Date(budget.endDate);
              return today >= startDate && today <= endDate;
            });
            
            // Sum up the amounts from all active budgets
            const calculatedTotalBudget = activeBudgets.reduce((total, budget) => {
              return total + (parseFloat(budget.amount) || 0);
            }, 0);
            
            dashboardData.totalBudget = calculatedTotalBudget;
          } else if (!dashboardData.totalBudget) {
            // Fallback if no budgets or totalBudget not provided
            dashboardData.totalBudget = dashboardData.monthlyBudget;
          }
          
          setStats(dashboardData);
        } else {
          toast.error(dashboardResponse.data.message || 'Failed to fetch dashboard data');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = {
    labels: Array.isArray(stats.recentExpenses)
      ? stats.recentExpenses.map(expense =>
        new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      )
      : [],
    datasets: [
      {
        label: 'Daily Expenses',
        data: Array.isArray(stats.recentExpenses)
          ? stats.recentExpenses.map(expense => expense.amount)
          : [],
        fill: false,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333333',
          font: {
            weight: 'bold'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Amount: $${context.parsed.y.toLocaleString()}`;
          },
          title: function (context) {
            return context[0].label;
          }
        }
      },
      title: {
        display: true,
        text: 'Expense Trend',
        color: '#333333',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)',
          color: '#333333',
        },
        ticks: {
          color: '#555555',
          callback: function (value) {
            return '$' + value.toLocaleString();
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          color: '#333333',
        },
        ticks: {
          color: '#555555'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const budgetProgress = (stats.monthlyExpenses / stats.monthlyBudget) * 100;
  const isOverBudget = budgetProgress > 100;

  return (
    <Box sx={{
      p: 3,
      background: 'linear-gradient(145deg, #16213e 0%, #1a1a2e 100%)',
      borderRadius: 2,
      minHeight: 'calc(100vh - 100px)',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          color: '#ffffff', 
          fontWeight: 600,
          backgroundImage: 'linear-gradient(45deg, #5c6bc0, #42a5f5)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Dashboard
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard sx={{ 
            background: '#282850', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' 
          }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h6" color="#d0d0d0" fontWeight={500}>
                Total Expenses
              </Typography>
              <Typography variant="h4" color="#ffffff" fontWeight={600}>
                ${stats.totalExpenses.toLocaleString()}
              </Typography>
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard sx={{ 
            background: '#282850', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' 
          }}>
            <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />
            <Box>
              <Typography variant="h6" color="#d0d0d0" fontWeight={500}>
                Total Budget
              </Typography>
              <Typography variant="h4" color="#ffffff" fontWeight={600}>
                ${stats.totalBudget ? stats.totalBudget.toLocaleString() : (stats.monthlyBudget * 12).toLocaleString()}
              </Typography>
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard sx={{ 
            background: '#282850', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' 
          }}>
            <TrendingDownIcon
              sx={{
                fontSize: 40,
                color: isOverBudget ? 'error.main' : 'success.main'
              }}
            />
            <Box>
              <Typography variant="h6" color="#d0d0d0" fontWeight={500}>
                Monthly Expenses
              </Typography>
              <Typography
                variant="h4"
                color={isOverBudget ? 'error.main' : '#ffffff'}
                fontWeight={600}
              >
                ${stats.monthlyExpenses.toLocaleString()}
              </Typography>
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={12}>
          <StyledPaper sx={{ 
            background: '#282850', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' 
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', fontWeight: 600 }}>
              Expense Trend
            </Typography>
            <Box sx={{ height: 400 }}>
              <Line data={chartData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    ...chartOptions.plugins.legend,
                    labels: {
                      ...chartOptions.plugins.legend.labels,
                      color: '#ffffff'
                    }
                  },
                  title: {
                    ...chartOptions.plugins.title,
                    color: '#ffffff'
                  }
                },
                scales: {
                  ...chartOptions.scales,
                  y: {
                    ...chartOptions.scales.y,
                    title: {
                      ...chartOptions.scales.y.title,
                      color: '#ffffff'
                    },
                    ticks: {
                      ...chartOptions.scales.y.ticks,
                      color: '#d0d0d0'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  },
                  x: {
                    ...chartOptions.scales.x,
                    title: {
                      ...chartOptions.scales.x.title,
                      color: '#ffffff'
                    },
                    ticks: {
                      ...chartOptions.scales.x.ticks,
                      color: '#d0d0d0'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  }
                }
              }} />
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 