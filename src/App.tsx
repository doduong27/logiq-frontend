import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Database, 
  Layers, 
  Terminal, 
  ShieldAlert, 
  Search,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { LogEntry, Incident, LogStats } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logs' | 'incidents'>('logs');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  // Demo fallback state for standalone UI presentation
  const [stats, setStats] = useState<LogStats>({
    project_id: 1,
    total_logs: 12480,
    levels: { INFO: 11200, WARNING: 850, ERROR: 410, CRITICAL: 20 },
    error_count: 430,
    error_rate: 0.034,
  });

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 101,
      project_id: 1,
      title: '[payment-service] Connection to Stripe gateway timed out after 5000ms',
      status: 'OPEN',
      severity: 'CRITICAL',
      fingerprint: 'a8b3f2...91',
      error_count: 18,
      first_seen: '2026-10-22 15:40:00',
      last_seen: '2026-10-22 16:15:20',
      rca_summary: 'AI RCA: TLS handshake failure caused by egress packet drop at NAT gateway.',
      fix_suggestion: 'Increase connection pool timeout and inspect Kubernetes egress NetworkPolicy.',
    },
    {
      id: 102,
      project_id: 1,
      title: '[auth-service] Redis token cache connection refused on port 6379',
      status: 'INVESTIGATING',
      severity: 'HIGH',
      fingerprint: '074cc5...81',
      error_count: 5,
      first_seen: '2026-10-22 14:10:00',
      last_seen: '2026-10-22 14:15:00',
    },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 1,
      project_id: 1,
      timestamp: '2026-10-22T16:20:10Z',
      level: 'INFO',
      service: 'web-gateway',
      message: 'HTTP GET /api/v1/health status=200 duration=4.2ms',
    },
    {
      id: 2,
      project_id: 1,
      timestamp: '2026-10-22T16:20:15Z',
      level: 'ERROR',
      service: 'payment-service',
      message: 'Connection to Stripe gateway timed out after 5000ms',
      stack_trace: 'TimeoutError: Request exceeded 5000ms limit at /app/services/stripe.py:44',
      fingerprint: 'a8b3f2...91',
    },
    {
      id: 3,
      project_id: 1,
      timestamp: '2026-10-22T16:20:20Z',
      level: 'CRITICAL',
      service: 'payment-service',
      message: 'Stripe webhook verification failed: Signature expired',
      fingerprint: 'a8b3f2...91',
    },
  ]);

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'ERROR':
        return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
      case 'WARNING':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-emerald-500/20">
              L
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">LogIQ Platform</h1>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                v0.2.0 • Live
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'logs' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Terminal className="h-4 w-4" />
              Live Log Stream
            </button>

            <button
              onClick={() => setActiveTab('incidents')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'incidents' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              Anomalies & Incidents
              {incidents.filter(i => i.status === 'OPEN').length > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {incidents.filter(i => i.status === 'OPEN').length}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="border-t border-slate-800/80 pt-4 text-xs text-slate-500 flex items-center justify-between">
          <span>GitSecOps Enforced</span>
          <span className="text-emerald-400 font-mono">Restricted PSS</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 px-8 flex items-center justify-between bg-slate-900/30">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-300">Project:</span>
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-md px-3 py-1 text-sm font-mono text-emerald-400">
              Payment & Core Cluster (ID: 1)
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-xs px-3 py-2 rounded-md transition-colors text-slate-300 border border-slate-700">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                Total Ingested Logs
                <Activity className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-100">{stats.total_logs.toLocaleString()}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                Error Spikes Detected
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-400">{stats.error_count}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                Active Incidents
                <ShieldAlert className="h-4 w-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-rose-400">
                {incidents.filter(i => i.status !== 'RESOLVED').length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                AI Root Cause Ready
                <Cpu className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-indigo-400">100% Active</div>
            </div>
          </div>

          {/* Tab 1: Live Logs View */}
          {activeTab === 'logs' && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
                <div className="flex items-center gap-3">
                  <Terminal className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-200">Realtime Stream Logs</span>
                </div>
                <div className="flex items-center gap-2">
                  {['ALL', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setFilterLevel(lvl)}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                        filterLevel === lvl ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-slate-800/60 font-mono text-xs">
                {logs
                  .filter(l => filterLevel === 'ALL' || l.level === filterLevel)
                  .map((log) => (
                    <div key={log.id} className="p-3.5 hover:bg-slate-800/30 transition-colors flex items-start gap-4">
                      <span className="text-slate-500 whitespace-nowrap">{log.timestamp.replace('T', ' ').replace('Z', '')}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getLevelBadge(log.level)}`}>
                        {log.level}
                      </span>
                      <span className="text-slate-400 font-semibold whitespace-nowrap">[{log.service}]</span>
                      <div className="flex-1 text-slate-200 break-all">
                        {log.message}
                        {log.stack_trace && (
                          <pre className="mt-2 p-2 bg-slate-950/80 rounded border border-slate-800 text-rose-300 overflow-x-auto text-[11px]">
                            {log.stack_trace}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Tab 2: Incidents View */}
          {activeTab === 'incidents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-rose-400" />
                  Detected Anomaly Spikes & Incidents
                </h3>
              </div>

              {incidents.map((inc) => (
                <div key={inc.id} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${getLevelBadge(inc.severity)}`}>
                          {inc.severity}
                        </span>
                        <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
                          Status: {inc.status}
                        </span>
                        <span className="text-xs text-rose-400 font-mono font-bold">
                          {inc.error_count} repeated occurrences
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-100 text-base">{inc.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {inc.status !== 'RESOLVED' && (
                        <button
                          onClick={() => {
                            setIncidents(prev => prev.map(i => i.id === inc.id ? { ...i, status: 'RESOLVED' } : i));
                          }}
                          className="flex items-center gap-1.5 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg transition-colors font-medium"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>

                  {inc.rca_summary && (
                    <div className="p-3.5 bg-slate-950/80 rounded-lg border border-indigo-500/30 text-xs space-y-1.5">
                      <div className="text-indigo-400 font-bold flex items-center gap-1.5">
                        <Cpu className="h-3.5 w-3.5" />
                        AI Root Cause Analysis (RCA)
                      </div>
                      <p className="text-slate-300 leading-relaxed">{inc.rca_summary}</p>
                      {inc.fix_suggestion && (
                        <p className="text-emerald-400 pt-1 font-mono text-[11px]">
                          Fix: {inc.fix_suggestion}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-slate-500 flex items-center gap-4 font-mono">
                    <span>First Seen: {inc.first_seen}</span>
                    <span>Last Seen: {inc.last_seen}</span>
                    <span>Fingerprint: {inc.fingerprint}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
