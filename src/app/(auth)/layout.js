'use client';

import { Box, Container, useTheme } from '@mui/material';

export default function AuthLayout({ children }) {
  const theme = useTheme();

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)' 
            : theme.palette.background.default,
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
