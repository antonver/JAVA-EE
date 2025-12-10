import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { loginUser, clearError } from '../store/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ============================================
  // Styles for the Login page - Premium Industrial Glass
  // ============================================
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: '#050505',
    position: 'relative',
    overflow: 'hidden',
    // Subtle radial gradient for depth
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '600px',
      height: '600px',
      background: 'radial-gradient(circle, rgba(184, 255, 0, 0.03) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
  };

  const glassCardStyle = {
    p: { xs: 4, md: 5 },
    width: '100%',
    maxWidth: 420,
    borderRadius: 3,
    bgcolor: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: `
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 25px 50px -12px rgba(0, 0, 0, 0.5)
    `,
    position: 'relative',
    // Top accent line
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '15%',
      right: '15%',
      height: '2px',
      background: 'linear-gradient(90deg, transparent, #b8ff00, transparent)',
      borderRadius: '0 0 2px 2px',
    },
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: 'rgba(255, 255, 255, 0.02)',
      borderRadius: 2,
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.08)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.15)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#b8ff00',
        borderWidth: '1px',
      },
      '&.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(184, 255, 0, 0.08)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.5)',
      '&.Mui-focused': {
        color: '#b8ff00',
      },
    },
    '& .MuiInputBase-input': {
      color: 'rgba(255, 255, 255, 0.9)',
    },
  };

  const submitButtonStyle = {
    mt: 4,
    mb: 2,
    py: 1.75,
    bgcolor: 'rgba(184, 255, 0, 0.12)',
    color: '#b8ff00',
    border: '1px solid rgba(184, 255, 0, 0.3)',
    borderRadius: 2,
    fontWeight: 600,
    letterSpacing: '0.05em',
    fontSize: '0.95rem',
    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      bgcolor: 'rgba(184, 255, 0, 0.2)',
      borderColor: 'rgba(184, 255, 0, 0.5)',
      boxShadow: '0 0 30px rgba(184, 255, 0, 0.2)',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&.Mui-disabled': {
      bgcolor: 'rgba(255, 255, 255, 0.04)',
      color: 'rgba(255, 255, 255, 0.25)',
      borderColor: 'rgba(255, 255, 255, 0.06)',
    },
  };

  return (
    <Box sx={containerStyle}>
      {/* Background grid pattern for industrial feel */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={0} sx={glassCardStyle}>
          {/* Header section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            {/* Icon with glow effect */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(184, 255, 0, 0.08)',
                border: '1px solid rgba(184, 255, 0, 0.2)',
                mb: 3,
                boxShadow: '0 0 30px rgba(184, 255, 0, 0.1)',
              }}
            >
              <LoginIcon sx={{ fontSize: 32, color: '#b8ff00' }} />
            </Box>
            
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                letterSpacing: '0.02em',
                color: 'rgba(255, 255, 255, 0.95)',
                mb: 1,
              }}
            >
              Connexion
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.5)',
                letterSpacing: '0.03em',
              }}
            >
              Entrez vos identifiants
            </Typography>
          </Box>

          {/* Error alert */}
          {error && (
            <Alert 
              severity="error" 
              onClose={() => dispatch(clearError())}
              sx={{ 
                mb: 3,
                bgcolor: 'rgba(255, 71, 87, 0.1)',
                border: '1px solid rgba(255, 71, 87, 0.2)',
                color: '#ff6b7a',
                '& .MuiAlert-icon': {
                  color: '#ff4757',
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Login form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              sx={inputStyle}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              sx={inputStyle}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.4)',
                        '&:hover': {
                          color: '#b8ff00',
                          bgcolor: 'rgba(184, 255, 0, 0.08)',
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableRipple
              disabled={isLoading}
              sx={submitButtonStyle}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: '#b8ff00' }} />
              ) : (
                'Se connecter'
              )}
            </Button>
            
            {/* Register link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography 
                variant="body2" 
                sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                Pas de compte ?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#b8ff00',
                    fontWeight: 500,
                    transition: 'opacity 200ms',
                  }}
                >
                  S'inscrire
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Bottom decorative element */}
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {[...Array(3)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                bgcolor: i === 1 ? '#b8ff00' : 'rgba(255, 255, 255, 0.2)',
                boxShadow: i === 1 ? '0 0 8px rgba(184, 255, 0, 0.5)' : 'none',
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Login;

