import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { 
  Box, 
  CircularProgress, 
  Alert, 
  Typography, 
  Chip, 
  Button, 
  Paper,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Clear as ClearIcon, 
  Calculate as CalculateIcon,
  LocationOn as LocationIcon 
} from '@mui/icons-material';
import { getBatiments, getDistanceBetween } from '../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet avec Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Composant pour centrer la carte sur les bâtiments
const SetViewOnClick = ({ batiments }) => {
  const map = useMap();

  useEffect(() => {
    if (batiments && batiments.length > 0) {
      // Trouver les limites de tous les bâtiments
      const bounds = batiments
        .filter(b => b.latitude && b.longitude)
        .map(b => [b.latitude, b.longitude]);
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [batiments, map]);

  return null;
};

const MapView = () => {
  const [batiments, setBatiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État pour le calcul de distance
  const [selectedBuildings, setSelectedBuildings] = useState([]);
  const [distance, setDistance] = useState(null);
  const [calculatingDistance, setCalculatingDistance] = useState(false);

  // Position par défaut (Montpellier)
  const defaultCenter = [43.6108, 3.8767];
  const defaultZoom = 13;

  useEffect(() => {
    loadBatiments();
  }, []);

  const loadBatiments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBatiments();
      console.log('Bâtiments chargés:', data);
      setBatiments(data);
    } catch (err) {
      console.error('Erreur lors du chargement des bâtiments:', err);
      setError('Erreur lors du chargement des bâtiments');
    } finally {
      setLoading(false);
    }
  };

  const handleBuildingClick = (batiment, batimentId) => {
    // Si le bâtiment est déjà sélectionné, le désélectionner
    if (selectedBuildings.some(b => b.id === batimentId)) {
      setSelectedBuildings(selectedBuildings.filter(b => b.id !== batimentId));
      setDistance(null);
      return;
    }

    // Limiter à 2 bâtiments
    if (selectedBuildings.length >= 2) {
      // Remplacer le plus ancien
      setSelectedBuildings([selectedBuildings[1], { id: batimentId, data: batiment }]);
      setDistance(null);
    } else {
      setSelectedBuildings([...selectedBuildings, { id: batimentId, data: batiment }]);
      setDistance(null);
    }
  };

  const calculateDistance = async () => {
    if (selectedBuildings.length !== 2) return;

    try {
      setCalculatingDistance(true);
      const result = await getDistanceBetween(
        selectedBuildings[0].id,
        selectedBuildings[1].id
      );
      setDistance(result);
    } catch (err) {
      console.error('Erreur lors du calcul de la distance:', err);
      setError('Erreur lors du calcul de la distance');
    } finally {
      setCalculatingDistance(false);
    }
  };

  const clearSelection = () => {
    setSelectedBuildings([]);
    setDistance(null);
  };

  const isSelected = (batimentId) => {
    return selectedBuildings.some(b => b.id === batimentId);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 200px)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Panneau de contrôle distance */}
      {selectedBuildings.length > 0 && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            mb: 2, 
            bgcolor: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(184, 255, 0, 0.2)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#b8ff00' }}>
              <CalculateIcon /> Calculer la distance
            </Typography>
            <IconButton 
              size="small" 
              onClick={clearSelection} 
              sx={{ 
                color: '#ff4757',
                '&:hover': { bgcolor: 'rgba(255, 71, 87, 0.15)' }
              }}
            >
              <ClearIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            {selectedBuildings.map((building, index) => (
              <Chip
                key={building.id}
                label={`${index + 1}. ${building.id}`}
                icon={<LocationIcon sx={{ color: '#b8ff00 !important' }} />}
                onDelete={() => handleBuildingClick(building.data, building.id)}
                sx={{
                  bgcolor: 'rgba(184, 255, 0, 0.15)',
                  color: '#b8ff00',
                  border: '1px solid rgba(184, 255, 0, 0.3)',
                  '& .MuiChip-deleteIcon': { color: 'rgba(255, 255, 255, 0.6)' },
                }}
              />
            ))}
          </Box>

          {selectedBuildings.length === 2 && (
            <Button
              fullWidth
              variant="contained"
              startIcon={<CalculateIcon />}
              onClick={calculateDistance}
              disabled={calculatingDistance}
              sx={{
                bgcolor: '#b8ff00',
                color: '#000',
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  bgcolor: '#a0e000',
                  boxShadow: '0 0 20px rgba(184, 255, 0, 0.4)',
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(184, 255, 0, 0.3)',
                  color: 'rgba(0, 0, 0, 0.5)',
                },
              }}
            >
              {calculatingDistance ? 'Calcul en cours...' : 'Calculer la distance'}
            </Button>
          )}

          {selectedBuildings.length < 2 && (
            <Alert 
              severity="info" 
              sx={{ 
                mt: 1,
                bgcolor: 'rgba(0, 200, 255, 0.1)',
                border: '1px solid rgba(0, 200, 255, 0.3)',
                color: '#00d4ff',
                '& .MuiAlert-icon': { color: '#00d4ff' },
              }}
            >
              Sélectionnez {2 - selectedBuildings.length} bâtiment(s) supplémentaire(s) sur la carte
            </Alert>
          )}

          {distance && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'rgba(0, 255, 157, 0.1)', 
              border: '1px solid rgba(0, 255, 157, 0.3)',
              borderRadius: 2,
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#00ff9d' }}>
                📏 Distance calculée
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                <strong style={{ color: '#00ff9d', fontSize: '1.2em' }}>{distance.distance.kilometers} km</strong> ({distance.distance.meters} m)
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Distance à vol d'oiseau (ligne droite)
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      <Box 
        sx={{ 
          mb: 2, 
          p: 1.5,
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 500,
          }}
        >
          🏢 {batiments.length} bâtiment(s) trouvé(s)
        </Typography>
        <Chip 
          label={`📍 ${batiments.filter(b => b.latitude && b.longitude).length} géolocalisé(s)`} 
          size="small"
          sx={{
            bgcolor: 'rgba(184, 255, 0, 0.15)',
            color: '#b8ff00',
            border: '1px solid rgba(184, 255, 0, 0.3)',
            fontWeight: 500,
          }}
        />
      </Box>

      <Box
        sx={{
          height: 'calc(100vh - 250px)',
          minHeight: '500px',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3,
        }}
      >
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <SetViewOnClick batiments={batiments} />

          {/* Ligne entre les bâtiments sélectionnés */}
          {selectedBuildings.length === 2 && (
            <Polyline
              positions={[
                [selectedBuildings[0].data.latitude, selectedBuildings[0].data.longitude],
                [selectedBuildings[1].data.latitude, selectedBuildings[1].data.longitude],
              ]}
              color="red"
              weight={3}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}

          {batiments
            .filter(batiment => batiment.latitude && batiment.longitude)
            .map((batiment, index) => {
              // L'ID du bâtiment est le codeB
              const batimentId = batiment.codeB || index;
              const selected = isSelected(batimentId);
              
              // Icône personnalisée pour les bâtiments sélectionnés
              const redIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              });
              
              // Icône par défaut (bleue)
              const blueIcon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              });
              
              return (
                <Marker
                  key={batimentId}
                  position={[batiment.latitude, batiment.longitude]}
                  icon={selected ? redIcon : blueIcon}
                  eventHandlers={{
                    click: () => handleBuildingClick(batiment, batimentId),
                  }}
                >
                  <Popup>
                    <div style={{ 
                      minWidth: 200, 
                      padding: '8px',
                      backgroundColor: '#1a1a1a',
                      borderRadius: '8px',
                      margin: '-13px -19px',
                    }}>
                      <div style={{ color: '#b8ff00', fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>
                        🏢 {batimentId}
                      </div>
                      {batiment.anneeC && (
                        <div style={{ color: '#e0e0e0', fontSize: '0.9rem', marginBottom: '4px' }}>
                          📅 Année: {batiment.anneeC}
                        </div>
                      )}
                      <div style={{ color: '#aaaaaa', fontSize: '0.8rem', marginTop: '8px' }}>
                        📍 {batiment.latitude?.toFixed(5)}, {batiment.longitude?.toFixed(5)}
                      </div>
                      
                      <Button
                        fullWidth
                        size="small"
                        variant="contained"
                        sx={{ 
                          mt: 2,
                          bgcolor: selected ? '#ff4757' : '#b8ff00',
                          color: selected ? '#fff' : '#000',
                          fontWeight: 600,
                          '&:hover': {
                            bgcolor: selected ? '#ff6b7a' : '#a0e000',
                          },
                        }}
                        onClick={() => handleBuildingClick(batiment, batimentId)}
                      >
                        {selected ? 'Désélectionner' : 'Sélectionner'}
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </Box>

      {batiments.filter(b => !b.latitude || !b.longitude).length > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {batiments.filter(b => !b.latitude || !b.longitude).length} bâtiment(s) 
          n'ont pas de coordonnées géographiques
        </Alert>
      )}
    </Box>
  );
};

export default MapView;

