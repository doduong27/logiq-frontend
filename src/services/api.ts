import axios from 'axios';
import { Project, LogEntry, Incident, LogStats } from '../types';

const API_BASE = '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('logiq_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Health
  checkHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    const res = await apiClient.get('/projects/');
    return res.data;
  },

  createProject: async (name: string, description?: string): Promise<Project> => {
    const res = await apiClient.post('/projects/', { name, description });
    return res.data;
  },

  // Logs
  getLogs: async (projectId: number, limit = 50, level?: string): Promise<LogEntry[]> => {
    const params: Record<string, any> = { project_id: projectId, limit };
    if (level) params.level = level;
    const res = await apiClient.get('/logs/', { params });
    return res.data;
  },

  getLogStats: async (projectId: number): Promise<LogStats> => {
    const res = await apiClient.get('/logs/stats', { params: { project_id: projectId } });
    return res.data;
  },

  // Incidents
  getIncidents: async (projectId: number, status?: string): Promise<Incident[]> => {
    const params: Record<string, any> = { project_id: projectId };
    if (status) params.status = status;
    const res = await apiClient.get('/incidents/', { params });
    return res.data;
  },

  updateIncidentStatus: async (incidentId: number, status: string): Promise<Incident> => {
    const res = await apiClient.patch(`/incidents/${incidentId}`, { status });
    return res.data;
  },
};
