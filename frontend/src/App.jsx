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

// Создаем тему MUI (темная, соответствует index.css)
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b8ff00', // Acid Lime из index.css
    },
    secondary: {
      main: '#00d4ff',
    },
    background: {
      default: '#050505', // --bg-onyx
      paper: '#111111', // --bg-graphite
    },
  },
  typography: {
    fontFamily: [
      'Outfit',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.08)',
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
