import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as ProfileIcon,
  CloudUpload as UploadIcon,
  VideoLibrary as LibraryIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import logo from '../assets/bpclogo.png';

const AppBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const navItems = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'Library', path: '/library', icon: LibraryIcon },
    { label: 'Submissions', path: '/submissions', icon: UploadIcon },
    {
      label: 'Profile',
      path: '/profile',
      icon: ProfileIcon,
      badge: itemCount,
    },
  ];

  return (
    <MuiAppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between', px: 3, gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <img
            src={logo}
            alt="Boring Media Co Logo"
            style={{
              height: '60px',
              width: 'auto',
              filter: 'invert(1) brightness(1.2)',
              mixBlendMode: 'screen',
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '1px' }}>
            BORING MEDIA CO
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, maxWidth: '800px', mx: 4 }}>
          {/* Search Bar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              px: 2,
              py: 1,
              flex: 1,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />
            <input
              type="text"
              placeholder="Search videos..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#f5f1e8',
                fontSize: '0.95rem',
                width: '100%',
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map(({ label, path, icon: Icon, badge }) => {
            const isActive = location.pathname === path;
            return (
              <Button
                key={path}
                startIcon={
                  badge ? (
                    <Badge badgeContent={badge} color="error">
                      <Icon />
                    </Badge>
                  ) : (
                    <Icon />
                  )
                }
                onClick={() => navigate(path)}
                variant={isActive ? 'contained' : 'text'}
                sx={{
                  color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
                  bgcolor: isActive ? 'rgba(33, 150, 243, 0.3)' : 'transparent',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(33, 150, 243, 0.2)',
                  },
                }}
              >
                {label}
              </Button>
            );
          })}
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
