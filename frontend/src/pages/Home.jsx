import React from 'react';
import { Box, Typography } from '@mui/material';
import MapView from '../components/MapView';

const Home = () => {
  return (
    <Box>
      {/* Header with industrial styling */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600, 
            letterSpacing: '0.02em',
            color: 'rgba(255, 255, 255, 0.95)',
            mb: 1,
          }}
        >
          Carte des bâtiments
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box 
            component="span"
            sx={{ 
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#b8ff00',
              boxShadow: '0 0 8px rgba(184, 255, 0, 0.5)',
            }}
          />
          Visualisation géographique des bâtiments universitaires
        </Typography>
      </Box>

      {/* Map container with glass border */}
      <Box
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 4px 24px rgba(0, 0, 0, 0.4)',
        }}
      >
        <MapView />
      </Box>
    </Box>
  );
};

export default Home;
