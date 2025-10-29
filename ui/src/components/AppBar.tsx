import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  IconButton,
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
import { searchService } from '../services/searchService';

const AppBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      const results = await searchService.search(query);
      // For now, navigate to library with the search query as a parameter
      // In the future, you could create a dedicated SearchResults page
      navigate(`/library?search=${encodeURIComponent(query)}`, { 
        state: { searchResults: results } 
      });
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback: navigate to library without search results
      navigate('/library');
    }
  };

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
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2, md: 3 }, gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <Box
            component="img"
            src={logo}
            alt="Boring Media Co Logo"
            sx={{
              height: { xs: '40px', sm: '50px', md: '60px' },
              width: 'auto',
              filter: 'invert(1) brightness(1.2)',
              mixBlendMode: 'screen',
            }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              letterSpacing: '1px',
              fontSize: { xs: '0.75rem', sm: '1rem', md: '1.25rem' },
              display: { xs: 'none', sm: 'block' }
            }}
          >
            BORING MEDIA CO
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2, flex: 1, maxWidth: '800px', mx: 4 }}>
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
            <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1, fontSize: { xs: 18, sm: 24 } }} />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchQuery);
                }
              }}
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

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
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
                  padding: { xs: '6px 8px', sm: '8px 16px' },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  minWidth: { xs: 'auto', sm: '64px' },
                  '&:hover': {
                    bgcolor: 'rgba(33, 150, 243, 0.2)',
                  },
                }}
              >
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>{label}</Box>
              </Button>
            );
          })}
        </Box>

        {/* Mobile Search Icon */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <IconButton
            onClick={() => {
              // For mobile, could open a search dialog
              handleSearch(searchQuery);
            }}
            sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
