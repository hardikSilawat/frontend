"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setUser } from "@/redux/reducers";
import api from "@/apiHandler/page";
import {
  Box,
  Typography,
  Paper,
  InputAdornment,
  Link as MuiLink,
  Button,
  CircularProgress,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
  TextField,
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

const LoginForm = ({ isAdmin = false, onSuccess, authModal = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const dispatch = useDispatch();
  const userToken = Cookies.get("UserToken");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        ...formData,
        role: isAdmin ? "admin" : "user",
      });

      if (response.status === 200) {
        toast.success(response?.message || "Login successful!");
        const tokenName = isAdmin ? "AdminToken" : "UserToken";

        // In your handleSubmit function:
        Cookies.set(tokenName, response?.data?.token, {
          expires: 100 * 365,
          path: "/",
          secure: true,
          sameSite: "strict",
        });

        dispatch(setUser(response.data.user));

        const targetRoute = isAdmin ? "/admin/dashboard" : "/dashboard";
        router.push(targetRoute);

        onSuccess?.();
        return { success: true, message: "Login successful!" };
      } else {
        const errorMessage =
          response?.message || "Login failed. Please try again.";
        toast.error(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during login.";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
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
                  User ?{" "}
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
                  Admin ?{" "}
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
                    Go to Admin Login
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
