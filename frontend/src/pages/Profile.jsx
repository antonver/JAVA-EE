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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Profil utilisateur
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Consultez et modifiez les informations de votre profil
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleOpenDialog}
        >
          Modifier le profil
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Informations principales */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '3rem',
              }}
            >
              {user?.fullName?.charAt(0)}
            </Avatar>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {user?.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.email}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip
                label={user?.role}
                color={user?.role === 'GESTIONNAIRE' ? 'error' : 'primary'}
                icon={<AdminPanelSettings />}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Informations détaillées */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Informations détaillées
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Person sx={{ color: 'primary.main', fontSize: 28 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Nom complet
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {user?.fullName}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Email sx={{ color: 'primary.main', fontSize: 28 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Adresse email
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {user?.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AdminPanelSettings sx={{ color: 'primary.main', fontSize: 28 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Rôle dans le système
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {user?.role}
                  </Typography>
                </Box>
              </Box>

              {user?.exp && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccessTime sx={{ color: 'warning.main', fontSize: 28 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Token valide jusqu'au
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {new Date(user.exp * 1000).toLocaleString('fr-FR')}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="body2" color="info.dark">
                <strong>💡 Information:</strong> Toutes les données sont automatiquement extraites du token JWT.
                Le token est stocké dans localStorage et automatiquement ajouté à chaque requête.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog de modification du profil */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le profil</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
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
            />
            
            <TextField
              fullWidth
              label="Email"
              value={user?.email}
              margin="normal"
              disabled
              helperText="L'email ne peut pas être modifié"
            />
            
            <TextField
              fullWidth
              label="Rôle"
              value={user?.role}
              margin="normal"
              disabled
              helperText="Le rôle ne peut pas être modifié"
            />
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={loading}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
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
