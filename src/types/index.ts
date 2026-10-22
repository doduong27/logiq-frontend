export type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  slug: string;
  description?: string;
  api_key?: string;
  created_at: string;
}

export interface LogEntry {
  id: number;
  project_id: number;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  stack_trace?: string;
  fingerprint?: string;
  metadata?: Record<string, any>;
}

export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'IGNORED';
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Incident {
  id: number;
  project_id: number;
  title: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  fingerprint: string;
  error_count: number;
  first_seen: string;
  last_seen: string;
  rca_summary?: string;
  fix_suggestion?: string;
}

export interface LogStats {
  project_id: number;
  total_logs: number;
  levels: Record<string, number>;
  error_count: number;
  error_rate: number;
}
