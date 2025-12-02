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

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ height: '40px' }} />
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Мобильное меню */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo - слева */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              <img 
                src={logo} 
                alt="Université de Montpellier" 
                style={{ height: '40px' }} 
              />
            </Box>

            {/* Десктопное меню - по центру */}
            {!isMobile && (
              <Box sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4  // Большое расстояние между элементами
              }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    sx={{
                      color: 'white',
                      display: 'flex',
                      gap: 1,
                      px: 3,  // Больше padding по горизонтали
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 500,
                      borderRadius: 2,
                      backgroundColor:
                        location.pathname === item.path
                          ? 'rgba(255, 255, 255, 0.15)'
                          : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    {item.icon}
                    {item.title}
                  </Button>
                ))}
              </Box>
            )}

            {isMobile && <Box sx={{ flexGrow: 1 }} />}

            {/* Информация о пользователе */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!isMobile && user && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {user.fullName}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {user.role}
                  </Typography>
                </Box>
              )}

              <Tooltip title="Profil">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    {user?.fullName?.charAt(0) || <AccountCircle />}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: '45px' }}
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
              >
                {isMobile && user && (
                  <MenuItem disabled>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {user.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                )}
                {isMobile && <Divider />}
                
                <MenuItem onClick={() => { handleNavigate('/profile'); handleCloseUserMenu(); }}>
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Profil</Typography>
                </MenuItem>
                
                <Divider />
                
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Déconnexion</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Мобильный Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Основной контент */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 Université de Montpellier. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;

