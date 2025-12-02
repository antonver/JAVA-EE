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

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Panneau d'Administration
        </Typography>
        <Chip label="GESTIONNAIRE" color="secondary" />
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

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange} 
          aria-label="admin tabs"
          variant="scrollable"
          scrollButtons="auto"
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Gestion des Bâtiments</Typography>
          <Box>
            <Button
              startIcon={<RefreshIcon />}
              onClick={loadBatiments}
              sx={{ mr: 1 }}
            >
              Actualiser
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setBatimentDialog({ open: true, item: null })}
            >
              Ajouter
            </Button>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Année Construction</TableCell>
                  <TableCell>Latitude</TableCell>
                  <TableCell>Longitude</TableCell>
                  <TableCell>Campus</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batiments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">Aucun bâtiment trouvé</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  batiments.map((batiment, index) => (
                    <TableRow key={batiment.codeB || `bat-${index}`}>
                      <TableCell>{batiment.codeB || 'N/A'}</TableCell>
                      <TableCell>{batiment.anneeC || 'N/A'}</TableCell>
                      <TableCell>{batiment.latitude?.toFixed(6) || 'N/A'}</TableCell>
                      <TableCell>{batiment.longitude?.toFixed(6) || 'N/A'}</TableCell>
                      <TableCell>{batiment.campus?.nomC || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => setBatimentDialog({ open: true, item: batiment })}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, type: 'batiment', item: batiment })}
                        >
                          <DeleteIcon />
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Gestion des Campus</Typography>
          <Box>
            <Button
              startIcon={<RefreshIcon />}
              onClick={loadCampus}
              sx={{ mr: 1 }}
            >
              Actualiser
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCampusDialog({ open: true, item: null })}
            >
              Ajouter
            </Button>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Ville</TableCell>
                  <TableCell>Université</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campus.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography color="text.secondary">Aucun campus trouvé</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  campus.map((c, index) => (
                    <TableRow key={c.nomC || `campus-${index}`}>
                      <TableCell>{c.nomC || 'N/A'}</TableCell>
                      <TableCell>{c.ville || 'N/A'}</TableCell>
                      <TableCell>{c.universite?.nom || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => setCampusDialog({ open: true, item: c })}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, type: 'campus', item: c })}
                        >
                          <DeleteIcon />
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Gestion des Salles</Typography>
          <Box>
            <Button
              startIcon={<RefreshIcon />}
              onClick={loadSalles}
              sx={{ mr: 1 }}
            >
              Actualiser
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setSalleDialog({ open: true, item: null })}
            >
              Ajouter
            </Button>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Numéro</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Capacité</TableCell>
                  <TableCell>Étage</TableCell>
                  <TableCell>Accès PMR</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">Aucune salle trouvée</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  salles.map((salle, index) => (
                    <TableRow key={salle.numS || `salle-${index}`}>
                      <TableCell>{salle.numS || 'N/A'}</TableCell>
                      <TableCell>{salle.typeS || 'N/A'}</TableCell>
                      <TableCell>{salle.capacite || 0}</TableCell>
                      <TableCell>{salle.etage || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={salle.acces === 'oui' ? 'Oui' : 'Non'}
                          color={salle.acces === 'oui' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => setSalleDialog({ open: true, item: salle })}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, type: 'salle', item: salle })}
                        >
                          <DeleteIcon />
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Gestion des Composantes</Typography>
          <Box>
            <Button
              startIcon={<RefreshIcon />}
              onClick={loadComposantes}
              sx={{ mr: 1 }}
            >
              Actualiser
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setComposanteDialog({ open: true, item: null })}
            >
              Ajouter
            </Button>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Acronyme</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Responsable</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {composantes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography color="text.secondary">Aucune composante trouvée</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  composantes.map((comp, index) => (
                    <TableRow key={comp.acronyme || `comp-${index}`}>
                      <TableCell>
                        <Chip label={comp.acronyme || 'N/A'} size="small" color="primary" />
                      </TableCell>
                      <TableCell>{comp.nom || 'N/A'}</TableCell>
                      <TableCell>{comp.responsable || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => setComposanteDialog({ open: true, item: comp })}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, type: 'composante', item: comp })}
                        >
                          <DeleteIcon />
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Gestion des Universités</Typography>
          <Box>
            <Button
              startIcon={<RefreshIcon />}
              onClick={loadUniversites}
              sx={{ mr: 1 }}
            >
              Actualiser
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setUniversiteDialog({ open: true, item: null })}
            >
              Ajouter
            </Button>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Acronyme</TableCell>
                  <TableCell>Création</TableCell>
                  <TableCell>Présidence</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {universites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary">Aucune université trouvée</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  universites.map((univ, index) => (
                    <TableRow key={univ.nom || `univ-${index}`}>
                      <TableCell>{univ.nom || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip label={univ.acronyme || 'N/A'} size="small" color="secondary" />
                      </TableCell>
                      <TableCell>{univ.creation || 'N/A'}</TableCell>
                      <TableCell>{univ.presidence || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => setUniversiteDialog({ open: true, item: univ })}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, type: 'universite', item: univ })}
                        >
                          <DeleteIcon />
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, type: '', item: null })}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, type: '', item: null })}>
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Admin;

