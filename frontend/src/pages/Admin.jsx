import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
// Removed unused imports - now using api.get('/admin/data/...')
import { useSelector } from 'react-redux';
import api from '../services/api';
import BatimentDialog from '../components/BatimentDialog';
import CampusDialog from '../components/CampusDialog';
import SalleDialog from '../components/SalleDialog';
import ComposanteDialog from '../components/ComposanteDialog';
import UniversiteDialog from '../components/UniversiteDialog';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Admin() {
  const { user } = useSelector((state) => state.auth);
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data states
  const [batiments, setBatiments] = useState([]);
  const [campus, setCampus] = useState([]);
  const [salles, setSalles] = useState([]);
  const [composantes, setComposantes] = useState([]);
  const [universites, setUniversites] = useState([]);
  
  // Dialog states
  const [batimentDialog, setBatimentDialog] = useState({ open: false, item: null });
  const [campusDialog, setCampusDialog] = useState({ open: false, item: null });
  const [salleDialog, setSalleDialog] = useState({ open: false, item: null });
  const [composanteDialog, setComposanteDialog] = useState({ open: false, item: null });
  const [universiteDialog, setUniversiteDialog] = useState({ open: false, item: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', item: null });
  const [success, setSuccess] = useState(null);
  
  // Проверка доступа
  if (user?.role !== 'GESTIONNAIRE') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Accès refusé. Cette page est réservée aux gestionnaires.
        </Alert>
      </Container>
    );
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const loadBatiments = async () => {
    try {
      setLoading(true);
      // Utiliser le controller admin pour obtenir les données complètes
      const response = await api.get('/admin/data/batiments');
      console.log('📦 Batiments loaded:', response.data);
      setBatiments(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Erreur lors du chargement des bâtiments');
      console.error('❌ Batiments error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCampus = async () => {
    try {
      setLoading(true);
      // Utiliser le controller admin pour obtenir les données complètes
      const response = await api.get('/admin/data/campus');
      console.log('📦 Campus loaded:', response.data);
      setCampus(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('❌ Campus error:', err);
      setError(`Erreur lors du chargement des campus: ${err.response?.status || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadSalles = async () => {
    try {
      setLoading(true);
      // Utiliser le controller admin pour obtenir les données complètes
      const response = await api.get('/admin/data/salles');
      console.log('📦 Salles loaded:', response.data);
      setSalles(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Erreur lors du chargement des salles');
      console.error('❌ Salles error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadComposantes = async () => {
    try {
      setLoading(true);
      // Utiliser le controller admin pour obtenir les données complètes
      const response = await api.get('/admin/data/composantes');
      console.log('📦 Composantes loaded:', response.data);
      setComposantes(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Erreur lors du chargement des composantes');
      console.error('❌ Composantes error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUniversites = async () => {
    try {
      setLoading(true);
      // Utiliser le controller admin pour obtenir les données complètes
      const response = await api.get('/admin/data/universites');
      console.log('📦 Universites loaded:', response.data);
      setUniversites(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Erreur lors du chargement des universités');
      console.error('❌ Universites error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load data based on current tab
    switch (currentTab) {
      case 0:
        loadBatiments();
        break;
      case 1:
        loadCampus();
        break;
      case 2:
        loadSalles();
        break;
      case 3:
        loadComposantes();
        break;
      case 4:
        loadUniversites();
        break;
      default:
        break;
    }
  }, [currentTab]);

  const handleDelete = async () => {
    const { type, item } = deleteDialog;
    try {
      setLoading(true);
      switch (type) {
        case 'batiment':
          await api.delete(`/batiments/${item.codeB}`);
          loadBatiments();
          break;
        case 'campus':
          await api.delete(`/campus/${item.nomC}`);
          loadCampus();
          break;
        case 'salle':
          await api.delete(`/salles/${item.numS}`);
          loadSalles();
          break;
        case 'composante':
          await api.delete(`/composantes/${item.acronyme}`);
          loadComposantes();
          break;
        case 'universite':
          await api.delete(`/universites/${item.nom}`);
          loadUniversites();
          break;
        default:
          break;
      }
      setSuccess('Élément supprimé avec succès');
      setDeleteDialog({ open: false, type: '', item: null });
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Styles - Premium Industrial Glass
  // ============================================
  const glassCardStyle = {
    bgcolor: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 4px 24px rgba(0, 0, 0, 0.4)',
  };

  const actionButtonStyle = {
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
  };

  const secondaryButtonStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    '&:hover': {
      borderColor: 'rgba(184, 255, 0, 0.3)',
      color: '#b8ff00',
      bgcolor: 'rgba(184, 255, 0, 0.05)',
    },
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      {/* Header section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2,
      }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 600, 
              letterSpacing: '0.02em',
              color: 'rgba(255, 255, 255, 0.95)',
              mb: 0.5,
            }}
          >
            Panneau d'Administration
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            Gestion des entités du système universitaire
          </Typography>
        </Box>
        <Chip 
          label="GESTIONNAIRE" 
          sx={{
            bgcolor: 'rgba(255, 71, 87, 0.15)',
            color: '#ff4757',
            border: '1px solid rgba(255, 71, 87, 0.3)',
            fontWeight: 600,
            letterSpacing: '0.05em',
            px: 1,
          }}
        />
      </Box>

      {/* Alerts */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            bgcolor: 'rgba(255, 71, 87, 0.1)',
            border: '1px solid rgba(255, 71, 87, 0.2)',
            color: '#ff6b7a',
            borderRadius: 2,
          }} 
          onClose={() => setError(null)}
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
            borderRadius: 2,
          }} 
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {/* Tabs navigation */}
      <Paper 
        sx={{ 
          width: '100%', 
          mb: 3,
          borderRadius: 2,
          ...glassCardStyle,
        }}
      >
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange} 
          aria-label="admin tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              bgcolor: '#b8ff00',
              height: 2,
            },
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 500,
              letterSpacing: '0.02em',
              textTransform: 'none',
              minHeight: 56,
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.8)',
                bgcolor: 'rgba(255, 255, 255, 0.02)',
              },
              '&.Mui-selected': {
                color: '#b8ff00',
              },
            },
          }}
        >
          <Tab label="Bâtiments" />
          <Tab label="Campus" />
          <Tab label="Salles" />
          <Tab label="Composantes" />
          <Tab label="Universités" />
        </Tabs>
      </Paper>

      {/* Bâtiments Tab */}
      <TabPanel value={currentTab} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ fontWeight: 600, letterSpacing: '0.01em', color: 'rgba(255, 255, 255, 0.9)' }}
          >
            Gestion des Bâtiments
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<RefreshIcon />}
              onClick={loadBatiments}
              disableRipple
              variant="outlined"
              sx={secondaryButtonStyle}
            >
              Actualiser
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setBatimentDialog({ open: true, item: null })}
              disableRipple
              sx={actionButtonStyle}
            >
              Ajouter
            </Button>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress sx={{ color: '#b8ff00' }} />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2, ...glassCardStyle }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Code</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Année Construction</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Latitude</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Longitude</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Campus</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batiments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>Aucun bâtiment trouvé</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  batiments.map((batiment, index) => (
                    <TableRow 
                      key={batiment.codeB || `bat-${index}`}
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(184, 255, 0, 0.02)' },
                        '& td': { borderBottom: '1px solid rgba(255, 255, 255, 0.04)' },
                      }}
                    >
                      <TableCell sx={{ color: '#b8ff00', fontWeight: 500 }}>{batiment.codeB || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{batiment.anneeC || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' }}>{batiment.latitude?.toFixed(6) || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' }}>{batiment.longitude?.toFixed(6) || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{batiment.campus?.nomC || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          onClick={() => setBatimentDialog({ open: true, item: batiment })}
                          sx={{ color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: '#b8ff00', bgcolor: 'rgba(184, 255, 0, 0.1)' } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => setDeleteDialog({ open: true, type: 'batiment', item: batiment })}
                          sx={{ color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: '#ff4757', bgcolor: 'rgba(255, 71, 87, 0.1)' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* Campus Tab */}
      <TabPanel value={currentTab} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '0.01em', color: 'rgba(255, 255, 255, 0.9)' }}>
            Gestion des Campus
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button startIcon={<RefreshIcon />} onClick={loadCampus} disableRipple variant="outlined" sx={secondaryButtonStyle}>
              Actualiser
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCampusDialog({ open: true, item: null })} disableRipple sx={actionButtonStyle}>
              Ajouter
            </Button>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress sx={{ color: '#b8ff00' }} />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2, ...glassCardStyle }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Nom</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Ville</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Université</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campus.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>Aucun campus trouvé</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  campus.map((c, index) => (
                    <TableRow key={c.nomC || `campus-${index}`} sx={{ '&:hover': { bgcolor: 'rgba(184, 255, 0, 0.02)' }, '& td': { borderBottom: '1px solid rgba(255, 255, 255, 0.04)' } }}>
                      <TableCell sx={{ color: '#b8ff00', fontWeight: 500 }}>{c.nomC || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{c.ville || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{c.universite?.nom || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => setCampusDialog({ open: true, item: c })} sx={{ color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: '#b8ff00', bgcolor: 'rgba(184, 255, 0, 0.1)' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => setDeleteDialog({ open: true, type: 'campus', item: c })} sx={{ color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: '#ff4757', bgcolor: 'rgba(255, 71, 87, 0.1)' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* Salles Tab */}
      <TabPanel value={currentTab} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '0.01em', color: 'rgba(255, 255, 255, 0.9)' }}>
            Gestion des Salles
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button startIcon={<RefreshIcon />} onClick={loadSalles} disableRipple variant="outlined" sx={secondaryButtonStyle}>
              Actualiser
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setSalleDialog({ open: true, item: null })} disableRipple sx={actionButtonStyle}>
              Ajouter
            </Button>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress sx={{ color: '#b8ff00' }} />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2, ...glassCardStyle }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Numéro</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Type</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Capacité</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Étage</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Accès PMR</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>Aucune salle trouvée</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  salles.map((salle, index) => (
                    <TableRow key={salle.numS || `salle-${index}`} sx={{ '&:hover': { bgcolor: 'rgba(184, 255, 0, 0.02)' }, '& td': { borderBottom: '1px solid rgba(255, 255, 255, 0.04)' } }}>
                      <TableCell sx={{ color: '#b8ff00', fontWeight: 500 }}>{salle.numS || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{salle.typeS || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: '"JetBrains Mono", monospace' }}>{salle.capacite || 0}</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{salle.etage || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={salle.acces === 'oui' ? 'Oui' : 'Non'}
                          size="small"
                          sx={{
                            bgcolor: salle.acces === 'oui' ? 'rgba(0, 255, 157, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            color: salle.acces === 'oui' ? '#00ff9d' : 'rgba(255, 255, 255, 0.5)',
                            border: salle.acces === 'oui' ? '1px solid rgba(0, 255, 157, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => setSalleDialog({ open: true, item: salle })} sx={{ color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: '#b8ff00', bgcolor: 'rgba(184, 255, 0, 0.1)' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => setDeleteDialog({ open: true, type: 'salle', item: salle })} sx={{ color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: '#ff4757', bgcolor: 'rgba(255, 71, 87, 0.1)' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* Composantes Tab */}
      <TabPanel value={currentTab} index={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '0.01em', color: 'rgba(255, 255, 255, 0.9)' }}>
            Gestion des Composantes
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button startIcon={<RefreshIcon />} onClick={loadComposantes} disableRipple variant="outlined" sx={secondaryButtonStyle}>
              Actualiser
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setComposanteDialog({ open: true, item: null })} disableRipple sx={actionButtonStyle}>
              Ajouter
            </Button>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress sx={{ color: '#b8ff00' }} />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2, ...glassCardStyle }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Acronyme</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Nom</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Responsable</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {composantes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>Aucune composante trouvée</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  composantes.map((comp, index) => (
                    <TableRow key={comp.acronyme || `comp-${index}`} sx={{ '&:hover': { bgcolor: 'rgba(184, 255, 0, 0.02)' }, '& td': { borderBottom: '1px solid rgba(255, 255, 255, 0.04)' } }}>
                      <TableCell>
                        <Chip 
                          label={comp.acronyme || 'N/A'} 
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgba(184, 255, 0, 0.15)', 
                            color: '#b8ff00', 
                            border: '1px solid rgba(184, 255, 0, 0.3)',
                            fontWeight: 600,
                            letterSpacing: '0.03em',
                          }} 
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{comp.nom || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{comp.responsable || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => setComposanteDialog({ open: true, item: comp })} sx={{ color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: '#b8ff00', bgcolor: 'rgba(184, 255, 0, 0.1)' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => setDeleteDialog({ open: true, type: 'composante', item: comp })} sx={{ color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: '#ff4757', bgcolor: 'rgba(255, 71, 87, 0.1)' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* Universités Tab */}
      <TabPanel value={currentTab} index={4}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '0.01em', color: 'rgba(255, 255, 255, 0.9)' }}>
            Gestion des Universités
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button startIcon={<RefreshIcon />} onClick={loadUniversites} disableRipple variant="outlined" sx={secondaryButtonStyle}>
              Actualiser
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setUniversiteDialog({ open: true, item: null })} disableRipple sx={actionButtonStyle}>
              Ajouter
            </Button>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress sx={{ color: '#b8ff00' }} />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2, ...glassCardStyle }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Nom</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Acronyme</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Création</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Présidence</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {universites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>Aucune université trouvée</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  universites.map((univ, index) => (
                    <TableRow key={univ.nom || `univ-${index}`} sx={{ '&:hover': { bgcolor: 'rgba(184, 255, 0, 0.02)' }, '& td': { borderBottom: '1px solid rgba(255, 255, 255, 0.04)' } }}>
                      <TableCell sx={{ color: '#b8ff00', fontWeight: 500 }}>{univ.nom || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={univ.acronyme || 'N/A'} 
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgba(0, 212, 255, 0.15)', 
                            color: '#00d4ff', 
                            border: '1px solid rgba(0, 212, 255, 0.3)',
                            fontWeight: 600,
                            letterSpacing: '0.03em',
                          }} 
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: '"JetBrains Mono", monospace' }}>{univ.creation || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{univ.presidence || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => setUniversiteDialog({ open: true, item: univ })} sx={{ color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: '#b8ff00', bgcolor: 'rgba(184, 255, 0, 0.1)' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => setDeleteDialog({ open: true, type: 'universite', item: univ })} sx={{ color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: '#ff4757', bgcolor: 'rgba(255, 71, 87, 0.1)' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* Dialogs */}
      <BatimentDialog
        open={batimentDialog.open}
        batiment={batimentDialog.item}
        onClose={() => setBatimentDialog({ open: false, item: null })}
        onSave={() => {
          loadBatiments();
          setSuccess('Bâtiment enregistré avec succès');
        }}
      />

      <CampusDialog
        open={campusDialog.open}
        campus={campusDialog.item}
        onClose={() => setCampusDialog({ open: false, item: null })}
        onSave={() => {
          loadCampus();
          setSuccess('Campus enregistré avec succès');
        }}
      />

      <SalleDialog
        open={salleDialog.open}
        salle={salleDialog.item}
        onClose={() => setSalleDialog({ open: false, item: null })}
        onSave={() => {
          loadSalles();
          setSuccess('Salle enregistrée avec succès');
        }}
      />

      <ComposanteDialog
        open={composanteDialog.open}
        composante={composanteDialog.item}
        onClose={() => setComposanteDialog({ open: false, item: null })}
        onSave={() => {
          loadComposantes();
          setSuccess('Composante enregistrée avec succès');
        }}
      />

      <UniversiteDialog
        open={universiteDialog.open}
        universite={universiteDialog.item}
        onClose={() => setUniversiteDialog({ open: false, item: null })}
        onSave={() => {
          loadUniversites();
          setSuccess('Université enregistrée avec succès');
        }}
      />

      {/* Delete Confirmation Dialog - Glass style */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, type: '', item: null })}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 71, 87, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle 
          sx={{ 
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            fontWeight: 600,
            letterSpacing: '0.01em',
            color: '#ff4757',
          }}
        >
          Confirmer la suppression
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Alert 
            severity="warning"
            sx={{
              bgcolor: 'rgba(255, 184, 0, 0.1)',
              border: '1px solid rgba(255, 184, 0, 0.2)',
              color: '#ffc433',
              borderRadius: 2,
            }}
          >
            Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, type: '', item: null })}
            disableRipple
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              '&:hover': { color: 'rgba(255, 255, 255, 0.9)', bgcolor: 'rgba(255, 255, 255, 0.05)' },
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained"
            disableRipple
            sx={{
              bgcolor: 'rgba(255, 71, 87, 0.15)',
              color: '#ff4757',
              border: '1px solid rgba(255, 71, 87, 0.3)',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(255, 71, 87, 0.25)',
                borderColor: 'rgba(255, 71, 87, 0.5)',
                boxShadow: '0 0 20px rgba(255, 71, 87, 0.2)',
              },
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Admin;

