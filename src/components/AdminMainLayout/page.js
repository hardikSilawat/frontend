"use client";
import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { styled, alpha, useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CategoryIcon from "@mui/icons-material/Category";
import ClassIcon from "@mui/icons-material/Class";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StyleIcon from "@mui/icons-material/Style";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import api from "@/apiHandler/page";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { selectAdmin, setAdmin } from "@/redux/reducers";
import { Collapse } from "@mui/material";
import { useState } from "react";
import { Payment, Topic } from "@mui/icons-material";
import Link from "next/link";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 240;

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardCustomizeIcon sx={{ color: "primary.main" }} />,
    path: "/admin/dashboard",
    description: "View analytics and reports",
  },
  {
    text: "Users",
    icon: <GroupIcon sx={{ color: "secondary.main" }} />,
    path: "/admin/users",
    description: "Manage user accounts",
  },
  {
    text: "Topics",
    icon: <Topic sx={{ color: "success.main" }} />,
    path: "/admin/topics",
    description: "Manage your products",
    children: [
      {
        text: "All Topics",
        path: "/admin/topics/all-topics",
        description: "View all topics",
        icon: (
          <ShoppingBasketIcon fontSize="small" sx={{ color: "info.main" }} />
        ),
      },
      {
        text: "Sub Topics",
        path: "/admin/topics/sub-topics",
        description: "Organize product categories",
        icon: <CategoryIcon fontSize="small" sx={{ color: "primary.main" }} />,
      },
      // {
      //   text: "Sub Categories",
      //   path: "/admin/products/subcategories",
      //   description: "Organize product subcategories",
      //   icon: <ClassIcon fontSize="small" sx={{ color: "secondary.main" }} />,
      // },
    ],
  },
  { divider: true },
  {
    text: "Logout",
    icon: <LogoutIcon sx={{ color: "error.main" }} />,
    action: "logout",
    description: "Sign out from your account",
  },
];

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  boxShadow: theme.shadows[2],
}));

export default function AdminMainLayout({ children, window }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const theme = useTheme();
  const admin = useSelector(selectAdmin);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuStates, setMenuStates] = useState(() => {
    // Initialize all menu states at once
    const initialState = {};
    menuItems.forEach((item) => {
      if (!item.divider) {
        const hasChildren = item.children && item.children.length > 0;
        const isActive =
          pathname === item.path ||
          (hasChildren &&
            item.children.some((child) => pathname.startsWith(child.path)));
        initialState[item.path || item.text] = {
          open: isActive,
          isHovered: false,
        };
      }
    });
    return initialState;
  });

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await api.post(`/auth/logout`);
      const { success, message } = response;
      if (success) {
        toast.success(message || "Successfully logged out");
        Cookies.remove("AdminToken", { path: "/" });
        dispatch(setAdmin(null));
        router.push("/admin/login");
      } else {
        toast.error(message || "Failed to logout");
      }
    } catch (err) {
      const errorMessage =
        err?.response?.message || err.message || "Error during logout";
      toast.error(errorMessage);
    }
  };

  const handleNavigation = (item) => {
    if (item.action === "logout") {
      handleLogout();
    } else if (item.path) {
      router.push(item.path);
      if (window?.innerWidth < 600) {
        setMobileOpen(false);
      }
    }
  };

  const drawer = (
    <Box>
      <DrawerHeader>
        <Box
          sx={{
            my: 0.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "70%",
            height: "100%",
            textDecoration: "none",
          }}
        >
          <Typography variant="h6" sx={{ color: "primary.contrastText" }}>
            DSA Admin
          </Typography>
        </Box>
      </DrawerHeader>
      <Divider />

      <List sx={{ flexGrow: 1, p: 1 }}>
        {menuItems.map((item, index) => {
          if (item.divider) {
            return (
              <Divider
                key={`divider-${index}`}
                sx={{ my: 1, borderColor: "divider" }}
              />
            );
          }

          const hasChildren = item.children && item.children.length > 0;
          const isActive =
            pathname === item.path ||
            (hasChildren &&
              item.children.some((child) => pathname.startsWith(child.path)));

          // Create a unique key for each menu item
          const itemKey = item.path || item.text;

          const menuState = menuStates[itemKey] || {
            open: false,
            isHovered: false,
          };
          const { open, isHovered } = menuState;

          const handleClick = (e) => {
            if (hasChildren) {
              e.stopPropagation();
              setMenuStates((prev) => ({
                ...prev,
                [itemKey]: {
                  ...prev[itemKey],
                  open: !prev[itemKey]?.open ?? false,
                },
              }));
            } else {
              handleNavigation(item);
            }
          };

          const handleMouseEnter = () => {
            setMenuStates((prev) => ({
              ...prev,
              [itemKey]: {
                ...prev[itemKey],
                isHovered: true,
              },
            }));
          };

          const handleMouseLeave = () => {
            setMenuStates((prev) => ({
              ...prev,
              [itemKey]: {
                ...prev[itemKey],
                isHovered: false,
              },
            }));
          };

          return (
            <React.Fragment key={item.text}>
              <motion.div
                initial={false}
                animate={{
                  scale: isHovered ? 1.01 : 1,
                  transition: { duration: 0.15 },
                }}
                style={{ margin: "4px 0" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <ListItem
                  disablePadding
                  onClick={handleClick}
                  sx={{
                    borderRadius: 1,
                    overflow: "hidden",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <Tooltip
                    title={item.description}
                    placement="right"
                    arrow
                    disableHoverListener={!item.description}
                  >
                    <ListItemButton
                      selected={isActive}
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "primary.main",
                          color: "primary.contrastText",
                          "&:hover": {
                            backgroundColor: "primary.dark",
                          },
                          "& .MuiTypography-root": {
                            fontWeight: 500,
                          },
                        },
                        borderRadius: 1,
                        transition: theme.transitions.create(
                          ["background-color", "transform"],
                          {
                            duration: theme.transitions.duration.shorter,
                          }
                        ),
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: isActive ? "#fff" : "inherit",
                          minWidth: 40,
                          transition: "transform 0.2s",
                          transform: isHovered ? "scale(1.1)" : "scale(1)",
                          "& svg": {
                            color: isActive && "#fff !important",
                          },
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={500}>
                            {item.text}
                          </Typography>
                        }
                      />
                      {hasChildren && (
                        <motion.div
                          animate={{
                            rotate: open ? 270 : 90,
                            transition: { duration: 0.2 },
                          }}
                        >
                          <ChevronLeftIcon
                            sx={{
                              fontSize: "1.25rem",
                              color: isActive
                                ? "primary.contrastText"
                                : "inherit",
                            }}
                          />
                        </motion.div>
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              </motion.div>

              {hasChildren && (
                <Collapse
                  in={open}
                  timeout="auto"
                  unmountOnExit
                  sx={{
                    "& .MuiCollapse-wrapperInner": {
                      position: "relative",
                      ml: 3.5,
                      paddingLeft: 2.5,
                      marginTop: "4px",
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "8px",
                        bottom: "8px",
                        width: "2px",
                        background: `linear-gradient(
                          to bottom, 
                          ${alpha(theme.palette.primary.main, 0)}, 
                          ${alpha(theme.palette.primary.main, 0.6)} 20%, 
                          ${alpha(theme.palette.primary.main, 0.6)} 80%, 
                          ${alpha(theme.palette.primary.main, 0)}
                        )`,
                        borderRadius: "4px",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      },
                    },
                  }}
                >
                  <List component="div" disablePadding dense>
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.path;
                      return (
                        <motion.div
                          key={child.text}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          style={{ margin: "4px 0" }}
                        >
                          <ListItemButton
                            onClick={() => handleNavigation(child)}
                            selected={isChildActive}
                            sx={{
                              pr: 2,
                              py: 0.75,
                              borderRadius: "8px",
                              minHeight: "38px",
                              margin: "3px 0",
                              position: "relative",
                              overflow: "hidden",
                              background: isChildActive
                                ? `linear-gradient(90deg, ${alpha(
                                    theme.palette.primary.main,
                                    0.08
                                  )} 0%, ${alpha(
                                    theme.palette.primary.main,
                                    0.04
                                  )} 100%)`
                                : "transparent",
                              "&:before": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: "50%",
                                transform: "translateY(-50%) scaleY(0.5)",
                                height: "0%",
                                width: "2px",
                                backgroundColor: theme.palette.primary.main,
                                borderRadius: "0 2px 2px 0",
                                transition: "all 0.2s ease-in-out",
                                opacity: 0,
                              },
                              "&:hover": {
                                background: `linear-gradient(90deg, ${alpha(
                                  theme.palette.primary.main,
                                  0.1
                                )} 0%, ${alpha(
                                  theme.palette.primary.main,
                                  0.05
                                )} 100%)`,
                                transform: "translateX(2px)",
                                "&:before": {
                                  content: '""',
                                  position: "absolute",
                                  left: 0,
                                  top: "50%",
                                  transform: "translateY(-50%) scaleY(1)",
                                  height: "50%",
                                  width: "3px",
                                  background: `linear-gradient(to bottom, 
                                    ${theme.palette.primary.light}, 
                                    ${theme.palette.primary.main}, 
                                    ${theme.palette.primary.light})`,
                                  borderRadius: "0 4px 4px 0",
                                  boxShadow: `0 0 12px ${alpha(
                                    theme.palette.primary.main,
                                    0.7
                                  )}`,
                                  opacity: 1,
                                },
                                "& .MuiListItemIcon-root": {
                                  color: theme.palette.primary.main,
                                  transform: "scale(1.1)",
                                },
                                "& .MuiTypography-root": {
                                  color: theme.palette.primary.dark,
                                },
                              },
                              transition: theme.transitions.create(["all"], {
                                duration: theme.transitions.duration.shorter,
                                easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                              }),
                            }}
                          >
                            {child.icon && (
                              <ListItemIcon
                                sx={{
                                  minWidth: "25px",
                                  color: isChildActive
                                    ? theme.palette.primary.dark
                                    : theme.palette.text.secondary,
                                  transition: "all 0.2s ease-in-out",
                                  "& svg": {
                                    fontSize: "1.1rem",
                                    transition: "transform 0.2s",
                                  },
                                }}
                              >
                                {child.icon}
                              </ListItemIcon>
                            )}
                            <ListItemText
                              disableTypography
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    letterSpacing: "0.01em",
                                    color: isChildActive
                                      ? theme.palette.primary.dark
                                      : theme.palette.text.secondary,
                                    fontWeight: isChildActive ? 600 : 400,
                                    lineHeight: 1.5,
                                    transition: "all 0.2s ease-in-out",
                                    letterSpacing: "0.01em",
                                  }}
                                >
                                  {child.text}
                                </Typography>
                              }
                            />
                            {isChildActive && (
                              <Box
                                component="span"
                                sx={{
                                  width: "4px",
                                  height: "20px",
                                  bgcolor: theme.palette.primary.main,
                                  borderRadius: "4px",
                                  position: "absolute",
                                  right: "8px",
                                  opacity: 0.8,
                                  boxShadow: `0 0 8px ${theme.palette.primary.main}80`,
                                }}
                              />
                            )}
                          </ListItemButton>
                        </motion.div>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>

      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={admin?.avatar}
            alt={admin?.name?.charAt(0) || "U"}
            sx={{
              width: 40,
              height: 40,
              bgcolor: admin?.avatar ? "transparent" : "primary.main",
              color: admin?.avatar ? "inherit" : "primary.contrastText",
              mr: 1.5,
            }}
          >
            {admin?.name?.charAt(0) || "U"}
          </Avatar>
          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            <Typography variant="subtitle2" noWrap fontWeight={500}>
              {admin?.name || "Admin User"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {admin?.email || "admin@example.com"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "background.paper",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
        elevation={0}
      >
        <Toolbar disableGutters sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              color: "text.primary",
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{
                  ml: 1,
                  p: 0.5,
                  border: `2px solid ${theme.palette.divider}`,
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    transform: "translateY(-2px)",
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.primary.main,
                      0.15
                    )}`,
                  },
                }}
                aria-controls={Boolean(anchorEl) ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? "true" : undefined}
              >
                <Avatar
                  src={admin?.avatar}
                  alt={admin?.name?.charAt(0) || "U"}
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: admin?.avatar ? "transparent" : "primary.main",
                    color: admin?.avatar ? "inherit" : "primary.contrastText",
                    fontWeight: 600,
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    transition: "transform 0.2s",
                  }}
                >
                  {admin?.name?.charAt(0) || "U"}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                elevation: 3,
                sx: {
                  overflow: "visible",
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
            >
              <MenuItem sx={{ cursor: "default" }}>
                <Avatar
                  src={admin?.avatar}
                  alt={admin?.name?.charAt(0) || "U"}
                  sx={{
                    bgcolor: admin?.avatar ? "transparent" : "primary.main",
                    color: admin?.avatar ? "inherit" : "primary.contrastText",
                  }}
                >
                  {admin?.name?.charAt(0) || "U"}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={500} noWrap>
                    {admin?.name || "Admin User"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {admin?.email || "admin@example.com"}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />

              <MenuItem component={Link} href="/admin/settings">
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <Typography>Settings</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <Typography color="error">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          slotProps={{
            root: {
              keepMounted: true,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "background.default",
          minHeight: "100vh",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{ height: "100%" }}
          >
            <Box
              sx={{
                maxWidth: 1400,
                mx: "auto",
                width: "100%",
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
                minHeight: "calc(100vh - 100px)",
              }}
            >
              {children}
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
