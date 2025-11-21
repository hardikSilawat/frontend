// src/components/DSA/ProgressTracker.js
"use client";

import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  useTheme,
  Divider,
  alpha,
} from "@mui/material";
import { EmojiEvents, CheckCircle, Star } from "@mui/icons-material";
import { ExpandMore } from "@mui/icons-material";

export default function DSAProgressTracker({ progress }) {
  const theme = useTheme();

  // Calculate overall progress
  const calculateProgress = () => {
    let totalProblems = 0;
    let completedProblems = 0;
    let easyCount = 0;
    let mediumCount = 0;
    let hardCount = 0;
    let easyCompleted = 0;
    let mediumCompleted = 0;
    let hardCompleted = 0;

    // Sample data - replace with your actual data
    Object.values(progress).forEach((chapter) => {
      Object.entries(chapter).forEach(([problemId, isCompleted]) => {
        totalProblems++;
        if (isCompleted) completedProblems++;

        // Determine problem difficulty (this is a simplified example)
        if (
          problemId.includes("easy") ||
          problemId === "two-sum" ||
          problemId === "best-time-to-buy"
        ) {
          easyCount++;
          if (isCompleted) easyCompleted++;
        } else if (
          problemId.includes("medium") ||
          problemId === "product-except-self" ||
          problemId === "detect-cycle"
        ) {
          mediumCount++;
          if (isCompleted) mediumCompleted++;
        } else {
          hardCount++;
          if (isCompleted) hardCompleted++;
        }
      });
    });

    return {
      total: totalProblems,
      completed: completedProblems,
      percentage:
        totalProblems > 0
          ? Math.round((completedProblems / totalProblems) * 100)
          : 0,
      easy: { total: easyCount, completed: easyCompleted },
      medium: { total: mediumCount, completed: mediumCompleted },
      hard: { total: hardCount, completed: hardCompleted },
    };
  };

  const { total, completed, percentage, easy, medium, hard } =
    calculateProgress();

  const ProgressItem = ({ label, value, total, color }) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={500} color={`${color}.main`}>
          {value}/{total}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={total > 0 ? (value / total) * 100 : 0}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: theme.palette.action.hover,
          "& .MuiLinearProgress-bar": {
            borderRadius: 3,
            backgroundColor: theme.palette[color].main,
          },
        }}
      />
    </Box>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        position: "sticky",
        top: 20,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
              flexShrink: 0,
            }}
          >
            <EmojiEvents fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Your Progress
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {percentage}%
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: theme.palette.primary.light,
            background: `linear-gradient(90deg, ${theme.palette.primary.main} ${percentage}%, ${theme.palette.action.hover} ${percentage}%)`,
            height: 10,
            borderRadius: 5,
            mb: 2,
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {completed} of {total} problems
          </Typography>
          <Typography variant="caption" color="primary" fontWeight={500}>
            {percentage}% Complete
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="subtitle2"
        sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}
      >
        Difficulty Breakdown
      </Typography>

      <ProgressItem
        label="Easy"
        value={easy.completed}
        total={easy.total}
        color="success"
      />
      <ProgressItem
        label="Medium"
        value={medium.completed}
        total={medium.total}
        color="warning"
      />
      <ProgressItem
        label="Hard"
        value={hard.completed}
        total={hard.total}
        color="error"
      />
    </Paper>
  );
}
