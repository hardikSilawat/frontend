"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  LockOutlined,
  EmailOutlined,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  Person,
} from "@mui/icons-material";
import Link from "next/link";

const LoginForm = ({ isAdmin = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [state, setState] = useState({
    formData: {
      email: "",
      password: "",
    },
    showPassword: false,
    isLoading: false,
    error: "",
  });

  const { formData, showPassword, isLoading, error } = state;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value,
      },
    }));
  };

  const togglePasswordVisibility = () => {
    setState((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  const validateForm = (email, password) => {
    if (!email.trim()) {
      return { isValid: false, error: "Email is required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Please enter a valid email address" };
    }

    if (!password) {
      return { isValid: false, error: "Password is required" };
    }

    if (password.length < 6) {
      return {
        isValid: false,
        error: "Password must be at least 6 characters long",
      };
    }

    return { isValid: true, error: "" };
  };

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, error } = validateForm(formData.email, formData.password);
    if (!isValid) {
      setState((prev) => ({ ...prev, error }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: "" }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo: Redirect based on user type
      const targetRoute = isAdmin ? "/admin/dashboard" : "/dashboard";
      router.push(targetRoute);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Invalid credentials. Please try again.",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <Fade in={true} timeout={500}>
      <Paper
        elevation={6}
        sx={{
          p: isMobile ? 3 : 4,
          width: "100%",
          maxWidth: 450,
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: theme.palette.primary.light,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            {isAdmin ? (
              <AdminPanelSettings sx={{ fontSize: 32, color: "white" }} />
            ) : (
              <Person sx={{ fontSize: 32, color: "white" }} />
            )}
          </Box>
          <Typography component="h1" variant="h5" fontWeight="bold">
            {isAdmin ? "Admin Portal" : "Welcome Back"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            {isAdmin
              ? "Sign in to access the admin dashboard"
              : "Sign in to continue"}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                "& fieldset": {
                  borderColor: "divider",
                },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                    size="small"
                    sx={{ color: "text.secondary" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                "& fieldset": {
                  borderColor: "divider",
                },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            size="large"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: 1,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              "&:hover": {
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Sign In ${isAdmin ? "as Admin" : ""}`.trim()
            )}
          </Button>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {isAdmin ? (
                <>
                  User?{" "}
                  <Typography
                    component={Link}
                    href="/login"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Go to User Login
                  </Typography>
                </>
              ) : (
                <>
                  Admin?{" "}
                  <Typography
                    component={Link}
                    href="/admin/login"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Admin Login
                  </Typography>
                </>
              )}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
};

export default LoginForm;
