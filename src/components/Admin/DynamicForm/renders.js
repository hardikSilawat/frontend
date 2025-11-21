import React, { useCallback } from "react";
import { Controller } from "react-hook-form";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Box,
  Switch,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  InputAdornment,
  Button,
  Typography,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CloudUpload,
  Close,
  DeleteOutline,
} from "@mui/icons-material";

/**
 * Renders a text input field (normal text, email, password, etc.)
 */
export const renderTextField = (
  field,
  commonProps,
  control,
  showPassword,
  togglePasswordVisibility,
  errors,
  formState
) => {
  const { gridProps, ...textFieldProps } = commonProps || {};
  const error = errors?.[field.name];
  const helperText = error?.message;

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: { onChange, value, ...fieldProps } }) => (
        <FormControl
          fullWidth
          error={!!error}
          disabled={field.disabled || formState?.isSubmitting}
        >
          <TextField
            {...textFieldProps}
            {...fieldProps}
            error={!!error}
            helperText={helperText}
            type={
              field.type === "password" && showPassword?.[field.name]
                ? "text"
                : field.type
            }
            value={value || ""}
            onChange={(e) => {
              onChange(e);
              field.onChange?.(e);
            }}
            InputProps={{
              ...(field.type === "password" && {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility?.(field.name)}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword?.[field.name] ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }),
            }}
          />
        </FormControl>
      )}
    />
  );
};

/**
 * Renders a select/dropdown field
 */
export const renderSelectField = (
  field,
  commonProps,
  control,
  errors,
  formState
) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: { onChange, value, ...fieldProps } }) => (
      <FormControl
        fullWidth
        error={!!errors?.[field.name]}
        disabled={field.disabled || formState?.isSubmitting}
      >
        <InputLabel>{commonProps.label}</InputLabel>
        <Select
          {...fieldProps}
          value={value || (field.multiple ? [] : "")}
          multiple={field.multiple}
          onChange={(e) => {
            onChange(e);
            field.onChange?.(e);
          }}
          label={commonProps.label}
        >
          {field.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {errors?.[field?.name] && (
          <FormHelperText>{errors?.[field?.name].message}</FormHelperText>
        )}
      </FormControl>
    )}
  />
);

/**
 * Renders a checkbox field
 */
export const renderCheckboxField = (field, commonProps, control, formState) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: { onChange, value, ...fieldProps } }) => (
      <FormControlLabel
        control={
          <Checkbox
            {...fieldProps}
            checked={!!value}
            onChange={(e) => {
              onChange(e.target.checked);
              field.onChange?.(e);
            }}
            disabled={field.disabled || formState?.isSubmitting}
          />
        }
        label={commonProps.label}
      />
    )}
  />
);

/**
 * Renders a switch/toggle field
 */
export const renderSwitchField = (field, commonProps, control, formState) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: { onChange, value, ...fieldProps } }) => (
      <FormControlLabel
        control={
          <Switch
            {...fieldProps}
            checked={!!value}
            onChange={(e) => {
              onChange(e.target.checked);
              field.onChange?.(e);
            }}
            disabled={field.disabled || formState?.isSubmitting}
          />
        }
        label={commonProps.label}
      />
    )}
  />
);

/**
 * Renders a toggle button group field
 */
export const renderToggleButtonField = (
  field,
  commonProps,
  control,
  errors,
  formState
) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: { onChange, value, ...fieldProps } }) => (
      <FormControl fullWidth>
        <InputLabel
          shrink
          sx={{ position: "relative", transform: "none", mb: 1 }}
        >
          {commonProps.label}
        </InputLabel>
        <ToggleButtonGroup
          {...fieldProps}
          value={value || ""}
          exclusive
          fullWidth
          onChange={(e, newValue) => {
            if (newValue !== null) {
              onChange(newValue);
              field.onChange?.(e);
            }
          }}
          disabled={field.disabled || formState.isSubmitting}
        >
          {field.options.map((option) => (
            <ToggleButton key={option.value} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {errors?.[field.name] && (
          <FormHelperText error>{errors?.[field.name].message}</FormHelperText>
        )}
      </FormControl>
    )}
  />
);

/**
 * Renders a custom field using a render prop
 */
export const renderCustomField = (field, control, errors, formState) => (
  <Controller
    name={field.name}
    control={control}
    render={({ field: { onChange, value, ...fieldProps } }) =>
      field.render({
        field: {
          ...fieldProps,
          value: value || "",
          onChange: (e) => {
            const newValue = e?.target?.value ?? e;
            onChange(newValue);
            field.onChange?.(e);
          },
          disabled: field.disabled || formState.isSubmitting,
        },
        formState: { isSubmitting: formState.isSubmitting, errors },
      })
    }
  />
);

/**
 * Dispatcher: picks which renderer to use based on field.type
 */
/**
 * Renders an image upload field with preview
 */
// In renders.js
export const renderImageUploadField = (
  field,
  commonProps,
  control,
  filePreviews = {},
  setFilePreviews = () => {},
  errors,
  formState
) => {
  const error = errors?.[field.name];
  const handleImageChange = (e, onChange) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews((prev) => ({
          ...prev,
          [field.name]: {
            url: reader.result,
            file,
            name: file.name,
          },
        }));
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const removeImage = (onChange) => {
    setFilePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[field.name];
      return newPreviews;
    });
    onChange(null);
    if (field.inputRef?.current) {
      field.inputRef.current.value = "";
    }
  };

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: { onChange, value, ...fieldProps } }) => (
        <Box sx={{ width: "100%", mb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 1,
              color: error ? 'error.main' : 'text.secondary',
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              {commonProps.label}
              {commonProps.required && " *"}
            </span>
            {commonProps.helperText && (
              <Typography
                component="span"
                variant="caption"
                color="textSecondary"
                sx={{ ml: 1 }}
              >
                {commonProps.helperText}
              </Typography>
            )}
          </Typography>

          {!(filePreviews[field.name] || value) ? (
            <Button
              component="label"
              variant="outlined"
              fullWidth
              error={!!error}
              startIcon={<CloudUpload />}
              sx={{
                py: 1.5,
                color: error ? 'error.main' : 'primary.main',
                borderColor: error ? 'error.main' : undefined,
                borderStyle: "dashed",
                "&:hover": {
                  borderStyle: "dashed",
                  backgroundColor: "action.hover",
                  borderColor: error ? 'error.main' : undefined,
                },
              }}
            >
              Choose File
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, onChange)}
                style={{ display: "none" }}
                ref={field.inputRef}
              />
            </Button>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                border: 1,
                borderColor: error ? 'error.main' : 'divider',
                borderRadius: 1,
                backgroundColor: error ? 'error.light' : 'background.paper',
              }}
            >
              <Box
                component="img"
                src={filePreviews[field.name]?.url || value}
                alt="Preview"
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 0.5,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  noWrap
                  variant="body2"
                  title={filePreviews[field.name]?.name || "Uploaded image"}
                >
                  {filePreviews[field.name]?.name || "Uploaded image"}
                </Typography>
              </Box>
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => removeImage(onChange)}
                startIcon={<DeleteOutline />}
                sx={{
                  whiteSpace: "nowrap",
                  minWidth: "auto",
                }}
              >
                Remove
              </Button>
            </Box>
          )}
          {error && (
            <FormHelperText error sx={{ mt: 1 }}>
              {error.message}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
};

// Update the renderField function to handle the image type
export const renderField = (
  field,
  {
    control,
    errors,
    formState,
    filePreviews = {},
    setFilePreviews = () => {},
    showPassword = {},
    setShowPassword = () => {},
  }
) => {
  const commonProps = {
    label: field.label,
    helperText: field.helperText,
    fullWidth: true,
    disabled: field.disabled || formState.isSubmitting,
    error: !!errors[field.name],
    ...field,
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "number":
    case "tel":
    case "url":
      return renderTextField(
        field,
        commonProps,
        control,
        showPassword,
        togglePasswordVisibility,
        errors,
        formState
      );

    case "select":
      return renderSelectField(field, commonProps, control, errors, formState);

    case "checkbox":
      return renderCheckboxField(
        field,
        commonProps,
        control,
        errors,
        formState
      );

    case "switch":
      return renderSwitchField(field, commonProps, control, errors, formState);

    case "toggle":
      return renderToggleButtonField(
        field,
        commonProps,
        control,
        errors,
        formState
      );

    case "image":
      return renderImageUploadField(
        field,
        commonProps,
        control,
        filePreviews,
        setFilePreviews,
        errors,
        formState
      );

    case "custom":
      return renderCustomField(field, control, errors, formState);

    default:
      return renderTextField(
        field,
        commonProps,
        control,
        showPassword,
        togglePasswordVisibility,
        errors,
        formState
      );
  }
};
