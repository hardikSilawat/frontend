"use client";

// hooks/useUserDynamicForm.js
import { useState } from "react";

export const useUserDynamicForm = (initialValues = {}, validationSchema = {}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue = value;

    if (type === "checkbox") {
      newValue = checked;
    }

    if (type === "file") {
      newValue = files.length > 1 ? Array.from(files) : files[0];
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form based on schema
  const validateForm = () => {
    let newErrors = {};

    Object.keys(validationSchema).forEach((field) => {
      const rules = validationSchema[field];
      const value = formData[field];

      if (rules?.required && !value) {
        newErrors[field] = "This field is required";
      } else if (rules?.pattern && !rules.pattern.test(value)) {
        newErrors[field] = rules.message || "Invalid value";
      } else if (rules?.validate && typeof rules.validate === "function") {
        const result = rules.validate(value);
        if (result !== true) newErrors[field] = result;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    validateForm,
  };
};
