import React from 'react';
import { Box, Typography } from '@mui/material';
import MapView from '../components/MapView';

const Home = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Carte des bâtiments
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Visualisation géographique des bâtiments universitaires
      </Typography>

      <MapView />
    </Box>
  );
};

export default Home;
