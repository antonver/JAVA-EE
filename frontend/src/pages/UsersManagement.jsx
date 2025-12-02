import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import api from '../services/api';

const ROLES = ['GESTIONNAIRE', 'ENSEIGNANT', 'ETUDIANT'];

const ROLE_COLORS = {
  GESTIONNAIRE: 'error',
  ENSEIGNANT: 'primary',
  ETUDIANT: 'default',
};

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Edit dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  
  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      // Utiliser le nouveau endpoint admin
      const response = await api.get('/admin/users');
      const usersData = response.data;
      console.log('📦 Users loaded:', usersData);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (user) => {
    setEditingUser(user);
    setNewRole(user.role?.name || user.role);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingUser(null);
    setNewRole('');
  };

  const handleSaveRole = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser le nouveau endpoint pour changer le rôle
      await api.patch(`/admin/users/${editingUser.id}/role`, {
        role: newRole
      });
      
      setSuccess(`Rôle de ${editingUser.fullName} changé en ${newRole}`);
      handleCloseEditDialog();
      await loadUsers();
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de la mise à jour du rôle');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser le nouveau endpoint admin
      await api.delete(`/admin/users/${userToDelete.id}`);
      
      setSuccess(`Utilisateur ${userToDelete.fullName} supprimé`);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      await loadUsers();
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gestion des Utilisateurs
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadUsers}
          variant="outlined"
        >
          Actualiser
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom complet</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Date création</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">Aucun utilisateur trouvé</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => {
                  // Extraire l'ID depuis _links.self.href si id n'est pas disponible
                  const userId = user.id || user._links?.self?.href?.split('/').pop() || index;
                  const userRole = user.role?.name || user.role || 'N/A';
                  
                  return (
                    <TableRow key={`user-${userId}`}>
                      <TableCell>{userId}</TableCell>
                      <TableCell>{user.fullName || 'N/A'}</TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={userRole}
                          color={ROLE_COLORS[userRole] || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditRole({ ...user, id: userId })}
                          title="Changer le rôle"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick({ ...user, id: userId })}
                          title="Supprimer l'utilisateur"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog: Edit Role */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Changer le rôle de l'utilisateur</DialogTitle>
        <DialogContent>
          {editingUser && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Utilisateur:</strong> {editingUser.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {editingUser.email}
              </Typography>
              
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel>Nouveau rôle</InputLabel>
                <Select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  label="Nouveau rôle"
                >
                  {ROLES.map((role) => (
                    <MenuItem key={role} value={role}>
                      <Chip
                        label={role}
                        color={ROLE_COLORS[role] || 'default'}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Alert severity="info" sx={{ mt: 2 }}>
                <strong>Rôles disponibles:</strong>
                <ul style={{ marginTop: 8, marginBottom: 0 }}>
                  <li><strong>GESTIONNAIRE:</strong> Accès complet (Administration)</li>
                  <li><strong>ENSEIGNANT:</strong> Réservation des salles</li>
                  <li><strong>ETUDIANT:</strong> Consultation uniquement</li>
                </ul>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Annuler</Button>
          <Button
            onClick={handleSaveRole}
            variant="contained"
            disabled={!newRole || loading}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Delete Confirmation */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          {userToDelete && (
            <Alert severity="warning">
              Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userToDelete.fullName}</strong> ?
              <br />
              Cette action est irréversible.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default UsersManagement;

