import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  AdminPanelSettings,
  Home as HomeIcon,
  School as SchoolIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';
import logo from '../assets/logo.png';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Éléments de navigation
  const navigationItems = [
    { title: 'Accueil', path: '/', icon: <HomeIcon /> },
  ];

  // Ajout de "Cours" seulement pour les enseignants (pas GESTIONNAIRE)
  if (user?.role === 'ENSEIGNANT') {
    navigationItems.push({
      title: 'Cours',
      path: '/lessons',
      icon: <SchoolIcon />,
    });
  }

  // Ajout des éléments admin si l'utilisateur est GESTIONNAIRE
  if (user?.role === 'GESTIONNAIRE') {
    navigationItems.push({
      title: 'Utilisateurs',
      path: '/users',
      icon: <PeopleIcon />,
    });
    navigationItems.push({
      title: 'Administration',
      path: '/admin',
      icon: <AdminPanelSettings />,
    });
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleCloseUserMenu();
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // ============================================
  // Mobile Drawer - Glass panel design
  // ============================================
  const drawer = (
    <Box 
      onClick={handleDrawerToggle} 
      sx={{ 
        textAlign: 'center',
        height: '100%',
        background: 'linear-gradient(180deg, rgba(10,10,10,0.98) 0%, rgba(5,5,5,0.99) 100%)',
      }}
    >
      {/* Logo section with subtle glow */}
      <Box 
        sx={{ 
          my: 3, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -16,
            left: '20%',
            right: '20%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(184,255,0,0.3), transparent)',
          }
        }}
      >
        <img src={logo} alt="Logo" style={{ height: '40px', filter: 'brightness(1.1)' }} />
      </Box>
      <Divider sx={{ opacity: 0.1 }} />
      
      {/* Navigation items */}
      <List sx={{ mt: 2, px: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                transition: 'all 200ms',
                '&:hover': {
                  bgcolor: 'rgba(184, 255, 0, 0.05)',
                },
                '&.Mui-selected': {
                  bgcolor: 'rgba(184, 255, 0, 0.1)',
                  borderLeft: '2px solid #b8ff00',
                  '& .MuiListItemIcon-root': {
                    color: '#b8ff00',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#b8ff00',
                    fontWeight: 600,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.6)', minWidth: 44 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.title} 
                sx={{ 
                  '& .MuiTypography-root': { 
                    letterSpacing: '0.02em',
                    fontWeight: 500,
                  } 
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // ============================================
  // Styles for navigation buttons
  // ============================================
  const navButtonStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    gap: 1,
    px: 2.5,
    py: 1.25,
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.02em',
    borderRadius: 2,
    border: '1px solid transparent',
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    '&:hover': {
      color: '#b8ff00',
      bgcolor: 'rgba(184, 255, 0, 0.05)',
      borderColor: 'rgba(184, 255, 0, 0.15)',
    },
  };

  const navButtonActiveStyle = {
    ...navButtonStyle,
    color: '#b8ff00',
    bgcolor: 'rgba(184, 255, 0, 0.08)',
    borderColor: 'rgba(184, 255, 0, 0.2)',
    boxShadow: '0 0 15px rgba(184, 255, 0, 0.1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: -1,
      left: '20%',
      right: '20%',
      height: '2px',
      bgcolor: '#b8ff00',
      borderRadius: '2px 2px 0 0',
    },
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: '#050505',
    }}>
      {/* ============================================
          AppBar - Glass panel with subtle glow
          ============================================ */}
      <AppBar 
        position="sticky" 
        sx={{
          bgcolor: 'rgba(5, 5, 5, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  mr: 2,
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    color: '#b8ff00',
                    bgcolor: 'rgba(184, 255, 0, 0.1)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo - left aligned with glow effect on hover */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 300ms',
                '&:hover': {
                  filter: 'brightness(1.2)',
                },
              }}
              onClick={() => navigate('/')}
            >
              <img 
                src={logo} 
                alt="Université de Montpellier" 
                style={{ 
                  height: '38px',
                  filter: 'brightness(1.05)',
                }} 
              />
            </Box>

            {/* Desktop navigation - centered */}
            {!isMobile && (
              <Box sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
              }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    disableRipple
                    sx={location.pathname === item.path ? navButtonActiveStyle : navButtonStyle}
                  >
                    {item.icon}
                    {item.title}
                  </Button>
                ))}
              </Box>
            )}

            {isMobile && <Box sx={{ flexGrow: 1 }} />}

            {/* User info section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!isMobile && user && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-end',
                  mr: 1,
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500, 
                      color: 'rgba(255, 255, 255, 0.9)',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {user.fullName}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#b8ff00',
                      opacity: 0.8,
                      letterSpacing: '0.05em',
                      fontSize: '0.7rem',
                    }}
                  >
                    {user.role}
                  </Typography>
                </Box>
              )}

              {/* Avatar with accent glow */}
              <Tooltip title="Profil">
                <IconButton 
                  onClick={handleOpenUserMenu} 
                  sx={{ 
                    p: 0,
                    '&:hover': {
                      '& .MuiAvatar-root': {
                        boxShadow: '0 0 20px rgba(184, 255, 0, 0.3)',
                        borderColor: 'rgba(184, 255, 0, 0.5)',
                      },
                    },
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 40,
                      height: 40,
                      bgcolor: 'rgba(184, 255, 0, 0.15)',
                      color: '#b8ff00',
                      border: '1px solid rgba(184, 255, 0, 0.3)',
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 200ms',
                    }}
                  >
                    {user?.fullName?.charAt(0) || <AccountCircle />}
                  </Avatar>
                </IconButton>
              </Tooltip>

              {/* User menu dropdown */}
              <Menu
                sx={{ mt: '50px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  sx: {
                    bgcolor: 'rgba(10, 10, 10, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                    minWidth: 200,
                    '& .MuiMenuItem-root': {
                      py: 1.5,
                      px: 2,
                    },
                  },
                }}
              >
                {isMobile && user && (
                  <MenuItem disabled sx={{ opacity: '1 !important' }}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {user.fullName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                )}
                {isMobile && <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 1 }} />}
                
                <MenuItem 
                  onClick={() => { handleNavigate('/profile'); handleCloseUserMenu(); }}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(184, 255, 0, 0.05)',
                      '& .MuiListItemIcon-root': { color: '#b8ff00' },
                      '& .MuiTypography-root': { color: '#b8ff00' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>Profil</Typography>
                </MenuItem>
                
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 1 }} />
                
                <MenuItem 
                  onClick={handleLogout}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(255, 71, 87, 0.08)',
                      '& .MuiListItemIcon-root': { color: '#ff4757' },
                      '& .MuiTypography-root': { color: '#ff4757' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>Déconnexion</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ============================================
          Mobile Drawer
          ============================================ */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 260,
            bgcolor: 'rgba(5, 5, 5, 0.98)',
            borderRight: '1px solid rgba(255, 255, 255, 0.04)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* ============================================
          Main Content Area
          ============================================ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          px: { xs: 2, md: 3 },
          bgcolor: '#050505',
          position: 'relative',
          // Subtle gradient overlay for depth
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(180deg, rgba(184, 255, 0, 0.02) 0%, transparent 100%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Outlet />
        </Container>
      </Box>

      {/* ============================================
          Footer - Minimal industrial design
          ============================================ */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          bgcolor: '#020202',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          position: 'relative',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.35)',
                letterSpacing: '0.05em',
                fontSize: '0.7rem',
              }}
            >
              © 2025 Université de Montpellier
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box 
                sx={{ 
                  width: 6, 
                  height: 6, 
                  borderRadius: '50%', 
                  bgcolor: '#00ff9d',
                  boxShadow: '0 0 8px rgba(0, 255, 157, 0.5)',
                }} 
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.03em',
                  fontSize: '0.7rem',
                }}
              >
                Système actif
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;

