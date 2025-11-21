"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Add, Search, Edit, Delete, Close } from "@mui/icons-material";
import DynamicForm from "@/components/Admin/DynamicForm";
import { DataTable } from "@/components/Admin/page";
import AdminMainLayout from "@/components/AdminMainLayout/page";
import { api } from "@/apiHandler/page";
import { toast } from "react-toastify";
import { useConfirm } from "@/hooks/useConfirm";
import theme from "@/app/theme";

export default function UsersPage() {
  const [state, setState] = useState({
    users: [],
    loading: true,
    page: 0,
    rowsPerPage: 10,
    totalRows: 0,
    searchTerm: "",
  });
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const { confirm } = useConfirm();
  const controllerRef = useRef(null);

  const fetchUsers = useCallback(
    async (signal) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        // Build query parameters
        const params = new URLSearchParams({
          page: state.page + 1,
          limit: state.rowsPerPage,
        });

        // Add search term if it exists
        if (state.searchTerm) {
          params.append("search", state.searchTerm);
        }

        const response = await api.get(`/auth/admin/users?${params.toString()}`, {
          signal,
        });

        if (response.success) {
          setState((prev) => ({
            ...prev,
            users: response.data.users,
            totalRows: response.data.pagination.total,
            loading: false,
          }));
        } else {
          throw new Error(response.message || "Failed to fetch users");
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching users:", error);
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error.response?.data?.message || "Failed to fetch users",
          }));
          toast.error(error.response?.data?.message || "Failed to fetch users");
        }
      }
    },
    [state.page, state.rowsPerPage, state.searchTerm]
  );

  // Debounce search with request cancellation
  useEffect(() => {
    // Cancel previous request if it exists
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Create new AbortController for this request
    controllerRef.current = new AbortController();

    // Only search if search term is empty or has at least 2 characters
    const shouldSearch = !state.searchTerm || state.searchTerm.length >= 2;

    const timer = setTimeout(() => {
      if (shouldSearch || state.searchTerm === "") {
        fetchUsers(controllerRef.current.signal);
      }
    }, 300); // Reduced debounce time for better UX

    return () => {
      clearTimeout(timer);
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [fetchUsers, state.searchTerm]);

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

  const handleDelete = async (user) => {
    try {
      await confirm({
        type: "error",
        title: "Delete User",
        message: `Are you sure you want to delete ${user.name}?`,
        confirmText: "Delete",
        details: [
          { label: "Email", value: user.email },
          { label: "Role", value: user.role },
        ],
        onConfirm: async () => {
          try {
            const response = await api.delete(`/auth/admin/delete-user/${user._id}`);
            if (response.success) {
              fetchUsers();
              toast.success("User deleted successfully");
            } else {
              throw new Error(response.message || "Failed to delete user");
            }
          } catch (error) {
            console.error("API Error:", error);
            throw error; // This will trigger the catch block below
          }
        },
      });
    } catch (error) {
      if (error !== "cancelled") {
        console.error("Error in confirmation:", error);
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleAdd = () => {
    setUserToUpdate(null);
    setOpenForm(true);
  };

  const handleEdit = (user) => {
    setUserToUpdate(user);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setUserToUpdate(null);
  };

  const handleSubmitUser = async (data) => {
    const isUpdate = Boolean(userToUpdate);
    const endpoint = isUpdate
      ? `/auth/admin/update-details/${userToUpdate._id}`
      : "/auth/register";
    const method = isUpdate ? "put" : "post";
    const successMessage = isUpdate
      ? "User updated successfully"
      : "User created successfully";

    try {
      const payload = {
        name: data.name,
        email: data.email,
        role: data.role,
        ...(!isUpdate && { password: data.password }), // Only include password for new users
      };

      const response = await api[method](endpoint, payload);

      if (!response.success) {
        const errorMessage = Array.isArray(response.message)
          ? response.message.join(". ")
          : response.message;
        throw new Error(errorMessage);
      }
      toast.success(response.message || successMessage);
      fetchUsers();
      handleCloseForm();
    } catch (error) {
      console.error(`Error ${isUpdate ? "updating" : "saving"} user:`, error);
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  const columns = [
    {
      field: "user",
      headerName: "User",
      flex: 1,
      minWidth: 240,
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
          <Avatar
            src={row.avatar}
            alt={row.name}
            sx={{
              width: 40,
              height: 40,
              bgcolor: "primary.main",
              color: "white",
              fontSize: "1rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {row.name ? row.name.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 500,
                color: "text.primary",
                lineHeight: 1.3,
                textTransform: "capitalize",
              }}
            >
              {row.name || "Unknown User"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "text.secondary",
                fontSize: "0.7rem",
                lineHeight: 1.3,
                mt: 0.25,
              }}
            >
              ID: {row._id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      render: (row) => (
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            fontSize: "0.875rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
            display: "inline-block",
            verticalAlign: "middle",
          }}
        >
          {row.email}
        </Typography>
      ),
    },

    {
      field: "role",
      headerName: "Role",
      width: 100,
      headerAlign: "center",
      align: "center",
      render: (row) => {
        const role = row.role?.toLowerCase() || "user";
        const roleConfig = {
          admin: { bg: "#1976d2", hover: "#1565c0" },
          user: { bg: "#4caf50", hover: "#388e3c" },
        };

        const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

        return (
          <Chip
            label={displayRole}
            size="small"
            variant="filled"
            sx={{
              fontWeight: 500,
              minWidth: 70,
              color: "white",
              backgroundColor: roleConfig[role].bg,
              "&:hover": { backgroundColor: roleConfig[role].hover },
              "& .MuiChip-label": { px: 1.5, py: 0.5 },
            }}
          />
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 120,
      render: (row) => (
        <Box>
          <Typography variant="body2">
            {row.createdAt
              ? new Date(row.createdAt).toLocaleDateString()
              : "N/A"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.updatedAt
              ? `Updated: ${new Date(row.updatedAt).toLocaleDateString()}`
              : ""}
          </Typography>
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
          <Tooltip title="Edit user">
            <IconButton
              size="small"
              onClick={() => handleEdit(row)}
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

          <Tooltip title="Delete user">
            <IconButton
              size="small"
              onClick={() => handleDelete(row)}
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
            Users ({state?.totalRows})
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
              letterSpacing: "0.5px",
              textTransform: "none",
              // padding: '8px 20px',
              borderRadius: "8px",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, #3cb815 100%)`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                "&::after": {
                  transform: "translateX(0%)",
                },
              },
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(255, 255, 255, 0.1)",
                transform: "translateX(-100%)",
                transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              },
              "& .MuiButton-startIcon": {
                transition: "transform 0.3s ease",
              },
              "&:hover .MuiButton-startIcon": {
                transform: "scale(1.1)",
              },
            }}
          >
            Add User
          </Button>
        </Box>

        <Box
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
            placeholder="Search users by name or email..."
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
                  height: "1.2rem", // Prevent layout shift
                }}
              >
                {
                  state.searchTerm && state.searchTerm.length < 2
                    ? "Type at least 2 characters to search"
                    : " " // Empty space to maintain consistent height
                }
              </Box>
            }
          />

          <DataTable
            rows={state.users}
            columns={columns}
            loading={state.loading}
            page={state.page}
            rowsPerPage={state.rowsPerPage}
            totalRows={state.totalRows}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            emptyMessage="No users found"
          />
        </Box>

        <Dialog
          open={openForm}
          onClose={handleCloseForm}
          maxWidth="md"
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
                {userToUpdate ? "Edit User" : "Add New User"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ opacity: 0.8, display: "block", mt: 0.5 }}
              >
                {userToUpdate
                  ? "Update the user details"
                  : "Fill in the details to add a new user"}
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
                  name: "name",
                  label: "Full Name",
                  type: "text",
                  required: true,
                  gridProps: { size: { xs: 12, sm: 12, md: 6 } },
                },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  required: true,
                  gridProps: { size: { xs: 12, sm: 12, md: 6 } },
                },
                ...(!userToUpdate
                  ? [
                      {
                        name: "password",
                        label: "Password",
                        type: "password",
                        required: true,
                        gridProps: { size: { xs: 12, sm: 12, md: 6 } },
                      },
                    ]
                  : []),

                {
                  name: "role",
                  label: "Role",
                  type: "select",
                  options: [
                    { value: "user", label: "User" },
                    { value: "admin", label: "Admin" },
                  ],
                  required: true,
                  gridProps: { size: { xs: 12, sm: 12, md: 6 } },
                },
              ]}
              initialValues={
                userToUpdate || {
                  name: "",
                  email: "",
                  role: "user",
                  password: "",
                }
              }
              onSubmit={handleSubmitUser}
              onCancel={handleCloseForm}
              submitText={userToUpdate ? "Update User" : "Add User"}
              validationSchema={{
                email: [
                  {
                    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                    message: "Please enter a valid email address",
                  },
                ],
                ...(!userToUpdate && {
                  password: [
                    {
                      test: (value) => value && value.length >= 6,
                      message: "Password must be at least 6 characters long",
                    },
                  ],
                }),
              }}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </AdminMainLayout>
  );
}
