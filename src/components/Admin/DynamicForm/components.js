import React from "react";
import { Grid, Typography } from "@mui/material";

/** Wraps form fields to maintain consistent layout and spacing */
export const FormFieldWrapper = ({ children, gridProps = { xs: 12, sm: 6, md: 4 } }) => (
  <Grid item {...gridProps}>
    {children}
  </Grid>
);

/** Displays a label with an optional required indicator */
export const LabelWithRequired = ({ label, required }) => (
  <>
    {label}
    {required && <span style={{ color: "red" }}> *</span>}
  </>
);
