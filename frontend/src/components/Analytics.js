import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Alert,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import api from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    monthlyTrends: [],
    categoryPatterns: [],
    budgetAnalysis: [],
  });
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalTransactions: 0,
    averageExpense: 0,
    topCategory: { name: '', amount: 0 },
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view analytics');
        return;
      }

      // Set date range parameters for API calls
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 12);
      const startDateStr = startDate.toISOString().split('T')[0];

      const [monthlyTrends, summaryResponse, budgetAnalysis] = await Promise.all([
        api.get('/analytics/trend', { params: { months: 12 } }),
        api.get('/analytics/summary', { params: { startDate: startDateStr, endDate } }),
        api.get('/analytics/budget-analysis', { params: { startDate: startDateStr, endDate } })
      ]);

      // Process and set data
      if (monthlyTrends.data.success &&
        summaryResponse.data.success &&
        budgetAnalysis.data.success) {

        // Calculate additional summary statistics
        const summaryData = summaryResponse.data.data;
        const categoryPatterns = summaryData.expensesByCategory || {};

        // Find top category
        let topCategory = { name: '', amount: 0 };
        Object.entries(categoryPatterns).forEach(([name, amount]) => {
          if (amount > topCategory.amount) {
            topCategory = { name, amount };
          }
        });

        // Set state
        setData({
          monthlyTrends: monthlyTrends.data.data || [],
          categoryPatterns,
          budgetAnalysis: budgetAnalysis.data.data || [],
        });

        setSummary({
          totalExpenses: summaryData.totalExpenses || 0,
          totalTransactions: summaryData.totalTransactions || 0,
          averageExpense: summaryData.totalExpenses / Math.max(1, summaryData.totalTransactions),
          topCategory,
        });
      } else {
        toast.error('Failed to fetch analytics data');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        background: '#f5f0e8',
        borderRadius: 2
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // eslint-disable-next-line no-unused-vars
  const monthlyTrendsData = {
    labels: Array.isArray(data.monthlyTrends)
      ? data.monthlyTrends.map(item =>
        new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      )
      : [],
    datasets: [
      {
        label: 'Monthly Expenses',
        data: Array.isArray(data.monthlyTrends)
          ? data.monthlyTrends.map(item => item.total)
          : [],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        tension: 0.1,
        fill: true,
      },
    ],
  };

  // eslint-disable-next-line no-unused-vars
  const monthlyTrendsOptions = {
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
            return `Expenses: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
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
          text: 'Month',
          color: '#333333',
        },
        ticks: {
          color: '#555555'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  const categoryPatternsData = {
    labels: data.categoryPatterns && typeof data.categoryPatterns === 'object'
      ? Object.keys(data.categoryPatterns)
      : [],
    datasets: [
      {
        label: 'Expenses by Category',
        data: data.categoryPatterns && typeof data.categoryPatterns === 'object'
          ? Object.values(data.categoryPatterns)
          : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const categoryPatternsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  const budgetAnalysisData = {
    labels: Array.isArray(data.budgetAnalysis)
      ? data.budgetAnalysis.map(item => item.category)
      : [],
    datasets: [
      {
        label: 'Budget Amount',
        data: Array.isArray(data.budgetAnalysis)
          ? data.budgetAnalysis.map(item => item.budgetedAmount)
          : [],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'Actual Spending',
        data: Array.isArray(data.budgetAnalysis)
          ? data.budgetAnalysis.map(item => item.actualSpent)
          : [],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
    ],
  };

  const budgetAnalysisOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: $${value.toLocaleString()}`;
          },
          afterBody: function (context) {
            const index = context[0].dataIndex;
            if (Array.isArray(data.budgetAnalysis) && data.budgetAnalysis[index]) {
              const item = data.budgetAnalysis[index];
              const percentage = item.percentageUsed.toFixed(1);
              const remaining = item.remainingAmount.toFixed(2);
              return [
                `Percentage Used: ${percentage}%`,
                `Remaining: $${remaining}`
              ];
            }
            return [];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Category'
        }
      }
    }
  };

  // Generate textual summaries
  const generateMonthlyTrendsSummary = () => {
    if (!Array.isArray(data.monthlyTrends) || data.monthlyTrends.length === 0) {
      return "No monthly expense data available.";
    }

    const latestMonth = data.monthlyTrends[data.monthlyTrends.length - 1];
    const previousMonth = data.monthlyTrends[data.monthlyTrends.length - 2];

    if (!latestMonth || !previousMonth) {
      return `Current month expenses: $${latestMonth?.total.toLocaleString() || 0}`;
    }

    const change = latestMonth.total - previousMonth.total;
    const percentChange = ((change / previousMonth.total) * 100).toFixed(1);
    const direction = change >= 0 ? 'increased' : 'decreased';

    return `Your expenses have ${direction} by ${Math.abs(percentChange)}% compared to last month. Current month expenses: $${latestMonth.total.toLocaleString()}`;
  };

  const generateCategoryPatternsSummary = () => {
    if (!data.categoryPatterns || Object.keys(data.categoryPatterns).length === 0) {
      return "No category data available.";
    }

    if (summary.topCategory.name) {
      const percentage = ((summary.topCategory.amount / summary.totalExpenses) * 100).toFixed(1);
      return `Your highest spending category is ${summary.topCategory.name} at $${summary.topCategory.amount.toLocaleString()} (${percentage}% of total expenses).`;
    }

    return "Explore your spending distribution across different categories.";
  };

  const generateBudgetAnalysisSummary = () => {
    if (!Array.isArray(data.budgetAnalysis) || data.budgetAnalysis.length === 0) {
      return "No budget data available. Set up budgets to track your spending.";
    }

    const overBudgetItems = data.budgetAnalysis.filter(item => item.percentageUsed > 100);

    if (overBudgetItems.length > 0) {
      const categories = overBudgetItems.map(item => item.category).join(', ');
      return `You are over budget in ${overBudgetItems.length} categories: ${categories}. Consider adjusting your spending in these areas.`;
    }

    return "You're staying within budget across all categories. Keep up the good work!";
  };

  return (
    <Box sx={{
      p: 3,
      background: 'linear-gradient(145deg, #16213e 0%, #1a1a2e 100%)',
      borderRadius: 2,
      minHeight: 'calc(100vh - 100px)',
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        color: '#ffffff', 
        fontWeight: 600,
        mb: 2,
        backgroundImage: 'linear-gradient(45deg, #5c6bc0, #42a5f5)',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Analytics Dashboard
      </Typography>

      {/* Main Analytics Introduction */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Your Financial Overview
        </Typography>
        <Typography variant="body2" paragraph>
          This dashboard shows your spending habits and budget management. Use these insights to make informed financial decisions.
        </Typography>
      </Paper>

      {/* Summary Cards */}
      <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
        Key Metrics
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 2, 
            height: '100%',
            background: '#282850', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' 
          }}>
            <Typography variant="h6" sx={{ mb: 1, color: '#ffffff', fontWeight: 600, fontSize: '1rem' }}>Monthly Trends</Typography>
            <Box sx={{ height: 180 }}>
              <Bar
                data={monthlyTrendsData}
                options={{
                  ...monthlyTrendsOptions,
                  maintainAspectRatio: false,
                  plugins: {
                    ...monthlyTrendsOptions.plugins,
                    legend: {
                      ...monthlyTrendsOptions.plugins.legend,
                      display: false,
                      labels: {
                        ...monthlyTrendsOptions.plugins.legend.labels,
                        color: '#ffffff'
                      }
                    }
                  },
                  scales: {
                    ...monthlyTrendsOptions.scales,
                    y: {
                      ...monthlyTrendsOptions.scales.y,
                      title: {
                        ...monthlyTrendsOptions.scales.y.title,
                        color: '#ffffff',
                        display: false
                      },
                      ticks: {
                        ...monthlyTrendsOptions.scales.y.ticks,
                        color: '#d0d0d0'
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      }
                    },
                    x: {
                      ...monthlyTrendsOptions.scales.x,
                      title: {
                        ...monthlyTrendsOptions.scales.x.title,
                        color: '#ffffff',
                        display: false
                      },
                      ticks: {
                        ...monthlyTrendsOptions.scales.x.ticks,
                        color: '#d0d0d0'
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 2, 
            height: '100%',
            background: '#282850', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' 
          }}>
            <Typography variant="h6" sx={{ mb: 1, color: '#ffffff', fontWeight: 600, fontSize: '1rem' }}>Category Patterns</Typography>
            <Box sx={{ height: 180 }}>
              <Doughnut
                data={categoryPatternsData}
                options={{
                  ...categoryPatternsOptions,
                  maintainAspectRatio: false,
                  plugins: {
                    ...categoryPatternsOptions.plugins,
                    legend: {
                      ...categoryPatternsOptions.plugins.legend,
                      position: 'right',
                      labels: {
                        ...categoryPatternsOptions.plugins.legend.labels,
                        color: '#ffffff',
                        padding: 10,
                        font: {
                          size: 9
                        }
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 2, 
            height: '100%',
            background: '#282850', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' 
          }}>
            <Typography variant="h6" sx={{ mb: 1, color: '#ffffff', fontWeight: 600, fontSize: '1rem' }}>Budget Analysis</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', height: 180 }}>
              <Bar
                data={budgetAnalysisData}
                options={{
                  ...budgetAnalysisOptions,
                  maintainAspectRatio: false,
                  plugins: {
                    ...budgetAnalysisOptions.plugins,
                    legend: {
                      ...budgetAnalysisOptions.plugins.legend,
                      display: false,
                      labels: {
                        ...budgetAnalysisOptions.plugins.legend.labels,
                        color: '#ffffff'
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 2,
            background: '#282850', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' 
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ffffff', fontWeight: 600, fontSize: '1rem' }}>Spending Summary</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  p: 1, 
                  bgcolor: 'rgba(92, 107, 192, 0.1)', 
                  borderRadius: 2,
                  border: '1px solid rgba(92, 107, 192, 0.2)'
                }}>
                  <Typography color="#d0d0d0" variant="subtitle2">Total Expenses</Typography>
                  <Typography color="#ffffff" variant="h6">${summary.totalExpenses.toLocaleString()}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  p: 1, 
                  bgcolor: 'rgba(92, 107, 192, 0.1)', 
                  borderRadius: 2,
                  border: '1px solid rgba(92, 107, 192, 0.2)'
                }}>
                  <Typography color="#d0d0d0" variant="subtitle2">Average Expense</Typography>
                  <Typography color="#ffffff" variant="h6">${summary.averageExpense.toFixed(2)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  p: 1, 
                  bgcolor: 'rgba(92, 107, 192, 0.1)', 
                  borderRadius: 2,
                  border: '1px solid rgba(92, 107, 192, 0.2)'
                }}>
                  <Typography color="#d0d0d0" variant="subtitle2">Top Category</Typography>
                  <Typography color="#ffffff" variant="h6">{summary.topCategory.name || 'None'}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Analytics;