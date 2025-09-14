import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Alert, CircularProgress, Card, CardContent,
  Accordion, AccordionSummary, AccordionDetails, Chip
} from '@mui/material';
// ✅ ELIMINADO Grid import
import { ExpandMore } from '@mui/icons-material';
import { adminService } from '../services/adminService';

const MedicsManagement: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedics();
  }, []);

  const fetchMedics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getMedics();
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error loading medics');
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        👨‍⚕️ Gestión de Médicos
      </Typography>

      {/* ✅ Summary - BOX FLEXBOX */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          mb: 3,
          '& > *': { flex: '1 1 250px', minWidth: '200px' }
        }}
      >
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Médicos
            </Typography>
            <Typography variant="h4">
              {data?.summary?.totalMedics || 0}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Perú 🇵🇪
            </Typography>
            <Typography variant="h4">
              {data?.summary?.byCountry?.PE || 0}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Chile 🇨🇱
            </Typography>
            <Typography variant="h4">
              {data?.summary?.byCountry?.CL || 0}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* ✅ Medics by Country - BOX FLEXBOX */}
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
              🇵🇪 Médicos - Perú
            </Typography>
            {data?.pe?.map((medic: any, index: number) => (
              <Accordion key={medic.medic_id}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {medic.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box>
                      <Chip 
                        label={medic.specialty_name} 
                        color="primary" 
                        size="small" 
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={medic.center_name} 
                        color="secondary" 
                        size="small" 
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      📍 {medic.center_address}, {medic.center_city}
                    </Typography>
                    <Typography variant="body2">
                      ID: {medic.medic_id} | Centro: {medic.center_id} | Especialidad: {medic.specialty_id}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🇨🇱 Médicos - Chile
            </Typography>
            {data?.cl?.map((medic: any, index: number) => (
              <Accordion key={medic.medic_id}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {medic.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box>
                      <Chip 
                        label={medic.specialty_name} 
                        color="primary" 
                        size="small" 
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={medic.center_name} 
                        color="secondary" 
                        size="small" 
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      📍 {medic.center_address}, {medic.center_city}
                    </Typography>
                    <Typography variant="body2">
                      ID: {medic.medic_id} | Centro: {medic.center_id} | Especialidad: {medic.specialty_id}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default MedicsManagement;
