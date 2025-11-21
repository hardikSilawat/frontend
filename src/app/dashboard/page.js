// src/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, useTheme, useMediaQuery, Grid } from '@mui/material';
import dynamic from 'next/dynamic';

// Dynamically import components for code splitting
const DSAChapterList = dynamic(() => import('@/components/DSA/ChapterList'), { 
  ssr: false,
  loading: () => <Box sx={{ p: 3, textAlign: 'center' }}>Loading chapters...</Box>
});
const DSAProgressTracker = dynamic(() => import('@/components/DSA/ProgressTracker'), { 
  ssr: false,
  loading: () => <Box sx={{ p: 2, textAlign: 'center' }}>Loading progress...</Box>
});
const ChapterDetail = dynamic(() => import('@/components/DSA/ChapterDetail'), {
  ssr: false,
  loading: () => <Box sx={{ p: 3, textAlign: 'center' }}>Loading problem details...</Box>
});

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [progress, setProgress] = useState({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedProgress = localStorage.getItem('dsaProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('dsaProgress', JSON.stringify(progress));
    }
  }, [progress, isClient]);

  const handleToggleComplete = (chapterId, problemId) => {
    setProgress(prev => ({
      ...prev,
      [chapterId]: {
        ...prev[chapterId],
        [problemId]: !prev[chapterId]?.[problemId]
      }
    }));
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: 4,
        minHeight: '100vh',
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)'
          : theme.palette.background.default,
      }}
    >
      <Box sx={{ 
        maxWidth: 1600, 
        mx: 'auto',
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[1]
      }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2 0%, #2196f3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            DSA Learning Path
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Track your progress and master Data Structures and Algorithms
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Sidebar - Chapter List */}
          <Grid size={{xs: 12, md: 4, lg: 3}}>
            <DSAChapterList 
              onSelectChapter={setSelectedChapter} 
              selectedChapter={selectedChapter}
              progress={progress}
            />
          </Grid>

          {/* Main Content - Problem Details */}
          <Grid size={{xs: 12, md: 8, lg: 6}}>
            {selectedChapter ? (
              <ChapterDetail 
                chapter={selectedChapter} 
                progress={progress[selectedChapter.id] || {}}
                onToggleComplete={handleToggleComplete}
              />
            ) : (
              <Paper 
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  minHeight: 400,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: theme.palette.action.hover,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontSize: 40,
                      color: theme.palette.text.secondary,
                      lineHeight: 1
                    }}
                  >
                    📚
                  </Box>
                </Box>
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  Select a chapter to begin
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.disabled"
                  sx={{ maxWidth: 300 }}
                >
                  Choose a topic from the left panel to view problems and track your progress
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Right Sidebar - Progress Tracker */}
          {!isMobile && (
            <Grid size={{xs: 12, lg: 3}}>
              <DSAProgressTracker progress={progress} />
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}   