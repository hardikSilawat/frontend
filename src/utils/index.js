// utils/index.js

// Function to get color based on difficulty level : easy -> success, medium -> warning, tough -> error
export function getLevelColor(level) {
  if (!level) return "default";
  const levelLower = level.toLowerCase();
  if (levelLower.includes("easy")) return "success";
  if (levelLower.includes("medium")) return "warning";
  if (levelLower.includes("tough")) return "error";
  return "default";
}
