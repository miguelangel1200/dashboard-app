import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Box, CircularProgress,
  Alert, Chip
} from '@mui/material';
// ✅ ELIMINADO Grid2 import
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { adminService } from '../services/adminService';

const AppointmentsList: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAppointments();
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error loading appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'confirmed': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'appointment_id',
      headerName: 'ID Cita',
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {params.value?.substring(0, 12)}...
        </Typography>
      )
    },
    {
      field: 'insured_id',
      headerName: 'Asegurado',
      width: 100
    },
    {
      field: 'country_iso',
      headerName: 'País',
      width: 80,
      renderCell: (params) => (
        <span>{params.value === 'PE' ? '🇵🇪' : '🇨🇱'} {params.value}</span>
      )
    },
    {
      field: 'medic_name',
      headerName: 'Médico',
      width: 180
    },
    {
      field: 'specialty_name',
      headerName: 'Especialidad',
      width: 150
    },
    {
      field: 'center_name',
      headerName: 'Centro',
      width: 200
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value) as any}
          size="small"
        />
      )
    },
    {
      field: 'appointment_date',
      headerName: 'Fecha Cita',
      width: 180,
      renderCell: (params) => (
        new Date(params.value).toLocaleString()
      )
    }
  ];

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

  const allAppointments = [
    ...(data?.rds?.pe?.appointments || []).map((apt: any) => ({ ...apt, id: apt.appointment_id })),
    ...(data?.rds?.cl?.appointments || []).map((apt: any) => ({ ...apt, id: apt.appointment_id }))
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📋 Gestión de Citas
      </Typography>

      {/* ✅ Summary Cards - BOX FLEXBOX */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          mb: 3,
          '& > *': { flex: '1 1 200px', minWidth: '150px' }
        }}
      >
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total RDS
            </Typography>
            <Typography variant="h5">
              {data?.summary?.totalRDS || 0}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Perú 🇵🇪
            </Typography>
            <Typography variant="h5">
              {data?.summary?.byCountry?.PE || 0}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Chile 🇨🇱
            </Typography>
            <Typography variant="h5">
              {data?.summary?.byCountry?.CL || 0}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Mostrando
            </Typography>
            <Typography variant="h5">
              {allAppointments.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Data Grid */}
      <Card>
        <CardContent>
          <div style={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={allAppointments}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 }
                }
              }}
              pageSizeOptions={[10, 25, 50]}
              checkboxSelection
              disableRowSelectionOnClick
            />
          </div>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AppointmentsList;
