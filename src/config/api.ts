export const API_CONFIG = {
  BASE_URL: 'https://bnh6zvyh59.execute-api.us-east-2.amazonaws.com/dev',
  ENDPOINTS: {
    ADMIN: {
      AUTH: '/admin/auth',
      STATS: '/admin/stats',
      APPOINTMENTS: '/admin/appointments',
      CENTERS: '/admin/centers',
      SPECIALTIES: '/admin/specialties',
      MEDICS: '/admin/medics'
    }
  }
};

export const COUNTRIES = {
  PE: { code: 'PE', name: 'Perú', flag: '🇵🇪' },
  CL: { code: 'CL', name: 'Chile', flag: '🇨🇱' }
};
