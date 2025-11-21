'use client';

import { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Collapse, 
  Box, 
  Typography,
  Chip,
  Divider,
  useTheme,
  Paper,
} from '@mui/material';
import { alpha } from "@mui/material/styles";
import { ExpandLess, ExpandMore, CheckCircle } from '@mui/icons-material';

const chapters = [
  {
    id: 'arrays',
    title: 'Arrays',
    problems: [
      { id: 'two-sum', title: 'Two Sum', level: 'easy' },
      { id: 'best-time-to-buy', title: 'Best Time to Buy and Sell Stock', level: 'easy' },
      { id: 'product-except-self', title: 'Product of Array Except Self', level: 'medium' },
    ]
  },
  {
    id: 'linked-lists',
    title: 'Linked Lists',
    problems: [
      { id: 'reverse-list', title: 'Reverse a Linked List', level: 'easy' },
      { id: 'detect-cycle', title: 'Linked List Cycle', level: 'medium' },
    ]
  },
  // Add more chapters as needed
];

export default function DSAChapterList({ onSelectChapter, selectedChapter, progress }) {
  const [openChapters, setOpenChapters] = useState({});
  const theme = useTheme();

  // Initialize all chapters as closed
  useEffect(() => {
    const initialState = {};
    chapters.forEach(chapter => {
      initialState[chapter.id] = false;
    });
    setOpenChapters(initialState);
  }, []);

  const toggleChapter = (chapterId) => {
    setOpenChapters(prev => {
      // Create a new state with all chapters closed
      const newState = {};
      Object.keys(prev).forEach(id => {
        newState[id] = false;
      });
      // Toggle the clicked chapter
      newState[chapterId] = !prev[chapterId];
      return newState;
    });
  };

  const getCompletedCount = (chapterId) => {
    const chapterProgress = progress[chapterId] || {};
    return Object.values(chapterProgress).filter(Boolean).length;
  };

  return (
    <Paper 
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 2, 
          fontWeight: 600,
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Box 
          component="span" 
          sx={{ 
            width: 4, 
            height: 20, 
            bgcolor: 'primary.main',
            borderRadius: 1
          }} 
        />
        DSA Topics
      </Typography>
      
      <List 
        component="nav" 
        sx={{ 
          flex: 1,
          overflowY: 'auto',
          pr: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.action.hover,
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.action.selected,
          }
        }}
      >
        {chapters.map((chapter) => {
          const isOpen = openChapters[chapter.id] || false;
          const completedCount = getCompletedCount(chapter.id);
          const totalProblems = chapter.problems.length;
          
          return (
            <Box key={chapter.id} sx={{ mb: 1 }}>
              <ListItem 
                disablePadding 
                secondaryAction={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {completedCount > 0 && (
                      <Chip 
                        size="small" 
                        label={`${completedCount}/${totalProblems}`} 
                        color="success" 
                        variant="outlined"
                        sx={{ 
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          height: 22
                        }}
                      />
                    )}
                    <Chip 
                      size="small" 
                      label={totalProblems} 
                      color="primary" 
                      variant="outlined"
                      sx={{ 
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        height: 22
                      }}
                    />
                  </Box>
                }
              >
                <ListItemButton 
                  onClick={() => toggleChapter(chapter.id)}
                  selected={selectedChapter?.id === chapter.id}
                  sx={{ 
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      }
                    }
                  }}
                >
                  <ListItemText 
                    primary={
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600,
                          color: selectedChapter?.id === chapter.id 
                            ? theme.palette.primary.main 
                            : theme.palette.text.primary
                        }}
                      >
                        {chapter.title}
                      </Typography>
                    } 
                  />
                  {isOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box 
                  sx={{ 
                    pl: 2.5,
                    ml: 1.5,
                    borderLeft: `2px solid ${theme.palette.divider}`,
                    py: 0.5
                  }}
                >
                  <List component="div" disablePadding>
                    {chapter.problems.map((problem) => (
                      <ListItem 
                        key={problem.id} 
                        disablePadding
                        onClick={() => onSelectChapter({ ...chapter, problem })}
                      >
                        <ListItemButton
                          selected={selectedChapter?.id === chapter.id && selectedChapter?.problem?.id === problem.id}
                          sx={{ 
                            borderRadius: 1,
                            pl: 2.5,
                            '&.Mui-selected': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.08),
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                              }
                            }
                          }}
                        >
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            width: '100%'
                          }}>
                            <CheckCircle 
                              fontSize="small" 
                              color={progress[chapter.id]?.[problem.id] ? 'success' : 'disabled'} 
                              sx={{ 
                                opacity: progress[chapter.id]?.[problem.id] ? 1 : 0.5,
                                flexShrink: 0
                              }} 
                            />
                            <ListItemText 
                              primary={
                                <Typography 
                                  variant="body2"
                                  sx={{
                                    color: selectedChapter?.id === chapter.id && selectedChapter?.problem?.id === problem.id
                                      ? theme.palette.primary.main
                                      : progress[chapter.id]?.[problem.id]
                                        ? theme.palette.text.secondary
                                        : theme.palette.text.primary,
                                    textDecoration: progress[chapter.id]?.[problem.id] ? 'line-through' : 'none',
                                    fontWeight: selectedChapter?.id === chapter.id && selectedChapter?.problem?.id === problem.id
                                      ? 500
                                      : 'normal'
                                  }}
                                >
                                  {problem.title}
                                </Typography>
                              } 
                            />
                            <Chip 
                              label={problem.level} 
                              size="small" 
                              color={
                                problem.level === 'easy' ? 'success' : 
                                problem.level === 'medium' ? 'warning' : 'error'
                              }
                              variant="outlined"
                              sx={{ 
                                textTransform: 'capitalize',
                                fontSize: '0.6rem',
                                height: 20,
                                fontWeight: 500,
                                border: 'none',
                                backgroundColor: 
                                  problem.level === 'easy' ? alpha(theme.palette.success.main, 0.1) :
                                  problem.level === 'medium' ? alpha(theme.palette.warning.main, 0.1) :
                                  alpha(theme.palette.error.main, 0.1),
                                color: 
                                  problem.level === 'easy' ? theme.palette.success.dark :
                                  problem.level === 'medium' ? theme.palette.warning.dark :
                                  theme.palette.error.dark
                              }}
                            />
                          </Box>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Collapse>
              <Divider sx={{ my: 1, opacity: 0.5 }} />
            </Box>
          );
        })}
      </List>
    </Paper>
  );
}