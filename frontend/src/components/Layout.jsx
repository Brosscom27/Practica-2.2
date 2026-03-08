import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Link, useLocation } from 'react-router-dom';

const menu = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Almacenes', icon: <WarehouseIcon />, path: '/warehouses' },
  { label: 'Productos', icon: <Inventory2Icon />, path: '/products' },
  { label: 'Reportes', icon: <AssessmentIcon />, path: '/reports' }
];

export const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box', p: 2 } }}>
        <Toolbar>
          <Typography variant="h6">Inventory Pro</Typography>
        </Toolbar>
        <List>
          {menu.map((item) => (
            <ListItemButton key={item.path} component={Link} to={item.path} selected={location.pathname === item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>{children}</Box>
    </Box>
  );
};
