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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import api from '../services/api';

const TYPE_SALLE = ['amphi', 'sc', 'td', 'tp', 'numerique'];

function SalleDialog({ open, onClose, salle, onSave }) {
  const [formData, setFormData] = useState({
    numS: '',
    capacite: '',
    typeS: '',
    etage: '',
    acces: 'non',
    batimentCodeB: '',
  });
  const [batiments, setBatiments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBatiment, setSelectedBatiment] = useState(null);

  useEffect(() => {
    if (open) {
      loadBatiments();
      if (salle) {
        setFormData({
          numS: salle.numS || '',
          capacite: salle.capacite || '',
          typeS: salle.typeS || '',
          etage: salle.etage || '',
          acces: salle.acces || 'non',
          batimentCodeB: salle.batiment?.codeB || '',
        });
        setSelectedBatiment(salle.batiment);
      } else {
        setFormData({
          numS: '',
          capacite: '',
          typeS: '',
          etage: '',
          acces: 'non',
          batimentCodeB: '',
        });
        setSelectedBatiment(null);
      }
    }
  }, [open, salle]);

  const loadBatiments = async () => {
    try {
      // Utiliser l'endpoint admin pour obtenir les données complètes
      const response = await api.get('/admin/data/batiments');
      console.log('📦 Bâtiments chargés pour dropdown:', response.data);
      setBatiments(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Erreur chargement bâtiments:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        numS: formData.numS,
        capacite: parseInt(formData.capacite),
        typeS: formData.typeS,
        etage: formData.etage,
        acces: formData.acces,
        batimentCodeB: formData.batimentCodeB || null
      };

      if (salle) {
        // Update
        await api.patch(`/salles/${salle.numS}`, data);
      } else {
        // Create
        await api.post('/salles', data);
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
          {salle ? 'Modifier la salle' : 'Créer une salle'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Numéro"
            value={formData.numS}
            onChange={(e) => setFormData({ ...formData, numS: e.target.value })}
            margin="normal"
            required
            disabled={!!salle}
          />
          <TextField
            fullWidth
            label="Capacité"
            type="number"
            value={formData.capacite}
            onChange={(e) => setFormData({ ...formData, capacite: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.typeS}
              onChange={(e) => setFormData({ ...formData, typeS: e.target.value })}
              label="Type"
            >
              {TYPE_SALLE.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Étage"
            value={formData.etage}
            onChange={(e) => setFormData({ ...formData, etage: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Accès PMR</InputLabel>
            <Select
              value={formData.acces}
              onChange={(e) => setFormData({ ...formData, acces: e.target.value })}
              label="Accès PMR"
            >
              <MenuItem value="oui">Oui</MenuItem>
              <MenuItem value="non">Non</MenuItem>
            </Select>
          </FormControl>
          <Autocomplete
            fullWidth
            options={batiments}
            getOptionLabel={(option) => option.codeB || ''}
            value={selectedBatiment}
            onChange={(e, newValue) => {
              setSelectedBatiment(newValue);
              setFormData({ ...formData, batimentCodeB: newValue?.codeB || '' });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Bâtiment"
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

export default SalleDialog;

