import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Grid,
  Divider,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArticleIcon from "@mui/icons-material/Article";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CodeIcon from "@mui/icons-material/Code";
import InfoIcon from "@mui/icons-material/Info";
import MarkAsCompleted from "./MarkAsCompleted";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const ResourceCard = ({ icon, title, description, href, buttonText }) => (
  <StyledCard>
    <CardActionArea
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <CardContent sx={{ flexGrow: 1, width: "100%" }}>
        <Box display="flex" alignItems="center" mb={1.5}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          sx={{ mt: "auto" }}
          onClick={(e) => e.stopPropagation()}
        >
          {buttonText}
        </Button>
      </CardContent>
    </CardActionArea>
  </StyledCard>
);

const SubtopicDetails = ({ subtopic, onCompletionChange }) => {
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (!subtopic) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          p: 3,
        }}
      >
        <InfoIcon color="primary" sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
        <Typography variant="h4" gutterBottom color="primary">
          Welcome to DSA Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Select a topic and subtopic from the sidebar to view details and
          resources.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This application helps you track your progress in learning Data
          Structures and Algorithms. Click on any subtopic to see detailed
          information, video tutorials, and practice problems.
        </Typography>
      </Box>
    );
  }

  const {
    name,
    difficulty,
    description,
    articleLink,
    youtubeLink,
    leetcodeLink,
  } = subtopic;

  const difficultyColor =
    {
      Easy: "success",
      Medium: "warning",
      Tough: "error",
    }[difficulty] || "default";

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {name}
            </Typography>
            <Chip
              label={difficulty}
              color={difficultyColor}
              size="medium"
              sx={{ fontWeight: "bold", textTransform: "uppercase" }}
            />
          </Box>
          <MarkAsCompleted
            subtopicId={subtopic?._id}
            isCompleted={subtopic?.isCompleted}
            onStatusChange={onCompletionChange}
          />
        </Box>
        <Divider sx={{ mb: 3 }} />
      </Box>

      <Grid container spacing={3}>
        {articleLink && (
          <Grid item xs={12} md={youtubeLink || leetcodeLink ? 6 : 12}>
            <ResourceCard
              icon={<ArticleIcon color="primary" fontSize="large" />}
              title="Article"
              description="Read detailed explanation and concepts about this topic."
              href={articleLink}
              buttonText="Read Article"
            />
          </Grid>
        )}

        {youtubeLink && (
          <Grid item xs={12} md={articleLink || leetcodeLink ? 6 : 12}>
            <ResourceCard
              icon={<YouTubeIcon color="error" fontSize="large" />}
              title="Video Tutorial"
              description="Watch a video explanation to better understand this concept."
              href={youtubeLink}
              buttonText="Watch Video"
            />
          </Grid>
        )}

        {leetcodeLink && (
          <Grid item xs={12} md={articleLink || youtubeLink ? 6 : 12}>
            <ResourceCard
              icon={<CodeIcon color="secondary" fontSize="large" />}
              title="Practice Problems"
              description="Solve problems on LeetCode to master this concept."
              href={leetcodeLink}
              buttonText="Solve Problems"
            />
          </Grid>
        )}
      </Grid>

      {description && (
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 3,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.02)",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            fontWeight="bold"
            display="flex"
            alignItems="center"
          >
            <InfoIcon color="primary" sx={{ mr: 1 }} />
            About This Topic
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </Paper>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default React.memo(SubtopicDetails);
