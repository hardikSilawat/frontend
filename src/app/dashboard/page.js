"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CodeIcon from "@mui/icons-material/Code";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import api from "@/apiHandler/page";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { toast } from "react-toastify";

// ProgressChip component for displaying progress with percentage
const ProgressChip = ({ level, completed, total, percentage }) => {
  const isComplete = completed === total && total > 0;

  return (
    <Tooltip
      title={`${completed} out of ${total} ${level} problems completed (${percentage}%)`}
      arrow
    >
      <Chip
        icon={
          isComplete ? (
            <CheckCircleIcon
              fontSize="small"
              sx={{
                color: "white",
              }}
            />
          ) : null
        }
        label={
          <Box
            component="span"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontWeight: 500,
            }}
          >
            {level} {completed}/{total}
            <Box
              component="span"
              sx={{
                opacity: 0.8,
                fontWeight: 400,
              }}
            >
              ({percentage}%)
            </Box>
          </Box>
        }
        color={isComplete ? "success" : "default"}
        variant="outlined"
        size="small"
        sx={{
          backgroundColor: "white",
          borderColor: isComplete ? "success.main" : "divider",
          "&:hover": {
            backgroundColor: "action.hover",
          },
          "& .MuiChip-label": {
            px: 1,
          },
        }}
      />
    </Tooltip>
  );
};

const SubtopicDetails = dynamic(() => import("@/components/SubtopicDetails"), {
  ssr: false,
});

const drawerWidth = 240;

function ResponsiveDrawer({ window }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({
    easy: { completed: 0, total: 0, percentage: 0 },
    medium: { completed: 0, total: 0, percentage: 0 },
    tough: { completed: 0, total: 0, percentage: 0 },
    overall: { completed: 0, total: 0, percentage: 0 },
  });

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const mounted = useRef(false);
  const fetchData = async () => {
    try {
      const data = await api.get("/topics/all");
      setTopics(data.data);
      // Initialize expanded state for each topic
      const initialExpanded = {};
      data.data.forEach((topic) => {
        initialExpanded[topic._id] = false;
      });
      setExpandedTopics(initialExpanded);

      // Calculate progress
      calculateProgress(data.data);
    } catch (err) {
      setError("Failed to fetch topics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = async () => {
    try {
      const response = await api.get("/topics/progress");
      if (response.status === 200) {
        setProgress(response.data);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast.error("Failed to fetch progress");
    }
  };

  // Call this in your useEffect
  useEffect(() => {
    if (mounted.current) return;
    fetchData();
    calculateProgress(); // Add this line
    mounted.current = true;
  }, [mounted]);

  const handleTopicClick = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const handleSubtopicClick = async (subtopicId) => {
    try {
      const data = await api.get(`/subtopics/${subtopicId}`);
      // Ensure isCompleted is a boolean
      const subtopicData = {
        ...data.data,
        isCompleted: Boolean(data.data.isCompleted),
      };
      setSelectedSubtopic(subtopicData);
    } catch (err) {
      console.error("Error fetching subtopic details:", err);
    }
  };

  const handleSubtopicCompletionChange = async (subtopicId, isCompleted) => {
    try {
      // Update selected subtopic
      if (selectedSubtopic?._id === subtopicId) {
        setSelectedSubtopic((prev) => ({
          ...prev,
          isCompleted,
        }));
      }

      // Update topics
      const updatedTopics = topics.map((topic) => ({
        ...topic,
        subtopics: topic.subtopics.map((subtopic) =>
          subtopic._id === subtopicId ? { ...subtopic, isCompleted } : subtopic
        ),
      }));
      setTopics(updatedTopics);

      // Recalculate progress
      await calculateProgress();
    } catch (error) {
      console.error("Error toggling completion status:", error);
    }
  };

  const drawer = (
    <Box>
      <Stack display={{ xs: "block", md: "none" }}>
        <ProgressChip
          level="Easy"
          completed={progress.easy.completed}
          total={progress.easy.total}
          percentage={progress.easy.percentage}
        />
        <ProgressChip
          level="Medium"
          completed={progress.medium.completed}
          total={progress.medium.total}
          percentage={progress.medium.percentage}
        />
        <ProgressChip
          level="Tough"
          completed={progress.tough.completed}
          total={progress.tough.total}
          percentage={progress.tough.percentage}
        />
        <ProgressChip
          level="Overall"
          completed={progress.overall.completed}
          total={progress.overall.total}
          percentage={progress.overall.percentage}
          sx={{
            borderWidth: 2,
            borderColor: "primary.main",
            backgroundColor: "rgba(25, 118, 210, 0.08)",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.12)",
            },
          }}
        />
      </Stack>

      <Divider />
      <List>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          topics.map((topic) => {
            const allSubtasksCompleted = topic.subtopics.every(
              (st) => st.completed
            );
            const someSubtasksCompleted = topic.subtopics.some(
              (st) => st.completed
            );

            return (
              <div key={topic._id}>
                <ListItemButton onClick={() => handleTopicClick(topic._id)}>
                  <ListItemIcon>
                    {allSubtasksCompleted ? (
                      <CheckCircleIcon color="success" />
                    ) : someSubtasksCompleted ? (
                      <CheckCircleIcon color="action" sx={{ opacity: 0.5 }} />
                    ) : (
                      <CodeIcon />
                    )}
                  </ListItemIcon>
                  {console.log("topic", topic)}
                  <ListItemText
                    primary={topic.name}
                    primaryTypographyProps={{
                      color: allSubtasksCompleted ? "success.main" : "inherit",
                      fontWeight: allSubtasksCompleted ? "bold" : "normal",
                    }}
                  />
                  {expandedTopics[topic._id] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse
                  in={expandedTopics[topic._id]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {topic.subtopics.map((subtopic) => (
                      <ListItemButton
                        key={subtopic._id}
                        sx={{
                          pl: 4,
                          backgroundColor:
                            subtopic._id === selectedSubtopic?._id
                              ? "action.hover"
                              : "inherit",
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                        }}
                        onClick={() => handleSubtopicClick(subtopic._id)}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {subtopic.isCompleted ? (
                            <CheckCircleIcon color="success" fontSize="small" />
                          ) : (
                            <div style={{ width: 24, height: 24 }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {subtopic.name}
                              {subtopic.completed && (
                                <Chip
                                  label="Completed"
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                  sx={{
                                    height: 20,
                                    fontSize: "0.7rem",
                                    "& .MuiChip-label": { px: 0.5 },
                                  }}
                                />
                              )}
                            </Box>
                          }
                          primaryTypographyProps={{
                            textDecoration: subtopic.completed
                              ? "line-through"
                              : "none",
                            color: subtopic.completed
                              ? "text.secondary"
                              : "text.primary",
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </div>
            );
          })
        )}
      </List>
    </Box>
  );

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: "white" }}
          >
            DSA Tracker
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <ProgressChip
              level="Easy"
              completed={progress.easy.completed}
              total={progress.easy.total}
              percentage={progress.easy.percentage}
            />
            <ProgressChip
              level="Medium"
              completed={progress.medium.completed}
              total={progress.medium.total}
              percentage={progress.medium.percentage}
            />
            <ProgressChip
              level="Tough"
              completed={progress.tough.completed}
              total={progress.tough.total}
              percentage={progress.tough.percentage}
            />
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 0.5, height: 24, borderColor: "divider" }}
            />
            <ProgressChip
              level="Overall"
              completed={progress.overall.completed}
              total={progress.overall.total}
              percentage={progress.overall.percentage}
            />
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <SubtopicDetails
          subtopic={selectedSubtopic}
          onCompletionChange={handleSubtopicCompletionChange}
        />
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
