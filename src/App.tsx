import React, { useState, useEffect } from 'react';
import {
  ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar,
  Typography, Button, Drawer, List, ListItem, ListItemIcon,
  ListItemText, ListItemButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon, Assignment, People, ExitToApp,
  LocalHospital, Business
} from '@mui/icons-material';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AppointmentsList from './components/AppointmentList';
import MedicsManagement from './components/MedicManangment';
import { adminService } from './services/adminService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, id: 'dashboard' },
  { text: 'Citas', icon: <Assignment />, id: 'appointments' },
  { text: 'Médicos', icon: <People />, id: 'medics' },
  { text: 'Centros', icon: <Business />, id: 'centers' },
  { text: 'Especialidades', icon: <LocalHospital />, id: 'specialties' },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    setIsAuthenticated(adminService.isAuthenticated());
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    adminService.logout();
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'appointments':
        return <AppointmentsList />;
      case 'medics':
        return <MedicsManagement />;
      case 'centers':
        return <Typography variant="h4" sx={{ p: 3 }}>🏥 Centros Médicos (Próximamente)</Typography>;
      case 'specialties':
        return <Typography variant="h4" sx={{ p: 3 }}>🩺 Especialidades (Próximamente)</Typography>;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        {/* App Bar */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              🏥 RIMAC Admin Dashboard
            </Typography>
            <Button color="inherit" onClick={handleLogout} startIcon={<ExitToApp />}>
              Cerrar Sesión
            </Button>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    selected={currentView === item.id}
                    onClick={() => setCurrentView(item.id)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 0,
          }}
        >
          <Toolbar />
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
