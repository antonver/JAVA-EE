import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import api from '../services/api';

function BatimentDialog({ open, onClose, batiment, onSave }) {
  const [formData, setFormData] = useState({
    codeB: '',
    anneeC: '',
    latitude: '',
    longitude: '',
    campusNomC: '',
  });
  const [campus, setCampus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState(null);

  useEffect(() => {
    if (open) {
      loadCampus();
      if (batiment) {
        setFormData({
          codeB: batiment.codeB || '',
          anneeC: batiment.anneeC || '',
          latitude: batiment.latitude || '',
          longitude: batiment.longitude || '',
          campusNomC: batiment.campus?.nomC || '',
        });
        setSelectedCampus(batiment.campus);
      } else {
        setFormData({
          codeB: '',
          anneeC: '',
          latitude: '',
          longitude: '',
          campusNomC: '',
        });
        setSelectedCampus(null);
      }
    }
  }, [open, batiment]);

  const loadCampus = async () => {
    try {
      // Utiliser l'endpoint admin pour obtenir les données complètes
      const response = await api.get('/admin/data/campus');
      console.log('📦 Campus chargés pour dropdown:', response.data);
      setCampus(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Erreur chargement campus:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        codeB: formData.codeB,
        anneeC: parseInt(formData.anneeC),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        campus: formData.campusNomC ? `/campus/${formData.campusNomC}` : null
      };

      if (batiment) {
        // Update
        await api.patch(`/batiments/${batiment.codeB}`, data);
      } else {
        // Create
        await api.post('/batiments', data);
      }
      
      onSave();
      onClose();
    } catch (err) {
      console.error('Erreur complète:', err);
      console.error('Response:', err.response?.data);
      alert(err.response?.data?.message || err.response?.data || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {batiment ? 'Modifier le bâtiment' : 'Créer un bâtiment'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Code"
            value={formData.codeB}
            onChange={(e) => setFormData({ ...formData, codeB: e.target.value })}
            margin="normal"
            required
            disabled={!!batiment}
          />
          <TextField
            fullWidth
            label="Année de construction"
            type="number"
            value={formData.anneeC}
            onChange={(e) => setFormData({ ...formData, anneeC: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Latitude"
            type="number"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            margin="normal"
            required
            inputProps={{ step: 'any' }}
          />
          <TextField
            fullWidth
            label="Longitude"
            type="number"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            margin="normal"
            required
            inputProps={{ step: 'any' }}
          />
          <Autocomplete
            fullWidth
            options={campus}
            getOptionLabel={(option) => option.nomC || ''}
            value={selectedCampus}
            onChange={(e, newValue) => {
              setSelectedCampus(newValue);
              setFormData({ ...formData, campusNomC: newValue?.nomC || '' });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Campus"
                margin="normal"
                required
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Enregistrer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default BatimentDialog;

