"use client";

import { useState, useEffect, useCallback } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close,
} from "@mui/icons-material";
import { DataTable, DynamicForm } from "@/components/Admin/page";
import AdminMainLayout from "@/components/AdminMainLayout/page";
import { api } from "@/apiHandler/page";
import { toast } from "react-toastify";
import { useConfirm } from "@/hooks/useConfirm";
import theme from "@/app/theme";

export default function TopicsPage() {
  const [state, setState] = useState({
    topics: [],
    loading: true,
    page: 0,
    rowsPerPage: 10,
    totalRows: 0,
    searchTerm: "",
  });
  const [topicToUpdate, setTopicToUpdate] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const { confirm } = useConfirm();

  const fetchTopics = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      const params = new URLSearchParams({
        page: state.page + 1,
        limit: state.rowsPerPage,
      });

      if (state.searchTerm) {
        params.append("search", state.searchTerm);
      }

      const response = await api.get(`/topics?${params.toString()}`);

      if (response.success) {
        setState((prev) => ({
          ...prev,
          topics: response.data.topics,
          totalRows: response.data.pagination.total,
          loading: false,
        }));
      } else {
        throw new Error(response.message || "Failed to fetch topics");
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || "Failed to fetch topics",
      }));
      toast.error(error.response?.data?.message || "Failed to fetch topics");
    }
  }, [state.page, state.rowsPerPage, state.searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTopics();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchTopics]);

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

  const handleDelete = async (topic) => {
    try {
      await confirm({
        type: "error",
        title: "Delete Topic",
        message: `Are you sure you want to delete "${topic.name}"?`,
        confirmText: "Delete",
        details: [
          { label: "Name", value: topic.name },
          { label: "Difficulty", value: topic.difficulty },
        ],
        onConfirm: async () => {
          try {
            const response = await api.delete(`/topics/${topic._id}`);
            if (response.success) {
              toast.success("Topic deleted successfully");
              fetchTopics();
            } else {
              throw new Error(response.message || "Failed to delete topic");
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
        toast.error(error.response?.data?.message || "Failed to delete topic");
      }
    }
  };

  const handleAdd = () => {
    setTopicToUpdate(null);
    setOpenForm(true);
  };

  const handleEdit = (topic) => {
    setTopicToUpdate(topic);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setTopicToUpdate(null);
  };

  const handleSubmitTopic = async (data) => {
    const isUpdate = Boolean(topicToUpdate);
    const endpoint = isUpdate ? `/topics/${topicToUpdate._id}` : "/topics";
    const method = isUpdate ? "put" : "post";
    const successMessage = isUpdate
      ? "Topic updated successfully"
      : "Topic created successfully";

    try {
      const payload = {
        name: data.name,
        description: data.description || "",
        difficulty: data.difficulty,
        isActive: data.isActive !== false,
      };

      const response = await api[method](endpoint, payload);

      if (!response.success) {
        throw new Error(response.message || "Failed to save topic");
      }

      toast.success(successMessage);
      fetchTopics();
      handleCloseForm();
    } catch (error) {
      console.error(`Error ${isUpdate ? "updating" : "saving"} topic:`, error);
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Topic Name",
      flex: 1,
      minWidth: 200,
      render: (row) => (
        <Typography variant="body1" fontWeight="medium">
          {row.name}
        </Typography>
      ),
    },
    {
      field: "slug",
      headerName: "Slug",
      flex: 1,
      minWidth: 150,
      render: (row) => (
        <Typography variant="body2" color="textSecondary">
          {row.slug}
        </Typography>
      ),
    },
    {
      field: "difficulty",
      headerName: "Difficulty",
      width: 120,
      render: (row) => {
        const colorMap = {
          easy: "success",
          medium: "warning",
          hard: "error",
        };
        return (
          <Chip
            label={row.difficulty}
            color={colorMap[row.difficulty] || "default"}
            size="small"
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      render: (row) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row);
              }}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const formFields = [
    {
      name: "name",
      label: "Topic Name",
      type: "text",
      required: true,
      fullWidth: true,
      gridProps: { xs: 12 },
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      fullWidth: true,
      gridProps: { xs: 12 },
      multiline: true,
      rows: 3,
    },
    {
      name: "difficulty",
      label: "Difficulty",
      type: "select",
      required: true,
      options: [
        { value: "easy", label: "Easy" },
        { value: "medium", label: "Medium" },
        { value: "hard", label: "Hard" },
      ],
      gridProps: { xs: 12, sm: 6 },
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
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h5" component="h1" fontWeight="bold">
            Topics
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Topic
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search topics..."
            value={state.searchTerm}
            onChange={handleSearch}
            disabled={state.loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: state.loading && (
                <CircularProgress color="inherit" size={20} />
              ),
            }}
          />
        </Paper>

        <DataTable
          columns={columns}
          rows={state.topics || []}
          loading={state.loading}
          page={state.page}
          rowsPerPage={state.rowsPerPage}
          totalRows={state.totalRows}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onRowClick={(row) => handleEdit(row)}
          noDataText="No topics found"
        />

        <Dialog
          open={openForm}
          onClose={handleCloseForm}
          maxWidth="sm"
          fullWidth
        >
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
              <Typography variant="h6" component="div">
                {topicToUpdate ? "Edit Topic" : "Add New Topic"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ opacity: 0.8, display: "block", mt: 0.5 }}
              >
                {topicToUpdate
                  ? "Update the topic details"
                  : "Fill in the details to add a new topic"}
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
              fields={formFields}
              onSubmit={handleSubmitTopic}
              initialValues={topicToUpdate || {}}
              submitButtonText={topicToUpdate ? "Update Topic" : "Create Topic"}
              onCancel={handleCloseForm}
              gridContainerProps={{ spacing: 2 }}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </AdminMainLayout>
  );
}
