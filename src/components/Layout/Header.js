'use client';

import { Box, Typography, useTheme } from '@mui/material';

export default function Header({ title, subtitle }) {
  const theme = useTheme();
  
  return (
    <Box
      component="header"
      sx={{
        py: 1,
        px: { xs: 2, sm: 3 },
        backgroundColor: 'background.paper',
        borderBottom: `3px solid ${theme.palette.primary.main}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Typography
        variant="h6"
        component="h1"
        fontWeight={600}
        sx={{
          background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle2" color="text.secondary" ml={1} display="inline">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
