import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#5C9EFF',
      main: '#2196F3',
      dark: '#1976D2',
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: '#FF6B9D',
      main: '#FF4081',
      dark: '#E91E63',
      contrastText: '#FFFFFF',
    },
    error: {
      light: '#FF6B9D',
      main: '#FF4081',
      dark: '#E91E63',
    },
    warning: {
      light: '#FFB74D',
      main: '#FFA726',
      dark: '#F57C00',
    },
    success: {
      light: '#81C784',
      main: '#4CAF50',
      dark: '#388E3C',
    },
    info: {
      light: '#64B5F6',
      main: '#2196F3',
      dark: '#1565C0',
    },
    background: {
      default: '#0F0F0F',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.38)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#FFFFFF',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#FFFFFF',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: 'rgba(255, 255, 255, 0.9)',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1A1A1A, #151515)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(33, 150, 243, 0.2)',
            borderColor: 'rgba(33, 150, 243, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #2196F3, #1565C0)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1565C0, #0D47A1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#FFFFFF',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});

export const DESIGN_TOKENS = {
  colors: {
    primary: '#2196F3',
    secondary: '#FF4081',
    accent: '#4CAF50',
    background: {
      dark: '#0F0F0F',
      medium: '#1A1A1A',
      light: '#252525',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #2196F3, #1565C0)',
      secondary: 'linear-gradient(135deg, #FF4081, #E91E63)',
      success: 'linear-gradient(135deg, #4CAF50, #388E3C)',
      background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    glow: '0 8px 32px rgba(33, 150, 243, 0.3)',
    hover: '0 12px 48px rgba(0, 0, 0, 0.4)',
  },
};
