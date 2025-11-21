import { forwardRef, useState, useImperativeHandle } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Slide,
  useMediaQuery,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ConfirmDialog = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    title: "Are you sure?",
    message: "This action cannot be undone.",
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "info",
    onConfirm: () => {},
    onCancel: () => {},
    showCancel: true,
    maxWidth: "sm",
    hideCloseButton: false,
  });

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const show = (customConfig) => {
    setConfig((prev) => ({
      ...prev,
      ...customConfig,
    }));
    setOpen(true);
    return new Promise((resolve) => {
      resolve(true);
    });
  };

  const hide = () => {
    setOpen(false);
    setLoading(false);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await config.onConfirm();
      hide();
    } catch (error) {
      console.error("Confirmation error:", error);
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  const getColor = () => {
    switch (config.type) {
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "success":
        return "success";
      default:
        return "primary";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!loading ? hide : null}
      maxWidth={config.maxWidth}
      fullWidth
      TransitionComponent={Transition}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
          minWidth: isMobile ? "100%" : 300,
          maxWidth: isMobile ? "100%" : "50%",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: `${getColor()}.main`,
          color: "common.white",
          py: 1.5,
          px: 2.5,
        }}
      >
        <Typography
          component="span" // Changed from default h2 to span
          variant="h6"
          sx={{
            flex: 1,
            color: "inherit", // Ensure text color is inherited from DialogTitle
          }}
        >
          {config.title}
        </Typography>

        {!config.hideCloseButton && !loading && (
          <IconButton
            edge="end"
            color="inherit"
            onClick={hide}
            size="small"
            sx={{
              color: "common.white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Typography variant="body1" my={2} fontWeight={500}>
          {config.message}
        </Typography>
        {config.details && (
          <Box sx={{ mt: 2, bgcolor: "action.hover", p: 2, borderRadius: 1 }}>
            {config.details.map((detail, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  {detail.label}
                </Typography>
                <Typography variant="body2">{detail.value}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        {config.showCancel && (
          <Button
            disableElevation
            onClick={hide}
            disabled={loading}
            color="inherit"
            variant="contained"
            sx={{
              minWidth: 100,
              "&:hover": { color: "common.white", bgcolor: "primary.main" },
            }}
          >
            {config.cancelText}
          </Button>
        )}
        <Button
          disableElevation
          onClick={handleConfirm}
          disabled={loading}
          color={getColor()}
          variant="contained"
          sx={{
            minWidth: 100,
            "&:hover": { color: "common.white", bgcolor: "primary.main" },
          }}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {loading ? "Processing..." : config.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ConfirmDialog.displayName = "ConfirmDialog";

export default ConfirmDialog;
