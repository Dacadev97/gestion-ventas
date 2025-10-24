import { Logout, Menu as MenuIcon, PointOfSale, People } from "@mui/icons-material";
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

const drawerWidth = 240;
const collapsedWidth = 72;

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

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
          {!collapsed && <ListItemText primary="Ventas" />}
        </ListItemButton>
        {user.role === "Administrador" && (
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
      </List>
    </Box>
  );

  const desktopDrawerWidth = useMemo(() => (collapsed ? collapsedWidth : drawerWidth), [collapsed]);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        component="nav"
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${desktopDrawerWidth}px)` },
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
          p: 3,
          width: { sm: `calc(100% - ${desktopDrawerWidth}px)` },
          ml: { sm: `${desktopDrawerWidth}px` },
          transition: (theme) => theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Toolbar />
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
