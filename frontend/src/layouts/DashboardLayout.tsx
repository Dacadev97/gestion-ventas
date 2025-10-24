import { Logout, Menu as MenuIcon, PointOfSale, People, BarChart } from "@mui/icons-material";
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { Link as RouterLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/index.ts";
import { logout } from "../features/auth/authSlice.ts";
import { getRoleFromToken } from "../utils/jwt.ts";
import { RoleName } from "../types/index.ts";

const drawerWidth = 240;
const collapsedWidth = 72;

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAppSelector((state) => state.auth);
  const tokenRole = getRoleFromToken(token);

  // Calculate drawer width before any early returns
  const desktopDrawerWidth = useMemo(() => (collapsed ? collapsedWidth : drawerWidth), [collapsed]);

  useEffect(() => {
    // Redirect to login if there's no user (session expired or not logged in)
    if (!user) {
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [user, navigate, location]);

  if (!user) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleCollapseToggle = () => {
    setCollapsed((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const drawerContent = (
    <Box sx={{ textAlign: "center" }}>
      <Box sx={{ py: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {!collapsed && (
          <Typography variant="h6">
            Banco Konecta
          </Typography>
        )}
      </Box>
      <Divider />
      <List sx={{ pt: 1 }}>
        <ListItemButton
          component={RouterLink}
          to="/sales"
          selected={location.pathname === "/sales"}
          sx={{
            justifyContent: collapsed ? "center" : "flex-start",
            px: collapsed ? 2 : 3,
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: "center" }}>
            <PointOfSale fontSize="small" />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Radicar Venta" />}
        </ListItemButton>
        {tokenRole === RoleName.ADMIN && (
          <ListItemButton
            component={RouterLink}
            to="/users"
            selected={location.pathname === "/users"}
            sx={{
              justifyContent: collapsed ? "center" : "flex-start",
              px: collapsed ? 2 : 3,
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: "center" }}>
              <People fontSize="small" />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Usuarios" />}
          </ListItemButton>
        )}
        <ListItemButton
          component={RouterLink}
          to="/stats"
          selected={location.pathname === "/stats"}
          sx={{
            justifyContent: collapsed ? "center" : "flex-start",
            px: collapsed ? 2 : 3,
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: "center" }}>
            <BarChart fontSize="small" />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Estadísticas" />}
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      <AppBar
        component="nav"
        position="fixed"
        sx={{
          width: { xs: "100%", sm: `calc(100% - ${desktopDrawerWidth}px)` },
          ml: { sm: `${desktopDrawerWidth}px` },
          transition: (theme) => theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2, display: { sm: "none" } }} onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gestión de Ventas
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user.name} ({user.role})
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
        >
          <Box onClick={handleDrawerToggle} sx={{ height: "100%" }}>
            {drawerContent}
          </Box>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: desktopDrawerWidth,
              transition: (theme) => theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
              overflowX: "hidden",
            },
          }}
          open
        >
          <Box display="flex" flexDirection="column" height="100%">
            <Box sx={{ display: "flex", justifyContent: "flex-end", px: 1, py: 1 }}>
              <IconButton onClick={handleCollapseToggle}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }}>{drawerContent}</Box>
          </Box>
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { sm: `${desktopDrawerWidth}px` },
          transition: (theme) => theme.transitions.create(["margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          p: 0,
          overflow: "hidden",
        }}
      >
        <Toolbar sx={{ width: "100%", maxWidth: "100%" }} />
        <Box sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, sm: 3, md: 4 }, width: "100%", maxWidth: "100%" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
