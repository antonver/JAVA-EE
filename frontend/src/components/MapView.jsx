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
        <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: 'primary.light' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalculateIcon /> Calculer la distance
            </Typography>
            <IconButton size="small" onClick={clearSelection} color="error">
              <ClearIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            {selectedBuildings.map((building, index) => (
              <Chip
                key={building.id}
                label={`${index + 1}. ${building.id}`}
                color="primary"
                icon={<LocationIcon />}
                onDelete={() => handleBuildingClick(building.data, building.id)}
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
            >
              {calculatingDistance ? 'Calcul en cours...' : 'Calculer la distance'}
            </Button>
          )}

          {selectedBuildings.length < 2 && (
            <Alert severity="info" sx={{ mt: 1 }}>
              Sélectionnez {2 - selectedBuildings.length} bâtiment(s) supplémentaire(s) sur la carte
            </Alert>
          )}

          {distance && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                📏 Distance calculée
              </Typography>
              <Typography variant="body1">
                <strong>{distance.distance.kilometers} km</strong> ({distance.distance.meters} m)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Distance à vol d'oiseau (ligne droite)
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          {batiments.length} bâtiment(s) trouvé(s)
        </Typography>
        <Chip 
          label={`${batiments.filter(b => b.latitude && b.longitude).length} géolocalisé(s)`} 
          color="primary" 
          size="small" 
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
              // Извлекаем ID из _links.self.href
              const batimentId = batiment._links?.self?.href?.split('/').pop() || index;
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
                    <Box sx={{ minWidth: 200 }}>
                      <Typography variant="h6" gutterBottom>
                        {batimentId}
                      </Typography>
                      {batiment.anneeC && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          📅 Année: {batiment.anneeC}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        📍 {batiment.latitude?.toFixed(5)}, {batiment.longitude?.toFixed(5)}
                      </Typography>
                      
                      <Button
                        fullWidth
                        size="small"
                        variant={selected ? "outlined" : "contained"}
                        color={selected ? "error" : "primary"}
                        sx={{ mt: 2 }}
                        onClick={() => handleBuildingClick(batiment, batimentId)}
                      >
                        {selected ? 'Désélectionner' : 'Sélectionner'}
                      </Button>
                    </Box>
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

