'use client';

import { Box, Typography } from '@mui/material';

export default function Footer({ isAdmin = false }) {
  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        textAlign: 'center',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} DSA Practice Platform
        {isAdmin ? ' - Admin Portal' : ''}. All rights reserved.
      </Typography>
    </Box>
  );
}
