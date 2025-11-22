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
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectAdmin } from "@/redux/reducers";
import AdminMainLayout from "@/components/AdminMainLayout/page";
import {
  People,
  CheckCircle,
  TrendingUp,
  Timeline,
  Star,
  Topic as TopicIcon,
  MenuBook,
} from "@mui/icons-material";
import api from "@/apiHandler/page";

export default function AdminDashboard() {
  const theme = useTheme();
  const admin = useSelector(selectAdmin);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    users: { total: 0, activeToday: 0, newThisWeek: 0 },
    topics: { total: 0, subtopics: 0, completionRate: 0 },
    progress: { totalCompleted: 0, averagePerUser: 0, maxCompleted: 0 },
    topTopics: [],
    recentActivity: [],
  });

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/auth/admin/dashboard-stats");
      if (response.data) {
        setStats(response.data);
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

  const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <Card
      sx={{
        background: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: theme.shadows[1],
        height: "100%",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[3],
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ textTransform: "uppercase", fontSize: 12, fontWeight: 600 }}
            >
              {title}
            </Typography>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 600 }}>
              {value}
            </Typography>
            {subtext && (
              <Typography variant="caption" color="text.secondary">
                {subtext}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: `${color}20`,
              color: color,
            }}
          >
            <Icon />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ date, count }) => (
    <ListItem>
      <ListItemText
        primary={`${count} ${count === 1 ? "completion" : "completions"}`}
        secondary={new Date(date).toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      />
      <Typography variant="body2" color="primary">
        {count} {count === 1 ? "problem" : "problems"}
      </Typography>
    </ListItem>
  );

  if (isLoading) {
    return (
      <AdminMainLayout>
        <Box p={3} textAlign="center">
          <LinearProgress />
        </Box>
      </AdminMainLayout>
    );
  }

  return (
    <AdminMainLayout>
      <Box sx={{ p: { xs: 2, md: 3 }, overflow: "hiddedn" }}>
        {/* Welcome Banner */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            mb: 4,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 600, mb: 1 }}
          >
            Welcome back, {admin?.name || "Admin"}! 👋
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Here's what's happening with your DSA platform today.
          </Typography>
        </Paper>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Total Users"
              value={stats.users.total}
              icon={People}
              color={theme.palette.primary.main}
              subtext={`${stats.users.newThisWeek} new this week`}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Topics"
              value={stats.topics.total}
              icon={TopicIcon}
              color={theme.palette.success.main}
              subtext={`${stats.topics.subtopics} subtopics`}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Completions"
              value={stats.progress.totalCompleted}
              icon={CheckCircle}
              color={theme.palette.warning.main}
              subtext={`${stats.progress.averagePerUser} avg per user`}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Completion Rate"
              value={`${Math.round(stats.topics.completionRate)}%`}
              icon={TrendingUp}
              color={theme.palette.info.main}
              subtext={`Max: ${stats.progress.maxCompleted} by single user`}
            />
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Top Topics */}
          <Grid size={{ xs: 12, md: 6 }}>
            {" "}
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Star color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Top Topics
                  </Typography>
                </Box>
                <List>
                  {stats.topTopics.map((topic, index) => (
                    <Box key={topic._id}>
                      <ListItem>
                        <ListItemText
                          primary={topic.topicName}
                          secondary={`${topic.completedCount} completions`}
                        />
                        <Box
                          sx={{
                            width: 100,
                            height: 8,
                            bgcolor: "divider",
                            borderRadius: 4,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${
                                (topic.completedCount /
                                  (stats.progress.totalCompleted || 1)) *
                                100
                              }%`,
                              height: "100%",
                              bgcolor: "primary.main",
                            }}
                          />
                        </Box>
                      </ListItem>
                      {index < stats.topTopics.length - 1 && (
                        <Divider variant="middle" component="li" />
                      )}
                    </Box>
                  ))}
                  {stats.topTopics.length === 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ p: 2, textAlign: "center" }}
                    >
                      No completion data available yet
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid size={{ xs: 12, md: 6 }}>
            {" "}
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Timeline color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Recent Activity
                  </Typography>
                </Box>
                <List>
                  {stats.recentActivity.map((activity, index) => (
                    <Box key={activity._id}>
                      <ActivityItem
                        date={activity._id}
                        count={activity.count}
                      />
                      {index < stats.recentActivity.length - 1 && (
                        <Divider variant="middle" component="li" />
                      )}
                    </Box>
                  ))}
                  {stats.recentActivity.length === 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ p: 2, textAlign: "center" }}
                    >
                      No recent activity
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AdminMainLayout>
  );
}
