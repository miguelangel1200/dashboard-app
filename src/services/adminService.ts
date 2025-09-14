import axios from 'axios';
import { API_CONFIG } from '../config/api';

class AdminService {
  private api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  private token: string | null = localStorage.getItem('admin-token');

  constructor() {
    this.api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  async login(username: string, password: string) {
    const response = await this.api.post(API_CONFIG.ENDPOINTS.ADMIN.AUTH, {
      username,
      password
    });
    
    if (response.data.token) {
      this.token = response.data.token;
      localStorage.setItem('admin-token', this.token || '');
      this.api.defaults.headers.Authorization = `Bearer ${this.token}`;
    }
    
    return response.data;
  }

  async getStats() {
    const response = await this.api.get(API_CONFIG.ENDPOINTS.ADMIN.STATS);
    return response.data;
  }

  async getAppointments() {
    const response = await this.api.get(API_CONFIG.ENDPOINTS.ADMIN.APPOINTMENTS);
    return response.data;
  }

  async getCenters() {
    const response = await this.api.get(API_CONFIG.ENDPOINTS.ADMIN.CENTERS);
    return response.data;
  }

  async getSpecialties() {
    const response = await this.api.get(API_CONFIG.ENDPOINTS.ADMIN.SPECIALTIES);
    return response.data;
  }

  async getMedics() {
    const response = await this.api.get(API_CONFIG.ENDPOINTS.ADMIN.MEDICS);
    return response.data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('admin-token');
    delete this.api.defaults.headers.Authorization;
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export const adminService = new AdminService();
