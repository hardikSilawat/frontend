"use client";

import dynamic from "next/dynamic";
import {Typography, Box, Container, useTheme } from "@mui/material";
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

// Dynamically import the LoginForm component with no SSR
const LoginForm = dynamic(() => import("@/components/Login"), {
  ssr: false,
  loading: () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      <Typography>Loading admin login form...</Typography>
    </Box>
  ),
});

export default function AdminLoginPage() {
  const theme = useTheme();

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background:
            theme.palette.mode === "light"
              ? "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)"
              : theme.palette.background.default,
        }}
      >
        <Header title="DSA Practice Platform" subtitle="Admin Portal" />

        <Container
          component="main"
          maxWidth="lg"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            py: 6,
          }}
        >
          <Box
            sx={{
              maxWidth: 500,
              width: "100%",
              mx: "auto",
              my: "auto",
            }}
          >
            <LoginForm isAdmin={true} />
          </Box>
        </Container>

        <Footer isAdmin={true} />
      </Box>
    </Container>
  );
}
