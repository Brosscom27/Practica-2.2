import { useState } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCustomTheme } from '../context/ThemeContext';

const menu = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Almacenes', icon: <WarehouseIcon />, path: '/warehouses' },
  { label: 'Categorías', icon: <CategoryIcon />, path: '/categories' },
  { label: 'Proveedores', icon: <LocalShippingIcon />, path: '/suppliers' },
  { label: 'Productos', icon: <Inventory2Icon />, path: '/products' },
  { label: 'Reportes', icon: <AssessmentIcon />, path: '/reports' }
];

export const Layout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const { logout } = useAuth();
  const { mode, toggleTheme } = useCustomTheme();

  const drawerWidth = open ? 250 : 65;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          transition: 'width 0.2s',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            transition: 'width 0.2s',
            overflowX: 'hidden'
          }
        }}
      >
        <Toolbar sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center', px: open ? 2 : 1 }}>
          {open && <Typography variant="h6">Inventario</Typography>}
          <IconButton onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <List>
          {menu.map((item) => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{ justifyContent: open ? 'initial' : 'center', px: 2.5 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <List>
          <ListItemButton onClick={toggleTheme} sx={{ justifyContent: open ? 'initial' : 'center', px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
              {mode === 'dark' ? <LightModeIcon sx={{ color: 'warning.main' }} /> : <DarkModeIcon />}
            </ListItemIcon>
            <ListItemText primary={mode === 'dark' ? 'Modo Claro' : 'Modo Oscuro'} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
          <ListItemButton onClick={logout} sx={{ justifyContent: open ? 'initial' : 'center', px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ color: 'error' }} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${drawerWidth}px)`, transition: 'width 0.2s' }}>
        {children}
      </Box>
    </Box>
  );
};
