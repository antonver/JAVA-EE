import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import api from '../services/api';

function ComposanteDialog({ open, composante, onClose, onSave }) {
  const [formData, setFormData] = useState({
    acronyme: '',
    nom: '',
    responsable: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (composante) {
      setFormData({
        acronyme: composante.acronyme || '',
        nom: composante.nom || '',
        responsable: composante.responsable || '',
      });
    } else {
      setFormData({
        acronyme: '',
        nom: '',
        responsable: '',
      });
    }
  }, [composante, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (composante) {
        // Update
        await api.patch(`/composantes/${composante.acronyme}`, formData);
      } else {
        // Create
        await api.post('/composantes', formData);
      }
      
      onSave();
      onClose();
    } catch (err) {
      console.error('Erreur:', err);
      alert(err.response?.data?.message || err.response?.data || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {composante ? 'Modifier la composante' : 'Ajouter une composante'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="acronyme"
              label="Acronyme"
              value={formData.acronyme}
              onChange={handleChange}
              required
              disabled={!!composante} // Acronyme is the ID, cannot be changed
              inputProps={{ maxLength: 15 }}
              helperText="Ex: FDS, POLY, MOMA (max 15 caractères)"
            />
            <TextField
              name="nom"
              label="Nom complet"
              value={formData.nom}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 100 }}
              helperText="Ex: Faculté des Sciences"
            />
            <TextField
              name="responsable"
              label="Responsable"
              value={formData.responsable}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 100 }}
              helperText="Nom du responsable"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {composante ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ComposanteDialog;

