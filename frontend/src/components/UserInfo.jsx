import React from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import { AdminPanelSettings, Person, Email } from '@mui/icons-material';

/**
 * Компонент для отображения информации о пользователе
 */
const UserInfo = ({ user }) => {
  if (!user) return null;

  const getRoleColor = (role) => {
    switch (role?.toUpperCase()) {
      case 'GESTIONNAIRE':
        return 'error';
      case 'ENSEIGNANT':
        return 'primary';
      case 'ETUDIANT':
        return 'default';
      default:
        return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toUpperCase()) {
      case 'GESTIONNAIRE':
        return <AdminPanelSettings sx={{ fontSize: 20 }} />;
      default:
        return <Person sx={{ fontSize: 20 }} />;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Person /> Профиль пользователя
      </Typography>

      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {user.fullName && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Имя
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {user.fullName}
            </Typography>
          </Box>
        )}

        {user.email && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Email sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user.email}
              </Typography>
            </Box>
          </Box>
        )}

        {user.role && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getRoleIcon(user.role)}
            <Box>
              <Typography variant="caption" color="text.secondary">
                Роль
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={user.role}
                  color={getRoleColor(user.role)}
                  size="small"
                  icon={getRoleIcon(user.role)}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default UserInfo;

