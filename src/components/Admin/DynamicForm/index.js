import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Grid,
  Typography,
  Divider,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { useValidateField } from "./helpers";
import { renderField } from "./renders";

const DynamicForm = ({
  fields = [],
  initialValues = {},
  onSubmit,
  onCancel,
  submitText = "Save",
  cancelText = "Cancel",
  validationSchema,
  title,
  showActions = true,
  spacing = 2,
  submitButtonProps = {},
  cancelButtonProps = {},
  gridProps = {},
}) => {
  const [formState, setFormState] = useState({
    isSubmitting: false,
    error: null,
  });
  const [showPassword, setShowPassword] = useState({});
  const [filePreviews, setFilePreviews] = useState({});
  const fileInputRefs = useRef({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: initialValues,
  });

  const validateField = useValidateField(validationSchema);

  /** Submit handler (unchanged from your code) */
  const handleFormSubmit = useCallback(
    async (data) => {
      try {
        setFormState((prev) => ({ ...prev, isSubmitting: true, error: null }));
        clearErrors();

        const fieldErrors = fields.reduce((acc, { name, required }) => {
          const value = data[name];
          if (
            required &&
            (value === "" || value === undefined || value === null)
          ) {
            acc[name] = { message: "This field is required" };
          } else if (validationSchema?.[name]) {
            const validationResult = validateField(name, value, data);
            if (validationResult !== true)
              acc[name] = { message: validationResult };
          }
          return acc;
        }, {});

        if (Object.keys(fieldErrors).length > 0) {
          Object.entries(fieldErrors).forEach(([name, error]) =>
            setError(name, { type: "manual", message: error.message })
          );
          setFormState((prev) => ({ ...prev, isSubmitting: false }));
          return;
        }

        const result = await onSubmit(data);
        // console.log(result, initialValues);
        if (result?.success === true) {
          reset(initialValues);
          return true;
        }
        return false;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An error occurred while submitting";
        setFormState((prev) => ({ ...prev, error: errorMessage }));
        throw error;
      } finally {
        setFormState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [
      fields,
      onSubmit,
      reset,
      initialValues,
      validateField,
      validationSchema,
      clearErrors,
      setError,
    ]
  );

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Grid container spacing={spacing}>
        {title && (
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
        )}
        {fields.map((field) => (
          <React.Fragment key={field.name}>
            {field.type === "divider" ? (
              <Grid item {...field.gridProps}>
                <Divider sx={{ my: 2 }} />
                {field.label && (
                  <Typography variant="subtitle2" color="text.secondary">
                    {field.label}
                  </Typography>
                )}
              </Grid>
            ) : (
              <Grid item {...(field.gridProps || {})}>
                {renderField(
                  {
                    ...field,
                    inputRef:
                      fileInputRefs.current[field.name] ||
                      (fileInputRefs.current[field.name] = { current: null }),
                  },
                  {
                    control,
                    errors,
                    formState,
                    filePreviews,
                    setFilePreviews,
                    showPassword,
                    setShowPassword,
                  }
                )}
              </Grid>
            )}
          </React.Fragment>
        ))}
        {formState.error && (
          <Grid size={12}>
            <Typography color="error" variant="body2">
              {formState.error}
            </Typography>
          </Grid>
        )}
        {showActions && (
          <Grid
            size={12}
            sx={{
              mt: 1,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Stack
              direction={{ xs: "column-reverse", sm: "row-reverse" }}
              spacing={2}
              alignItems="center"
              sx={{
                width: "100%",
                maxWidth: { xs: "100%", sm: "500px" },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formState.isSubmitting}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 8,
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  textTransform: "none",
                  fontSize: "0.95rem",
                  background:
                    "linear-gradient(90deg, #3cb815 0%, #4caf50 100%)",
                  boxShadow: "0 4px 15px rgba(60, 184, 21, 0.3)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(60, 184, 21, 0.4)",
                    "&:before": {
                      left: "100%",
                    },
                  },
                  "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "0 2px 10px rgba(60, 184, 21, 0.3)",
                  },
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    transition: "0.5s",
                  },
                  "&.Mui-disabled": {
                    background:
                      "linear-gradient(90deg, #e0e0e0 0%, #bdbdbd 100%)",
                    boxShadow: "none",
                    color: "#9e9e9e",
                  },
                  ...submitButtonProps.sx,
                }}
                startIcon={
                  formState.isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Save
                      sx={{
                        fontSize: "1.1rem",
                        transition: "transform 0.3s ease",
                        "button:hover &": {
                          transform: "scale(1.1)",
                        },
                      }}
                    />
                  )
                }
                {...submitButtonProps}
              >
                {formState.isSubmitting ? "Processing..." : submitText}
              </Button>

              {onCancel && (
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={formState.isSubmitting}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 8,
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                    textTransform: "none",
                    fontSize: "0.95rem",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    color: "text.primary",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "rgba(0, 0, 0, 0.3)",
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                    },
                    "&:active": {
                      transform: "translateY(1px)",
                      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
                    },
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "rgba(0, 0, 0, 0.02)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    },
                    "&:hover:before": {
                      opacity: 1,
                    },
                    "&.Mui-disabled": {
                      borderColor: "rgba(0, 0, 0, 0.06)",
                      color: "rgba(0, 0, 0, 0.26)",
                    },
                    ...cancelButtonProps.sx,
                  }}
                  {...cancelButtonProps}
                >
                  {cancelText}
                </Button>
              )}
            </Stack>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DynamicForm;
