import api from "@/apiHandler/page";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Button, CircularProgress } from "@mui/material";
import { useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

function MarkAsCompleted({
  subtopicId,
  isCompleted: propIsCompleted,
  onStatusChange,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const mounted = useRef(false);
  const [isCompleted, setIsCompleted] = useState(propIsCompleted || false);

  // Update local state when prop changes
  useEffect(() => {
    setIsCompleted(propIsCompleted || false);
  }, [propIsCompleted]);

  // Fetch initial completion status
  const fetchCompletionStatus = useCallback(async () => {
    if (!subtopicId) return;

    try {
      setIsLoading(true);
      const response = await api.get(`/topics/completed/${subtopicId}`);

      if (response.status === 200) {
        const { isCompleted: status } = response.data;
        setIsCompleted(status);
        onStatusChange?.(subtopicId, status);
      }
    } catch (error) {
      console.error("Error fetching completion status:", error);
      toast.error("Failed to load completion status");
    } finally {
      setIsLoading(false);
    }
  }, [subtopicId, onStatusChange]);

  // Toggle completion status
  const toggleCompletion = useCallback(async () => {
    if (!subtopicId) return;

    try {
      setIsLoading(true);
      const response = await api.post(`/topics/toggle-complete`, {
        subtopicId,
      });

      if (response.status === 200) {
        const { isCompleted: newStatus, message } = response.data;
        setIsCompleted(newStatus);
        onStatusChange?.(subtopicId, newStatus);
        toast.success(message);
      } else {
        throw new Error(
          response.data?.message || "Failed to update completion status"
        );
      }
    } catch (error) {
      console.error("Error updating completion status:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update status. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [subtopicId, onStatusChange]);

  // Fetch status on component mount and when subtopicId changes
  useEffect(() => {
    if (mounted.current) return;
    fetchCompletionStatus();
    mounted.current = true;
  }, []);

  return (
    <>
      <Button
        variant={isCompleted ? "contained" : "outlined"}
        color={isCompleted ? "success" : "primary"}
        disabled={isLoading}
        onClick={toggleCompletion}
        startIcon={
          isCompleted ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />
        }
        sx={{
          borderRadius: "6px",
          textTransform: "capitalize",
          px: 4,
          py: 1.5,
          fontWeight: "600",
          fontSize: 16,
          "&:hover": {
            backgroundColor: isCompleted ? "success.dark" : "primary.main",
            color: "#fff",
          },
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : isCompleted ? (
          "Completed"
        ) : (
          "Mark as Completed"
        )}
      </Button>
    </>
  );
}

export default MarkAsCompleted;
