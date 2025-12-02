import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  CardActions,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Room as RoomIcon,
  Book as BookIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { createReservation, getMesReservations, deleteReservation, getSalles } from '../services/api';

function Lessons() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    salleNum: '',
    dateDebut: '',
    dateFin: '',
    matiere: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Для autocomplete
  const [salles, setSalles] = useState([]);
  const [loadingSalles, setLoadingSalles] = useState(false);
  const [selectedSalle, setSelectedSalle] = useState(null);
  
  // Для фильтра по дате
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMesReservations();
      console.log('🔍 Резервации получены с бэкенда:', data);
      console.log('🔍 Количество резервация:', data.length);
      setReservations(data);
    } catch (err) {
      console.error('Erreur lors du chargement des réservations:', err);
      setError('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = async () => {
    setOpenDialog(true);
    // Загружаем список залов при открытии dialog
    if (salles.length === 0) {
      try {
        setLoadingSalles(true);
        const data = await getSalles();
        setSalles(data);
      } catch (err) {
        console.error('Erreur lors du chargement des salles:', err);
      } finally {
        setLoadingSalles(false);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      salleNum: '',
      dateDebut: '',
      dateFin: '',
      matiere: ''
    });
    setSelectedSalle(null);
    setError(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Créer la réservation
      await createReservation(formData);
      
      // Recharger la liste
      await loadReservations();
      
      // Fermer le dialog
      handleCloseDialog();
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      // Извлекаем сообщение ошибки из разных форматов
      let errorMessage = 'Erreur lors de la création de la réservation';
      
      if (typeof err.response?.data === 'string') {
        errorMessage = err.response.data;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }
    
    try {
      await deleteReservation(id);
      await loadReservations();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de la réservation');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Функция фильтрации резерваций по выбранной дате
  const filterReservationsByDate = () => {
    if (!filterDate) {
      // Если дата не выбрана, показываем все резервации
      return reservations;
    }

    // Фильтруем резервации по выбранной дате
    return reservations.filter(reservation => {
      const reservationDate = new Date(reservation.dateDebut);
      const selectedDate = new Date(filterDate);
      
      // Сравниваем только год, месяц и день (игнорируем время)
      return (
        reservationDate.getFullYear() === selectedDate.getFullYear() &&
        reservationDate.getMonth() === selectedDate.getMonth() &&
        reservationDate.getDate() === selectedDate.getDate()
      );
    });
  };

  // Получаем отфильтрованный список
  const filteredReservations = filterReservationsByDate();

  // Функция сброса фильтра
  const handleClearFilter = () => {
    setFilterDate('');
  };

  // Extraire l'ID de salle depuis l'URL HATEOAS
  const extractSalleId = (salle) => {
    if (!salle) return '';
    // Spring Data REST возвращает: { _links: { self: { href: ".../salles/36.01" } } }
    const selfLink = salle._links?.self?.href;
    if (selfLink) {
      const parts = selfLink.split('/');
      return decodeURIComponent(parts[parts.length - 1]);
    }
    return '';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Mes Cours
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Réserver une salle
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Фильтр по дате */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          type="date"
          label="Filtrer par date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />
        {filterDate && (
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearFilter}
          >
            Réinitialiser
          </Button>
        )}
        <Typography variant="body2" color="text.secondary">
          {filteredReservations.length} réservation(s) 
          {filterDate && ' pour cette date'}
        </Typography>
      </Box>

      {reservations.length === 0 ? (
        <Alert severity="info">
          Vous n'avez aucune réservation à venir. Cliquez sur "Réserver une salle" pour commencer.
        </Alert>
      ) : filteredReservations.length === 0 ? (
        <Alert severity="info">
          Aucune réservation trouvée pour cette date. 
          <Button size="small" onClick={handleClearFilter} sx={{ ml: 1 }}>
            Voir toutes les réservations
          </Button>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredReservations.map((reservation) => (
            <Grid item xs={12} md={6} key={reservation.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {reservation.matiere}
                    </Typography>
                    <Chip label={reservation.salleNum} color="primary" size="small" />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(reservation.dateDebut)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Fin: {formatDate(reservation.dateFin)}
                    </Typography>
                  </Box>
                  
                  {reservation.batimentCode && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <RoomIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        Bâtiment: {reservation.batimentCode}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BookIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Capacité: {reservation.capacite} places
                    </Typography>
                  </Box>
                </CardContent>
                
                <CardActions>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(reservation.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog pour créer une réservation */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Réserver une salle</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Autocomplete
              fullWidth
              options={salles}
              getOptionLabel={(option) => {
                // Spring Data REST возвращает ID в URL: extractSalleId извлекает его
                const salleNum = option.numS || extractSalleId(option);
                const capacite = option.capacite || '';
                const type = option.typeS || '';
                return `${salleNum} ${type ? `[${type}]` : ''} ${capacite ? `- ${capacite} places` : ''}`;
              }}
              // Уникальный ключ для каждой опции - React использует для рендеринга
              getOptionKey={(option) => {
                return option.numS || extractSalleId(option) || Math.random().toString();
              }}
              // Уникальный ключ для каждой опции (исправляет ошибку дублирующихся ключей)
              isOptionEqualToValue={(option, value) => {
                const optionId = option.numS || extractSalleId(option);
                const valueId = value?.numS || extractSalleId(value);
                return optionId === valueId;
              }}
              value={selectedSalle}
              onChange={(event, newValue) => {
                setSelectedSalle(newValue);
                const salleNum = newValue?.numS || extractSalleId(newValue);
                setFormData({
                  ...formData,
                  salleNum: salleNum || ''
                });
              }}
              loading={loadingSalles}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Salle"
                  required
                  margin="normal"
                  placeholder="Choisissez ou tapez le numéro"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingSalles ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              freeSolo
              onInputChange={(event, newInputValue) => {
                // Разрешаем пользователю ввести вручную
                if (!selectedSalle && newInputValue) {
                  setFormData({
                    ...formData,
                    salleNum: newInputValue
                  });
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Matière"
              name="matiere"
              value={formData.matiere}
              onChange={handleChange}
              required
              margin="normal"
              placeholder="Ex: Mathématiques"
            />
            
            <TextField
              fullWidth
              label="Date de début"
              name="dateDebut"
              type="datetime-local"
              value={formData.dateDebut}
              onChange={handleChange}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              fullWidth
              label="Date de fin"
              name="dateFin"
              type="datetime-local"
              value={formData.dateFin}
              onChange={handleChange}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDialog}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
            >
              {submitting ? 'Création...' : 'Réserver'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}

export default Lessons;

