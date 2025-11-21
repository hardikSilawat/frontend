// src/components/DSA/ChapterDetail.js
"use client";

import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Code,
  Article,
  YouTube,
  CheckCircle,
  OpenInNew,
  Timeline,
  Lightbulb,
  CodeOff,
} from "@mui/icons-material";
import Link from "next/link";

export default function ChapterDetail({ chapter, progress, onToggleComplete }) {
  const theme = useTheme();
  const { problem } = chapter;
  const isCompleted = progress[problem?.id];

  if (!problem) return null;

  const difficultyColor = {
    easy: "success",
    medium: "warning",
    hard: "error",
  }[problem.level];

  const difficultyLabel = {
    easy: "Beginner",
    medium: "Intermediate",
    hard: "Advanced",
  }[problem.level];

  const difficultyIcon = {
    easy: <Timeline color="success" />,
    medium: <Lightbulb color="warning" />,
    hard: <CodeOff color="error" />,
  }[problem.level];

  // Sample problem description - replace with actual content
  const problemDescription =
    {
      "two-sum": `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
      "reverse-list": `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
      "best-time-to-buy": `You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
      "product-except-self": `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.`,
      "detect-cycle": `Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.`,
    }[problem.id] || "Problem description not available.";

  // Sample similar problems - replace with actual data
  const similarProblems = [
    { id: "three-sum", title: "Three Sum", level: "medium" },
    { id: "four-sum", title: "Four Sum", level: "medium" },
    {
      id: "two-sum-ii",
      title: "Two Sum II - Input Array Is Sorted",
      level: "medium",
    },
  ]
    .filter((p) => p.id !== problem.id)
    .slice(0, 3);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Chip
            label={chapter.title}
            size="small"
            sx={{
              mb: 1.5,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.dark,
              fontWeight: 500,
            }}
          />
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 1.5, fontWeight: 700, lineHeight: 1.3 }}
          >
            {problem.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Chip
              icon={difficultyIcon}
              label={difficultyLabel}
              color={difficultyColor}
              variant="outlined"
              sx={{
                textTransform: "capitalize",
                fontWeight: 500,
                pl: 1,
                "& .MuiChip-icon": {
                  mr: 0.5,
                },
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CheckCircle
                fontSize="small"
                color={isCompleted ? "success" : "disabled"}
                sx={{
                  opacity: isCompleted ? 1 : 0.5,
                  mr: 0.5,
                }}
              />
              <Typography
                variant="body2"
                color={isCompleted ? "success.main" : "text.secondary"}
                sx={{ fontWeight: 500 }}
              >
                {isCompleted ? "Completed" : "Mark as complete"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Checkbox
          checked={isCompleted}
          onChange={() => onToggleComplete(chapter.id, problem.id)}
          icon={<CheckCircle />}
          checkedIcon={<CheckCircle color="success" />}
          sx={{
            p: 0,
            "& .MuiSvgIcon-root": {
              fontSize: 32,
            },
          }}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}
        >
          Problem Statement
        </Typography>
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.7,
            color: theme.palette.text.secondary,
            "&:not(:last-child)": {
              mb: 2,
            },
          }}
        >
          {problemDescription}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 6,
          "& .MuiButton-root": {
            textTransform: "none",
            fontWeight: 500,
            px: 3,
            py: 1.5,
            borderRadius: 2,
            boxShadow: "none",
            "&:hover": {
              boxShadow: theme.shadows[2],
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          },
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<Code />}
          endIcon={<OpenInNew fontSize="small" />}
          component={MuiLink}
          href={`https://leetcode.com/problems/${problem.id.replace(
            /-/g,
            "-"
          )}/`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          }}
        >
          Solve on LeetCode
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          startIcon={<YouTube />}
          endIcon={<OpenInNew fontSize="small" />}
          component={MuiLink}
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
            problem.title + " solution"
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            borderColor: theme.palette.divider,
            "&:hover": {
              borderColor: theme.palette.text.secondary,
              backgroundColor: "transparent",
            },
          }}
        >
          Watch Solution
        </Button>

        <Button
          variant="outlined"
          startIcon={<Article />}
          endIcon={<OpenInNew fontSize="small" />}
          component={MuiLink}
          href={`https://www.geeksforgeeks.org/${problem.id.replace(
            /-/g,
            "-"
          )}/`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            borderColor: theme.palette.divider,
            "&:hover": {
              borderColor: theme.palette.text.secondary,
              backgroundColor: "transparent",
            },
          }}
        >
          Read Article
        </Button>
      </Box>

      <Box sx={{ mt: "auto" }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}
        >
          Similar Problems
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            borderColor: theme.palette.divider,
          }}
        >
          <List disablePadding>
            {similarProblems.map((similar, index) => (
              <Box key={similar.id}>
                {index > 0 && <Divider />}
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Chip
                      label={similar.level}
                      size="small"
                      variant="outlined"
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "0.65rem",
                        height: 22,
                        fontWeight: 500,
                        border: "none",
                        backgroundColor:
                          similar.level === "easy"
                            ? alpha(theme.palette.success.main, 0.1)
                            : similar.level === "medium"
                            ? alpha(theme.palette.warning.main, 0.1)
                            : alpha(theme.palette.error.main, 0.1),
                        color:
                          similar.level === "easy"
                            ? theme.palette.success.dark
                            : similar.level === "medium"
                            ? theme.palette.warning.dark
                            : theme.palette.error.dark,
                      }}
                    />
                  }
                >
                  <MuiLink
                    component={Link}
                    href={`/dashboard?problem=${similar.id}`}
                    color="inherit"
                    underline="none"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      p: 2,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {similar.title}
                        </Typography>
                      }
                    />
                  </MuiLink>
                </ListItem>
              </Box>
            ))}
          </List>
        </Paper>
      </Box>
    </Paper>
  );
}
