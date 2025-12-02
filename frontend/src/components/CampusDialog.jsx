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

function CampusDialog({ open, onClose, campus, onSave }) {
  const [formData, setFormData] = useState({
    nomC: '',
    ville: '',
    universiteNom: '',
  });
  const [universites, setUniversites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUniversite, setSelectedUniversite] = useState(null);

  useEffect(() => {
    if (open) {
      loadUniversites();
      if (campus) {
        setFormData({
          nomC: campus.nomC || '',
          ville: campus.ville || '',
          universiteNom: campus.universite?.nom || '',
        });
        setSelectedUniversite(campus.universite);
      } else {
        setFormData({
          nomC: '',
          ville: '',
          universiteNom: '',
        });
        setSelectedUniversite(null);
      }
    }
  }, [open, campus]);

  const loadUniversites = async () => {
    try {
      // Utiliser l'endpoint admin pour obtenir les données complètes
      const response = await api.get('/admin/data/universites');
      console.log('📦 Universités chargées pour dropdown:', response.data);
      setUniversites(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Erreur chargement universités:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        nomC: formData.nomC,
        ville: formData.ville,
        universite: formData.universiteNom ? `/universites/${formData.universiteNom}` : null
      };

      if (campus) {
        // Update
        await api.patch(`/campus/${campus.nomC}`, data);
      } else {
        // Create
        await api.post('/campus', data);
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
          {campus ? 'Modifier le campus' : 'Créer un campus'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nom"
            value={formData.nomC}
            onChange={(e) => setFormData({ ...formData, nomC: e.target.value })}
            margin="normal"
            required
            disabled={!!campus}
          />
          <TextField
            fullWidth
            label="Ville"
            value={formData.ville}
            onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
            margin="normal"
            required
          />
          <Autocomplete
            fullWidth
            options={universites}
            getOptionLabel={(option) => option.nom || ''}
            value={selectedUniversite}
            onChange={(e, newValue) => {
              setSelectedUniversite(newValue);
              setFormData({ ...formData, universiteNom: newValue?.nom || '' });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Université"
                margin="normal"
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

export default CampusDialog;

