import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import Analytics from './components/Analytics';
import NewExpense from './components/NewExpense';
import MonthlyBudget from './components/MonthlyBudget';
import notificationService from './services/notificationService';
import EditExpense from './components/EditExpense';

function App() {
  useEffect(() => {
    notificationService.start();
    return () => {
      notificationService.stop();
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="App">
            <Navigation />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
              <Route path="/expenses/new" element={<PrivateRoute><NewExpense /></PrivateRoute>} />
              <Route path="/expenses/edit/:id" element={<PrivateRoute><EditExpense /></PrivateRoute>} />
              <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
              <Route path="/budgets" element={<PrivateRoute><MonthlyBudget /></PrivateRoute>} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              toastStyle={{
                backgroundColor: '#282850',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                borderRadius: '8px'
              }}
              progressStyle={{
                background: 'linear-gradient(to right, #5c6bc0, #42a5f5)'
              }}
              closeButton={false}
            />
          </div>
        </ThemeProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
