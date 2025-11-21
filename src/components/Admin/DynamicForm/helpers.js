import { useCallback } from "react";

/** Validates a single field against the validation schema */
export const useValidateField = (validationSchema) =>
  useCallback(
    (name, value, formValues = {}) => {
      if (!validationSchema?.[name]) return true;
      const errorMessage = validationSchema[name].find(
        ({ test }) => !test(value, formValues)
      )?.message;
      return errorMessage || true;
    },
    [validationSchema]
  );
