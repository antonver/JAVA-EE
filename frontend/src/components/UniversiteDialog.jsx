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

function UniversiteDialog({ open, universite, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nom: '',
    acronyme: '',
    creation: '',
    presidence: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (universite) {
      setFormData({
        nom: universite.nom || '',
        acronyme: universite.acronyme || '',
        creation: universite.creation?.toString() || '',
        presidence: universite.presidence || '',
      });
    } else {
      setFormData({
        nom: '',
        acronyme: '',
        creation: '',
        presidence: '',
      });
    }
  }, [universite, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        nom: formData.nom,
        acronyme: formData.acronyme,
        creation: parseInt(formData.creation),
        presidence: formData.presidence,
      };

      if (universite) {
        // Update
        await api.patch(`/universites/${universite.nom}`, data);
      } else {
        // Create
        await api.post('/universites', data);
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
          {universite ? 'Modifier l\'université' : 'Ajouter une université'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="nom"
              label="Nom"
              value={formData.nom}
              onChange={handleChange}
              required
              disabled={!!universite} // Nom is the ID, cannot be changed
              helperText="Ex: Université de Montpellier"
            />
            <TextField
              name="acronyme"
              label="Acronyme"
              value={formData.acronyme}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 20 }}
              helperText="Ex: UM, UPV"
            />
            <TextField
              name="creation"
              label="Année de création"
              type="number"
              value={formData.creation}
              onChange={handleChange}
              required
              inputProps={{ min: 1000, max: 2100 }}
              helperText="Ex: 2015"
            />
            <TextField
              name="presidence"
              label="Présidence"
              value={formData.presidence}
              onChange={handleChange}
              required
              helperText="Nom du président"
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
            {universite ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default UniversiteDialog;

