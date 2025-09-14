import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Box, CircularProgress,
  Alert, Chip
} from '@mui/material';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { adminService } from '../services/adminService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error loading stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const countryData = [
    { name: 'Perú', value: stats?.rds?.pe || 0, flag: '🇵🇪' },
    { name: 'Chile', value: stats?.rds?.cl || 0, flag: '🇨🇱' }
  ];

  const statusData = [
    { name: 'Pendientes', value: stats?.rds?.byStatus?.pending || 0 },
    { name: 'Confirmadas', value: stats?.rds?.byStatus?.confirmed || 0 },
    { name: 'Completadas', value: stats?.rds?.byStatus?.completed || 0 }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 Dashboard - Estadísticas del Sistema
      </Typography>

      {/* ✅ KPIs Cards - USAR BOX FLEXBOX */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          mb: 4,
          '& > *': { flex: '1 1 250px', minWidth: '200px' }
        }}
      >
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Citas
            </Typography>
            <Typography variant="h4">
              {stats?.overview?.totalAppointments || 0}
            </Typography>
            <Chip 
              label={`${stats?.overview?.successRate || 0}% éxito`}
              color="primary" 
              size="small"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Pendientes
            </Typography>
            <Typography variant="h4" color="warning.main">
              {stats?.overview?.pendingAppointments || 0}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Confirmadas
            </Typography>
            <Typography variant="h4" color="info.main">
              {stats?.overview?.confirmedAppointments || 0}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Completadas
            </Typography>
            <Typography variant="h4" color="success.main">
              {stats?.overview?.completedAppointments || 0}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* ✅ Charts - BOX FLEXBOX */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3,
          '& > *': { flex: '1 1 400px', minWidth: '350px' }
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Citas por País
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                    data={countryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value}) => `${name}: ${value}`} // ✅ CORRECTO
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    >
                  {countryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Status de Citas
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      {/* ✅ System Health - BOX FLEXBOX */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🚀 Estado del Sistema
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              '& > *': { flex: '1 1 300px' }
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Estado: <Chip label={stats?.performance?.systemHealth} color="success" size="small" />
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Tiempo Promedio: {stats?.performance?.avgProcessingTime}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Última Actualización: {new Date(stats?.performance?.lastUpdate).toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
