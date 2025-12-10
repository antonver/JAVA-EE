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
  Autocomplete,
  Chip,
} from '@mui/material';
import api from '../services/api';

function ComposanteDialog({ open, composante, onClose, onSave }) {
  const [formData, setFormData] = useState({
    acronyme: '',
    nom: '',
    responsable: '',
  });
  const [selectedBatiments, setSelectedBatiments] = useState([]);
  const [batiments, setBatiments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBatiments, setLoadingBatiments] = useState(false);

  useEffect(() => {
    if (open) {
      loadBatiments();
      if (composante) {
        setFormData({
          acronyme: composante.acronyme || '',
          nom: composante.nom || '',
          responsable: composante.responsable || '',
        });
        // Charger les bâtiments associés
        setSelectedBatiments(composante.batimentList || []);
      } else {
        setFormData({
          acronyme: '',
          nom: '',
          responsable: '',
        });
        setSelectedBatiments([]);
      }
    }
  }, [composante, open]);

  const loadBatiments = async () => {
    setLoadingBatiments(true);
    try {
      const response = await api.get('/admin/data/batiments');
      setBatiments(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Erreur chargement bâtiments:', err);
    } finally {
      setLoadingBatiments(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        batimentCodes: selectedBatiments.map(b => b.codeB),
      };

      if (composante) {
        // Update
        await api.patch(`/composantes/${composante.acronyme}`, payload);
      } else {
        // Create
        await api.post('/composantes', payload);
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
              disabled={!!composante}
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
            <Autocomplete
              multiple
              options={batiments}
              getOptionLabel={(option) => option.codeB || ''}
              value={selectedBatiments}
              onChange={(event, newValue) => setSelectedBatiments(newValue)}
              loading={loadingBatiments}
              isOptionEqualToValue={(option, value) => option.codeB === value.codeB}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.codeB}
                    {...getTagProps({ index })}
                    key={option.codeB}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Bâtiments"
                  helperText="Sélectionnez les bâtiments utilisés par cette composante"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingBatiments ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
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
