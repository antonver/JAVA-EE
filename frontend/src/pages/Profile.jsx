import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Grid,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Email,
  AdminPanelSettings,
  AccessTime,
  Edit as EditIcon,
} from '@mui/icons-material';
import { updateProfile } from '../services/api';
import { login } from '../store/slices/authSlice';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleOpenDialog = () => {
    setFullName(user?.fullName || '');
    setError(null);
    setSuccess(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      setError('Le nom complet est obligatoire');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Отправляем обновление на сервер
      const response = await updateProfile({ fullName });
      
      // Обновляем Redux store с новым токеном
      dispatch(login({ token: response.token }));
      
      setSuccess(true);
      
      // Закрываем диалог через 1 секунду
      setTimeout(() => {
        handleCloseDialog();
      }, 1000);
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Styles - Premium Industrial Glass
  // ============================================
  const glassCardStyle = {
    p: 4,
    borderRadius: 3,
    bgcolor: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 4px 24px rgba(0, 0, 0, 0.4)',
  };

  const infoRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 2.5,
    p: 2,
    borderRadius: 2,
    transition: 'all 200ms',
    '&:hover': {
      bgcolor: 'rgba(184, 255, 0, 0.02)',
    },
  };

  const iconBoxStyle = {
    width: 44,
    height: 44,
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'rgba(184, 255, 0, 0.08)',
    border: '1px solid rgba(184, 255, 0, 0.15)',
  };

  return (
    <Box>
      {/* Header section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2,
      }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600, 
              letterSpacing: '0.02em',
              color: 'rgba(255, 255, 255, 0.95)',
              mb: 1,
            }}
          >
            Profil utilisateur
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            Consultez et modifiez les informations de votre profil
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleOpenDialog}
          disableRipple
          sx={{
            bgcolor: 'rgba(184, 255, 0, 0.12)',
            color: '#b8ff00',
            border: '1px solid rgba(184, 255, 0, 0.3)',
            fontWeight: 600,
            letterSpacing: '0.03em',
            '&:hover': {
              bgcolor: 'rgba(184, 255, 0, 0.2)',
              borderColor: 'rgba(184, 255, 0, 0.5)',
              boxShadow: '0 0 20px rgba(184, 255, 0, 0.15)',
            },
          }}
        >
          Modifier le profil
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Profile card - left side */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              ...glassCardStyle, 
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '25%',
                right: '25%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #b8ff00, transparent)',
              },
            }}
          >
            {/* Avatar with glow */}
            <Avatar
              sx={{
                width: 100,
                height: 100,
                margin: '0 auto',
                mb: 3,
                bgcolor: 'rgba(184, 255, 0, 0.1)',
                color: '#b8ff00',
                fontSize: '2.5rem',
                fontWeight: 600,
                border: '2px solid rgba(184, 255, 0, 0.3)',
                boxShadow: '0 0 30px rgba(184, 255, 0, 0.15)',
              }}
            >
              {user?.fullName?.charAt(0)}
            </Avatar>
            
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                color: 'rgba(255, 255, 255, 0.95)',
                letterSpacing: '0.01em',
                mb: 1,
              }}
            >
              {user?.fullName}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 3 }}
            >
              {user?.email}
            </Typography>
            
            {/* Role chip */}
            <Chip
              label={user?.role}
              icon={<AdminPanelSettings sx={{ color: 'inherit !important' }} />}
              sx={{
                bgcolor: user?.role === 'GESTIONNAIRE' 
                  ? 'rgba(255, 71, 87, 0.15)' 
                  : 'rgba(184, 255, 0, 0.15)',
                color: user?.role === 'GESTIONNAIRE' ? '#ff4757' : '#b8ff00',
                border: user?.role === 'GESTIONNAIRE'
                  ? '1px solid rgba(255, 71, 87, 0.3)'
                  : '1px solid rgba(184, 255, 0, 0.3)',
                fontWeight: 600,
                letterSpacing: '0.05em',
                px: 1,
              }}
            />
          </Paper>
        </Grid>

        {/* Details card - right side */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={glassCardStyle}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                letterSpacing: '0.02em',
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 1,
              }}
            >
              Informations détaillées
            </Typography>
            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.06)' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Name row */}
              <Box sx={infoRowStyle}>
                <Box sx={iconBoxStyle}>
                  <Person sx={{ color: '#b8ff00', fontSize: 22 }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ color: 'rgba(255, 255, 255, 0.4)', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.65rem' }}
                  >
                    Nom complet
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                    {user?.fullName}
                  </Typography>
                </Box>
              </Box>

              {/* Email row */}
              <Box sx={infoRowStyle}>
                <Box sx={iconBoxStyle}>
                  <Email sx={{ color: '#b8ff00', fontSize: 22 }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ color: 'rgba(255, 255, 255, 0.4)', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.65rem' }}
                  >
                    Adresse email
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                    {user?.email}
                  </Typography>
                </Box>
              </Box>

              {/* Role row */}
              <Box sx={infoRowStyle}>
                <Box sx={iconBoxStyle}>
                  <AdminPanelSettings sx={{ color: '#b8ff00', fontSize: 22 }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ color: 'rgba(255, 255, 255, 0.4)', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.65rem' }}
                  >
                    Rôle dans le système
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                    {user?.role}
                  </Typography>
                </Box>
              </Box>

              {/* Token expiry row */}
              {user?.exp && (
                <Box sx={infoRowStyle}>
                  <Box sx={{ ...iconBoxStyle, bgcolor: 'rgba(255, 184, 0, 0.1)', borderColor: 'rgba(255, 184, 0, 0.2)' }}>
                    <AccessTime sx={{ color: '#ffb800', fontSize: 22 }} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ color: 'rgba(255, 255, 255, 0.4)', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.65rem' }}
                    >
                      Token valide jusqu'au
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                      {new Date(user.exp * 1000).toLocaleString('fr-FR')}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.06)' }} />

            {/* Info box */}
            <Box 
              sx={{ 
                p: 2.5, 
                bgcolor: 'rgba(0, 212, 255, 0.05)', 
                border: '1px solid rgba(0, 212, 255, 0.15)',
                borderRadius: 2,
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ color: 'rgba(0, 212, 255, 0.9)', fontSize: '0.85rem' }}
              >
                <strong>💡 Information:</strong> Toutes les données sont automatiquement extraites du token JWT.
                Le token est stocké dans localStorage et automatiquement ajouté à chaque requête.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ============================================
          Edit Profile Dialog - Glass style
          ============================================ */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle 
          sx={{ 
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            fontWeight: 600,
            letterSpacing: '0.01em',
          }}
        >
          Modifier le profil
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  bgcolor: 'rgba(255, 71, 87, 0.1)',
                  border: '1px solid rgba(255, 71, 87, 0.2)',
                  color: '#ff6b7a',
                }}
              >
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  bgcolor: 'rgba(0, 255, 157, 0.1)',
                  border: '1px solid rgba(0, 255, 157, 0.2)',
                  color: '#33ffb1',
                }}
              >
                Profil mis à jour avec succès!
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Nom complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              margin="normal"
              placeholder="Ex: Jean Dupont"
              disabled={loading}
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255, 255, 255, 0.02)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                  '&.Mui-focused fieldset': { borderColor: '#b8ff00' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#b8ff00' },
              }}
            />
            
            <TextField
              fullWidth
              label="Email"
              value={user?.email}
              margin="normal"
              disabled
              helperText="L'email ne peut pas être modifié"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255, 255, 255, 0.01)',
                },
                '& .MuiFormHelperText-root': {
                  color: 'rgba(255, 255, 255, 0.35)',
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Rôle"
              value={user?.role}
              margin="normal"
              disabled
              helperText="Le rôle ne peut pas être modifié"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255, 255, 255, 0.01)',
                },
                '& .MuiFormHelperText-root': {
                  color: 'rgba(255, 255, 255, 0.35)',
                },
              }}
            />
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <Button 
              onClick={handleCloseDialog} 
              disabled={loading}
              disableRipple
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                '&:hover': {
                  color: 'rgba(255, 255, 255, 0.9)',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              disableRipple
              startIcon={loading ? <CircularProgress size={18} sx={{ color: '#b8ff00' }} /> : null}
              sx={{
                bgcolor: 'rgba(184, 255, 0, 0.12)',
                color: '#b8ff00',
                border: '1px solid rgba(184, 255, 0, 0.3)',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(184, 255, 0, 0.2)',
                  borderColor: 'rgba(184, 255, 0, 0.5)',
                  boxShadow: '0 0 20px rgba(184, 255, 0, 0.15)',
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(255, 255, 255, 0.04)',
                  color: 'rgba(255, 255, 255, 0.25)',
                  borderColor: 'rgba(255, 255, 255, 0.06)',
                },
              }}
            >
              {loading ? 'Mise à jour...' : 'Enregistrer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Profile;
