import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Drawer
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { NavLink } from 'react-router-dom';

function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleMobileMenu = (event) => {
    setMobileMenuOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    handleClose();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Expenses', icon: <ReceiptIcon />, path: '/expenses' },
    { text: 'Budgets', icon: <AccountBalanceWalletIcon />, path: '/budgets' },
    { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
  ];

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  // Only show navigation if user is logged in
  if (!user) {
    return null;
  }

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#0f172a', 
        color: '#ffffff',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' 
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, color: '#ffffff' }}
          onClick={handleMobileMenu}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#ffffff' }}>
          Expense Tracker
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2, flexGrow: 1 }}>
          {menuItems.map((item) => (
            <Button
              key={item.text}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                color: '#ffffff'
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>

        <Box>
          <IconButton
            onClick={handleMenu}
            color="inherit"
            edge="end"
            aria-label="account"
            aria-haspopup="true"
          >
            <Avatar sx={{ bgcolor: '#3b82f6', color: '#ffffff' }}>
              {user ? user.firstName?.charAt(0).toUpperCase() || 'U' : 'U'}
            </Avatar>
          </IconButton>
        </Box>

        {/* Desktop Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              mt: 1.5,
              borderRadius: 2,
              minWidth: 180,
              backgroundColor: '#1e293b',
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1,
                gap: 2,
                color: '#ffffff'
              },
            },
          }}
        >
          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ color: '#ffffff' }} />
            Logout
          </MenuItem>
        </Menu>

        {/* Mobile Menu */}
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={handleMobileMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: '#1e293b',
              width: 250,
            }
          }}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.text}
              component={NavLink}
              to={item.path}
              onClick={handleMobileMenuClose}
              sx={{
                color: '#ffffff',
                '&.active': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#3b82f6',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  style: { color: '#ffffff' }
                }}
              />
            </MenuItem>
          ))}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation; 