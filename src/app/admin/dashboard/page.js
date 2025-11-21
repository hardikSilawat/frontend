"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectAdmin } from "@/redux/reducers";
import AdminMainLayout from "@/components/AdminMainLayout/page";
import {
  People,
  ShoppingCart,
  Inventory,
  TrendingUp,
} from "@mui/icons-material";
import api from "@/apiHandler/page";

export default function AdminDashboard() {
  const theme = useTheme();
  const admin = useSelector(selectAdmin);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: "₹0",
    growth: 0,
  });

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/user/dashboard-stats");
      if (response.success) {
        setStats({
          users: response.data.users,
          products: response.data.products,
          orders: response.data.orders,
          revenue: `₹${response.data.revenue?.toLocaleString("en-IN")}`,
          growth: response.data.growth,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card
      sx={{
        background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        borderRadius: 3,
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 12px 20px rgba(0,0,0,0.15)",
        },
        height: "100%",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: color,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ textTransform: "uppercase", letterSpacing: 1 }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: `${color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: color,
            }}
          >
            <Icon fontSize="medium" />
          </Box>
        </Box>
        {isLoading ? (
          <LinearProgress />
        ) : (
          <>
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              {value}
            </Typography>
            {title === "Total Revenue" && (
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp
                  sx={{ color: "#4caf50", mr: 0.5, fontSize: "1rem" }}
                />
                <Typography
                  variant="body2"
                  color="success.main"
                  sx={{ fontWeight: 500 }}
                >
                  +{stats.growth}% from last month
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  if (!admin) {
    return (
      <AdminMainLayout>
        <Box p={3}>
          <Typography variant="h6">Loading admin data...</Typography>
        </Box>
      </AdminMainLayout>
    );
  }

  return (
    <AdminMainLayout>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            color: "white",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              right: -50,
              top: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <Box position="relative" zIndex={1}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Welcome back, {admin.name || "Admin"}! 👋
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ opacity: 0.9, maxWidth: "600px" }}
            >
              Here&apos;s what&apos;s happening with your store today.
            </Typography>
          </Box>
        </Paper>

        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={3}
          mb={4}
        >
          <StatCard
            title="Total Users"
            value={stats.users.toLocaleString()}
            icon={People}
            color={theme.palette.primary.main}
          />
          <StatCard
            title="Total Products"
            value={stats.products}
            icon={Inventory}
            color={theme.palette.secondary.main}
          />
          <StatCard
            title="Total Orders"
            value={stats.orders}
            icon={ShoppingCart}
            color={theme.palette.info.main}
          />
          <StatCard
            title="Total Revenue"
            value={stats.revenue}
            icon={TrendingUp}
            color="#4caf50"
          />
        </Box>
      </Box>
    </AdminMainLayout>
  );
}
