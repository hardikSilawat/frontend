"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { Add, Search, Edit, Delete, Close } from "@mui/icons-material";
import AdminMainLayout from "@/components/AdminMainLayout/page";
import DynamicForm from "@/components/Admin/DynamicForm";
import { api } from "@/apiHandler/page";
import { toast } from "react-toastify";
import { useConfirm } from "@/hooks/useConfirm";
import theme from "@/app/theme";
import { DataTable } from "@/components/Admin/page";

export default function SubtopicsPage() {
  const [state, setState] = useState({
    subtopics: [],
    topics: [],
    loading: true,
    page: 0,
    rowsPerPage: 10,
    totalRows: 0,
    searchTerm: "",
    selectedTopic: "",
    difficulty: "",
    status: "",
  });

  const [subtopicToUpdate, setSubtopicToUpdate] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const { confirm } = useConfirm();
  const controllerRef = useRef(null);

  const fetchSubtopics = useCallback(
    async (signal) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const params = new URLSearchParams({
          page: state.page + 1,
          limit: state.rowsPerPage,
        });

        if (state.searchTerm) params.append("search", state.searchTerm);
        if (state.selectedTopic) params.append("topic", state.selectedTopic);
        if (state.difficulty) params.append("difficulty", state.difficulty);
        if (state.status) params.append("status", state.status);

        const response = await api.get(`/subtopics?${params.toString()}`, {
          signal,
        });

        if (response.success) {
          setState((prev) => ({
            ...prev,
            subtopics: response.data.subtopics || [],
            totalRows: response.data.pagination?.total || 0,
            loading: false,
          }));
        } else {
          throw new Error(response.message || "Failed to fetch subtopics");
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching subtopics:", error);
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error.response?.data?.message || "Failed to fetch subtopics",
          }));
          toast.error(
            error.response?.data?.message || "Failed to fetch subtopics"
          );
        }
      }
    },
    [
      state.page,
      state.rowsPerPage,
      state.searchTerm,
      state.selectedTopic,
      state.difficulty,
      state.status,
    ]
  );

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();
    const timer = setTimeout(() => {
      fetchSubtopics(controllerRef.current.signal);
    }, 300);

    return () => {
      clearTimeout(timer);
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [fetchSubtopics]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await api.get("/topics?limit=1000");
        if (response.success) {
          setState((prev) => ({
            ...prev,
            topics: response.data.topics || [],
          }));
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        toast.error("Failed to load topics");
      }
    };

    fetchTopics();
  }, []);

  const handlePageChange = (_, newPage) => {
    setState((prev) => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (rowsPerPage) => {
    setState((prev) => ({
      ...prev,
      rowsPerPage,
      page: 0,
    }));
  };

  const handleSearch = (e) => {
    setState((prev) => ({
      ...prev,
      searchTerm: e.target.value,
      page: 0,
    }));
  };

  const handleAdd = () => {
    setSubtopicToUpdate(null);
    setOpenForm(true);
  };

  const handleEdit = (subtopic) => {
    setSubtopicToUpdate({
      ...subtopic,
      topicId: subtopic.topic?._id,
    });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSubtopicToUpdate(null);
  };

  const handleDelete = async (subtopic) => {
    try {
      await confirm({
        type: "error",
        title: "Delete Subtopic",
        message: `Are you sure you want to delete ${subtopic.name}?`,
        confirmText: "Delete",
        details: [
          { label: "Difficulty", value: subtopic.difficulty || "Not set" },
          { label: "Status", value: subtopic.status || "pending" },
        ],
        onConfirm: async () => {
          try {
            const response = await api.delete(`/subtopics/${subtopic._id}`);
            if (response.success) {
              fetchSubtopics();
              toast.success("Subtopic deleted successfully");
            } else {
              throw new Error(response.message || "Failed to delete subtopic");
            }
          } catch (error) {
            console.error("API Error:", error);
            throw error;
          }
        },
      });
    } catch (error) {
      if (error !== "cancelled") {
        console.error("Error in confirmation:", error);
        toast.error(
          error.response?.data?.message || "Failed to delete subtopic"
        );
      }
    }
  };

  const handleSubmitSubtopic = async (data) => {
    const isUpdate = Boolean(subtopicToUpdate);
    const endpoint = isUpdate
      ? `/subtopics/${subtopicToUpdate._id}`
      : "/subtopics";
    const method = isUpdate ? "put" : "post";

    try {
      const payload = {
        ...data,
        topic: data.topicId,
        order: parseInt(data.order) || 0,
      };

      const response = await api[method](endpoint, payload);

      if (!response.success) {
        const errorMessage = Array.isArray(response.message)
          ? response.message.join(". ")
          : response.message;
        throw new Error(errorMessage);
      }

      toast.success(
        response.message ||
          `Subtopic ${isUpdate ? "updated" : "created"} successfully`
      );
      fetchSubtopics();
      handleCloseForm();
    } catch (error) {
      console.error(
        `Error ${isUpdate ? "updating" : "saving"} subtopic:`,
        error
      );
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Subtopic",
      minWidth: 200,
      flex: 1,
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={500}
              textTransform="capitalize"
            >
              {row.name}
            </Typography>
            {row.topic?.name && (
              <Typography variant="caption" color="text.secondary">
                Topic: {row.topic.name}
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      field: "difficulty",
      headerName: "Difficulty",
      width: 120,
      render: (row) => {
        const difficulty = row.difficulty?.toLowerCase() || "";
        const colorMap = {
          easy: "success",
          medium: "warning",
          tough: "error",
        };

        return (
          <Chip
            label={difficulty || "Not set"}
            color={colorMap[difficulty] || "default"}
            size="small"
            variant="outlined"
          />
        );
      },
    },

    {
      field: "status",
      headerName: "Status",
      width: 120,
      headerAlign: "center",
      align: "center",
      render: (row) => {
        const status = row.status?.toLowerCase() || "pending";
        const statusConfig = {
          completed: { bg: "#4caf50", hover: "#388e3c" },
          pending: { bg: "#ff9800", hover: "#f57c00" },
        };

        return (
          <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            size="small"
            variant="filled"
            sx={{
              fontWeight: 500,
              minWidth: 100,
              color: "white",
              backgroundColor: statusConfig[status]?.bg || "default",
              "&:hover": {
                backgroundColor: statusConfig[status]?.hover || "default",
              },
              "& .MuiChip-label": { px: 1.5, py: 0.5 },
            }}
          />
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 150,
      render: (row) => (
        <Box>
          <Typography variant="body2">
            {row.createdAt
              ? new Date(row.createdAt).toLocaleDateString()
              : "N/A"}
          </Typography>
          {row.updatedAt && (
            <Typography variant="caption" color="text.secondary">
              Updated: {new Date(row.updatedAt).toLocaleDateString()}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "right",
      render: (row) => (
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, pr: 1 }}
        >
          <Tooltip title="Edit subtopic">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row);
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "action.hover",
                  color: "primary.main",
                },
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete subtopic">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row);
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "action.hover",
                  color: "error.main",
                },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <AdminMainLayout>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            py: 1.5,
            px: 2,
            color: theme.palette.common.white,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 500,
              textTransform: "uppercase",
              fontSize: 24,
              letterSpacing: "0.09em",
              textShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            Subtopics ({state.totalRows || 0})
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            Add Subtopic
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              boxShadow: 1,
            },
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search subtopics..."
            value={state.searchTerm}
            onChange={handleSearch}
            disabled={state.loading}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "background.paper",
                "&:hover fieldset": {
                  borderColor: "primary.light",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                  boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    color="action"
                    sx={{
                      color: "text.secondary",
                      ...(state.loading && { color: "primary.main" }),
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: state.loading && (
                <InputAdornment position="end">
                  <CircularProgress size={20} thickness={4} />
                </InputAdornment>
              ),
            }}
            helperText={
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color:
                    state.searchTerm && state.searchTerm.length < 2
                      ? "text.secondary"
                      : "transparent",
                  fontSize: "0.75rem",
                  height: "1.2rem",
                }}
              >
                {state.searchTerm && state.searchTerm.length < 2
                  ? "Type at least 2 characters to search"
                  : " "}
              </Box>
            }
          />
        </Paper>

        <Paper sx={{ position: "relative", minHeight: 400 }}>
          <DataTable
            rows={state.subtopics}
            columns={columns}
            loading={state.loading}
            page={state.page}
            rowsPerPage={state.rowsPerPage}
            totalRows={state.totalRows}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            emptyMessage="No subtopics found"
          />
        </Paper>
      </Box>

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            m: 0,
            p: 2.5,
            background: `linear-gradient(195deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            "& .MuiTypography-root": {
              fontWeight: 600,
              letterSpacing: "0.5px",
            },
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {subtopicToUpdate ? "Edit" : "Add New"} Subtopic
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.8, display: "block", mt: 0.5 }}
            >
              {subtopicToUpdate
                ? "Update the subtopic details"
                : "Fill in the details to add a new subtopic"}
            </Typography>
          </Box>

          <IconButton
            aria-label="close"
            onClick={handleCloseForm}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "common.white",
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DynamicForm
            fields={[
              {
                name: "topicId",
                label: "Topic",
                type: "select",
                options: state.topics.map((topic) => ({
                  value: topic._id,
                  label: topic.name,
                })),
                required: true,
                gridProps: { size: { xs: 12, sm: 12, md: 6 } },
              },
              {
                name: "name",
                label: "Subtopic Name",
                type: "text",
                required: true,
                gridProps: { size: { xs: 12, sm: 12, md: 6 } },
              },
              {
                name: "description",
                label: "Description",
                type: "textarea",
                fullWidth: true,
                gridProps: { size: { xs: 12, sm: 12, md: 12 } },
                multiline: true,
                rows: 3,
              },
              {
                name: "difficulty",
                label: "Difficulty",
                type: "select",
                options: [
                  { value: "easy", label: "Easy" },
                  { value: "medium", label: "Medium" },
                  { value: "tough", label: "Tough" },
                ],
                required: true,
                gridProps: { size: { xs: 12, sm: 6, md: 4 } },
              },
              {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                  { value: "pending", label: "Pending" },
                  { value: "completed", label: "Completed" },
                ],
                required: true,
                gridProps: { size: { xs: 12, sm: 6, md: 4 } },
              },
              {
                name: "order",
                label: "Order",
                type: "number",
                required: true,
                inputProps: { min: 0 },
                gridProps: { size: { xs: 12, sm: 6, md: 4 } },
              },
              {
                name: "youtubeLink",
                label: "YouTube Link",
                type: "url",
                gridProps: { size: { xs: 12, sm: 6, md: 4 } },
              },
              {
                name: "leetcodeLink",
                label: "LeetCode Link",
                type: "url",
                gridProps: { size: { xs: 12, sm: 6, md: 4 } },
              },
              {
                name: "articleLink",
                label: "Article Link",
                type: "url",
                gridProps: { size: { xs: 12, sm: 6, md: 4 } },
              },
            ]}
            initialValues={
              subtopicToUpdate || {
                name: "",
                description: "",
                topicId: "",
                difficulty: "easy",
                status: "pending",
                order: 0,
                youtubeLink: "",
                leetcodeLink: "",
                articleLink: "",
              }
            }
            onSubmit={handleSubmitSubtopic}
            onCancel={handleCloseForm}
            submitText={subtopicToUpdate ? "Update Subtopic" : "Add Subtopic"}
            validationSchema={{
              name: [
                {
                  test: (value) => value && value.trim().length > 0,
                  message: "Subtopic name is required",
                },
              ],
              description: [
                {
                  test: (value) => value && value.trim().length > 0,
                  message: "Description name is required",
                },
              ],
              topicId: [
                {
                  test: (value) => !!value,
                  message: "Please select a topic",
                },
              ],
              difficulty: [
                {
                  test: (value) => ["easy", "medium", "tough"].includes(value),
                  message: "Please select a valid difficulty",
                },
              ],
              order: [
                {
                  test: (value) => !isNaN(parseInt(value)),
                  message: "Order must be a number",
                },
              ],
            }}
          />
        </DialogContent>
      </Dialog>
    </AdminMainLayout>
  );
}
