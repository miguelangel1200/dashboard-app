import React, { useState } from 'react';
import {
  Container, Paper, TextField, Button, Typography, Alert,
  Box, CircularProgress
} from '@mui/material';
import { AdminPanelSettings } from '@mui/icons-material';
import { adminService } from '../services/adminService';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminService.login(credentials.username, credentials.password);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AdminPanelSettings sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            🏥 RIMAC Admin
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Panel de Administración
          </Typography>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Usuario"
              margin="normal"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required
              placeholder="admin"
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              margin="normal"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
              placeholder="rimac2024"
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Iniciando sesión...
                </>
              ) : (
                '🔐 Iniciar Sesión'
              )}
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Demo: admin / rimac2024
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
