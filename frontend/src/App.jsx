import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Lessons from './pages/Lessons';
import Admin from './pages/Admin';
import UsersManagement from './pages/UsersManagement';
import Layout from './components/Layout';
import './App.css';

// ============================================
// Premium Industrial Glass Theme
// ============================================
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b8ff00', // Acid Lime
      light: '#d4ff4d',
      dark: '#8fcc00',
      contrastText: '#050505',
    },
    secondary: {
      main: '#00d4ff', // Ice Blue (for subtle accents)
      light: '#4de0ff',
      dark: '#00a3cc',
      contrastText: '#050505',
    },
    background: {
      default: '#050505', // Deep Onyx
      paper: '#0a0a0a',   // Carbon
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.25)',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    error: {
      main: '#ff4757',
    },
    warning: {
      main: '#ffb800',
    },
    success: {
      main: '#00ff9d',
    },
    info: {
      main: '#00d4ff',
    },
  },
  typography: {
    fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '0.015em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0.04em',
      textTransform: 'none',
    },
    caption: {
      letterSpacing: '0.03em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    // ========== Global CssBaseline ==========
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#050505',
        },
      },
    },
    // ========== Buttons - Flat panel switches ==========
    MuiButton: {
      defaultProps: {
        disableRipple: true, // Kill ripple effect
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          },
        },
        contained: {
          background: 'rgba(184, 255, 0, 0.15)',
          color: '#b8ff00',
          border: '1px solid rgba(184, 255, 0, 0.3)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
          '&:hover': {
            background: 'rgba(184, 255, 0, 0.25)',
            borderColor: 'rgba(184, 255, 0, 0.5)',
            boxShadow: '0 0 20px rgba(184, 255, 0, 0.2)',
          },
          '&:active': {
            background: 'rgba(184, 255, 0, 0.35)',
          },
          '&.Mui-disabled': {
            background: 'rgba(255, 255, 255, 0.04)',
            color: 'rgba(255, 255, 255, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            borderColor: 'rgba(184, 255, 0, 0.4)',
            color: '#b8ff00',
            background: 'rgba(184, 255, 0, 0.05)',
          },
        },
        text: {
          color: 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            color: '#b8ff00',
            background: 'rgba(184, 255, 0, 0.05)',
          },
        },
      },
    },
    // ========== Paper/Cards - Glass panels ==========
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 24px rgba(0,0,0,0.4)',
        },
      },
    },
    // ========== Cards ==========
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        },
      },
    },
    // ========== AppBar ==========
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(5, 5, 5, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: 'none',
        },
      },
    },
    // ========== Text Fields ==========
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 8,
            transition: 'all 200ms',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.08)',
              transition: 'all 200ms',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.15)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#b8ff00',
              borderWidth: '1px',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(184, 255, 0, 0.1)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.5)',
            '&.Mui-focused': {
              color: '#b8ff00',
            },
          },
        },
      },
    },
    // ========== Tabs ==========
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
        indicator: {
          backgroundColor: '#b8ff00',
          height: 2,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9rem',
          letterSpacing: '0.02em',
          color: 'rgba(255, 255, 255, 0.6)',
          transition: 'all 200ms',
          '&:hover': {
            color: 'rgba(255, 255, 255, 0.9)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
          },
          '&.Mui-selected': {
            color: '#b8ff00',
          },
        },
      },
    },
    // ========== Table ==========
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 150ms',
          '&:hover': {
            backgroundColor: 'rgba(184, 255, 0, 0.02) !important',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          padding: '16px',
        },
      },
    },
    // ========== Chips ==========
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          letterSpacing: '0.02em',
        },
        filled: {
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
        colorPrimary: {
          backgroundColor: 'rgba(184, 255, 0, 0.15)',
          color: '#b8ff00',
        },
        colorSecondary: {
          backgroundColor: 'rgba(0, 212, 255, 0.15)',
          color: '#00d4ff',
        },
        colorError: {
          backgroundColor: 'rgba(255, 71, 87, 0.15)',
          color: '#ff4757',
        },
        colorSuccess: {
          backgroundColor: 'rgba(0, 255, 157, 0.15)',
          color: '#00ff9d',
        },
      },
    },
    // ========== Dialogs ==========
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          fontWeight: 600,
          letterSpacing: '0.01em',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '20px 24px',
        },
      },
    },
    // ========== Alert ==========
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backdropFilter: 'blur(10px)',
        },
        standardError: {
          backgroundColor: 'rgba(255, 71, 87, 0.1)',
          border: '1px solid rgba(255, 71, 87, 0.2)',
          color: '#ff6b7a',
        },
        standardSuccess: {
          backgroundColor: 'rgba(0, 255, 157, 0.1)',
          border: '1px solid rgba(0, 255, 157, 0.2)',
          color: '#33ffb1',
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 184, 0, 0.1)',
          border: '1px solid rgba(255, 184, 0, 0.2)',
          color: '#ffc433',
        },
        standardInfo: {
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          color: '#33ddff',
        },
      },
    },
    // ========== Avatar ==========
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(184, 255, 0, 0.15)',
          color: '#b8ff00',
          border: '1px solid rgba(184, 255, 0, 0.3)',
        },
      },
    },
    // ========== Divider ==========
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.06)',
        },
      },
    },
    // ========== Menu ==========
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          transition: 'all 150ms',
          '&:hover': {
            backgroundColor: 'rgba(184, 255, 0, 0.05)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(184, 255, 0, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(184, 255, 0, 0.15)',
            },
          },
        },
      },
    },
    // ========== Drawer ==========
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(5, 5, 5, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        },
      },
    },
    // ========== IconButton ==========
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 200ms',
          '&:hover': {
            backgroundColor: 'rgba(184, 255, 0, 0.1)',
            color: '#b8ff00',
          },
        },
      },
    },
    // ========== CircularProgress ==========
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#b8ff00',
        },
      },
    },
    // ========== Tooltip ==========
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(20, 20, 20, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.8rem',
          fontWeight: 400,
          padding: '8px 12px',
          borderRadius: 6,
        },
      },
    },
    // ========== ListItemButton ==========
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          transition: 'all 150ms',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(184, 255, 0, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(184, 255, 0, 0.15)',
            },
            '& .MuiListItemIcon-root': {
              color: '#b8ff00',
            },
            '& .MuiListItemText-primary': {
              color: '#b8ff00',
            },
          },
        },
      },
    },
    // ========== Select ==========
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.08)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.15)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#b8ff00',
            borderWidth: '1px',
          },
        },
      },
    },
  },
});

// Компонент для защищенных маршрутов
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Компонент для админ-маршрутов (только GESTIONNAIRE)
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== 'GESTIONNAIRE') {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Компонент для публичных маршрутов (для неавторизованных)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return !isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Публичные маршруты */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Защищенные маршруты с Layout */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            {/* Вложенные маршруты используют Outlet */}
            <Route index element={<Home />} />
            <Route path="lessons" element={<Lessons />} />
            <Route path="profile" element={<Profile />} />
            <Route 
              path="admin" 
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              } 
            />
            <Route 
              path="users" 
              element={
                <AdminRoute>
                  <UsersManagement />
                </AdminRoute>
              } 
            />
          </Route>

          {/* Перенаправление на главную */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
