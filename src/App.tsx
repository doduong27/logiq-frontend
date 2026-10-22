import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  Terminal, 
  ShieldAlert, 
  RefreshCw,
  Cpu,
  Bot,
  Send,
  HardDrive,
  Thermometer,
  Zap,
  Server,
  Layers,
  Sparkles,
  Search
} from 'lucide-react';
import { LogEntry, Incident, LogStats, ChatMessage, OrangePiDevice } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logs' | 'orangepi' | 'incidents' | 'chat'>('logs');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);

  // Chatbot state
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Xin chào! Tôi là Trợ lý AI LogIQ (hỗ trợ bởi ChromaDB Semantic Search & Multi-LLM). Bạn có thể hỏi tôi bất kỳ điều gì về dữ liệu log, sự cố quá nhiệt phần cứng của cụm OrangePi, hoặc lỗi dịch vụ thanh toán.',
      timestamp: '16:00',
    },
  ]);

  // Aggregate Metrics
  const [stats, setStats] = useState<LogStats>({
    project_id: 1,
    total_logs: 18450,
    levels: { INFO: 16900, WARNING: 1050, ERROR: 480, CRITICAL: 20 },
    error_count: 500,
    error_rate: 0.027,
  });

  // OrangePi Fleet Monitor state
  const [devices, setDevices] = useState<OrangePiDevice[]>([
    {
      device_id: 'orangepi-zero3-01',
      soc_temperature_c: 51.2,
      memory_used_pct: 34.5,
      load_1m: 0.35,
      disk_used_pct: 22.0,
      status: 'HEALTHY',
      last_seen: 'Vừa xong',
    },
    {
      device_id: 'orangepi-5-cluster-02',
      soc_temperature_c: 82.4,
      memory_used_pct: 78.0,
      load_1m: 4.82,
      disk_used_pct: 64.2,
      status: 'CRITICAL',
      last_seen: '2 giây trước',
    },
    {
      device_id: 'orangepi-3lts-edge-03',
      soc_temperature_c: 68.0,
      memory_used_pct: 62.0,
      load_1m: 1.45,
      disk_used_pct: 45.1,
      status: 'WARNING',
      last_seen: '10 giây trước',
    },
    {
      device_id: 'orangepi-zero3-workshop-04',
      soc_temperature_c: 47.8,
      memory_used_pct: 28.0,
      load_1m: 0.15,
      disk_used_pct: 18.5,
      status: 'HEALTHY',
      last_seen: 'Vừa xong',
    },
  ]);

  // Incidents state
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 201,
      project_id: 1,
      title: '[orangepi-5-cluster-02] Hardware Thermal Spike: SoC Temperature reached 82.4C (Threshold: 75.0C)',
      status: 'OPEN',
      severity: 'CRITICAL',
      fingerprint: 'fp_orangepi_thermal_82c',
      error_count: 24,
      first_seen: '2026-10-22 16:20:00',
      last_seen: '2026-10-22 16:48:15',
      rca_summary: 'AI RCA: Hiện tượng quá nhiệt nghiêm trọng trên chip Rockchip RK3588S do tiến trình biên dịch video chiếm 100% 8-core CPU kết hợp luồng gió tản nhiệt phòng máy bị cản trở.',
      fix_suggestion: 'Bật quạt tản nhiệt chủ động (Active PWM Cooling) và giới hạn CPU quota qua cgroups cho container xử lý video.',
    },
    {
      id: 202,
      project_id: 1,
      title: '[payment-service] Connection to Stripe gateway timed out after 5000ms',
      status: 'INVESTIGATING',
      severity: 'HIGH',
      fingerprint: 'fp_payment_timeout_stripe',
      error_count: 9,
      first_seen: '2026-10-22 15:30:00',
      last_seen: '2026-10-22 16:10:00',
      rca_summary: 'AI RCA: Downstream payment gateway timeout do chính sách Kubernetes NetworkPolicy chặn gói tin DNS egress.',
      fix_suggestion: 'Kiểm tra NetworkPolicy cho phép outbound UDP port 53 tới kube-dns.',
    },
  ]);

  // Logs stream
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 1,
      project_id: 1,
      timestamp: '2026-10-22T16:48:15Z',
      level: 'CRITICAL',
      service: 'orangepi-5-cluster-02',
      message: 'Hardware Thermal Spike: SoC Temperature reached 82.4C (Threshold: 75.0C)',
      stack_trace: 'HardwareAlert: Overheating detected at /sys/class/thermal/thermal_zone0/temp=82400',
      metadata: { device_id: 'orangepi-5-cluster-02', soc_temp_c: 82.4, ram_pct: 78.0 },
    },
    {
      id: 2,
      project_id: 1,
      timestamp: '2026-10-22T16:48:10Z',
      level: 'INFO',
      service: 'orangepi-zero3-01',
      message: 'Normal operational telemetry. Temp: 51.2C, RAM: 34.5%, Load1: 0.35',
      metadata: { device_id: 'orangepi-zero3-01', soc_temp_c: 51.2, ram_pct: 34.5 },
    },
    {
      id: 3,
      project_id: 1,
      timestamp: '2026-10-22T16:47:50Z',
      level: 'ERROR',
      service: 'payment-service',
      message: 'Connection to Stripe gateway timed out after 5000ms for user 9901',
      stack_trace: 'TimeoutError: Request exceeded 5000ms at /app/services/stripe.py:44',
      fingerprint: 'fp_payment_timeout_stripe',
    },
    {
      id: 4,
      project_id: 1,
      timestamp: '2026-10-22T16:46:30Z',
      level: 'WARNING',
      service: 'orangepi-3lts-edge-03',
      message: 'Low Storage Alert: eMMC root partition capacity at 85% utilization',
      metadata: { device_id: 'orangepi-3lts-edge-03', disk_used_pct: 85.0 },
    },
    {
      id: 5,
      project_id: 1,
      timestamp: '2026-10-22T16:45:00Z',
      level: 'INFO',
      service: 'web-gateway',
      message: 'HTTP GET /api/v1/health status=200 duration=3.1ms',
    },
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    // Simulate RAG answer synthesis with ChromaDB citations
    setTimeout(() => {
      let reply = '';
      let sources = [];

      const queryLower = userMsg.text.toLowerCase();
      if (queryLower.includes('nhiệt độ') || queryLower.includes('orangepi') || queryLower.includes('nóng') || queryLower.includes('thermal')) {
        reply = 'Dựa trên dữ liệu từ ChromaDB Semantic Search, thiết bị **orangepi-5-cluster-02** đã ghi nhận hiện tượng đột biến nhiệt độ lên tới **82.4°C** (vượt ngưỡng 75°C). AI phân tích nguyên nhân do tiến trình CPU chạy 100% trong thời gian dài.';
        sources = [
          { document: '[CRITICAL] [orangepi-5-cluster-02] Hardware Thermal Spike: SoC Temperature reached 82.4C', relevance_score: 0.94 },
          { document: '[INFO] [orangepi-zero3-01] Normal operational telemetry. Temp: 51.2C', relevance_score: 0.78 }
        ];
      } else if (queryLower.includes('stripe') || queryLower.includes('payment') || queryLower.includes('thanh toán')) {
        reply = 'Dịch vụ **payment-service** bị quá thời gian chờ (Timeout 5000ms) khi gọi đến cổng Stripe. Nguyên nhân do NetworkPolicy chặn egress DNS ra ngoài internet.';
        sources = [
          { document: '[ERROR] [payment-service] Connection to Stripe gateway timed out after 5000ms', relevance_score: 0.96 }
        ];
      } else {
        reply = `Hệ thống đã truy vấn kho vector ChromaDB cho câu hỏi "${userMsg.text}". Đã phát hiện các bản ghi hoạt động bình thường trên cụm thiết bị biên OrangePi và các microservices.`;
        sources = [
          { document: '[INFO] [web-gateway] HTTP GET /api/v1/health status=200', relevance_score: 0.81 }
        ];
      }

      const botMsg: ChatMessage = {
        id: `b_${Date.now()}`,
        sender: 'assistant',
        text: reply,
        sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsChatLoading(false);
    }, 800);
  };

  const handleTriggerRCA = (incidentId: number) => {
    setAnalyzingId(incidentId);
    setTimeout(() => {
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.id === incidentId) {
            return {
              ...inc,
              status: 'INVESTIGATING',
              rca_summary: inc.rca_summary || 'AI RCA: Phân tích tự động phát hiện lỗi lặp lại do tải phần cứng tăng đột biến.',
              fix_suggestion: inc.fix_suggestion || 'Kiểm tra ngưỡng cgroups và phân luồng tải sang máy trạm OrangePi dự phòng.',
            };
          }
          return inc;
        })
      );
      setAnalyzingId(null);
    }, 1200);
  };

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
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/70 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              L
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight text-white">LogIQ Platform</h1>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                v0.4.0 • OrangePi Edge
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'logs' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Terminal className="h-4 w-4" />
              Live Ingest Stream
            </button>

            <button
              onClick={() => setActiveTab('orangepi')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'orangepi' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Server className="h-4 w-4" />
              OrangePi Fleet Monitor
              <span className="ml-auto text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                4 Nodes
              </span>
            </button>

            <button
              onClick={() => setActiveTab('incidents')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'incidents' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              Anomalies & RCA
              {incidents.filter(i => i.status === 'OPEN').length > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-bounce">
                  {incidents.filter(i => i.status === 'OPEN').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'chat' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Bot className="h-4 w-4" />
              AI Log Assistant (Q&A)
              <Sparkles className="h-3 w-3 text-indigo-400 ml-auto" />
            </button>
          </nav>
        </div>

        <div className="border-t border-slate-800/80 pt-4 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>GitSecOps Pipeline</span>
            <span className="text-emerald-400 font-mono font-semibold">PASSED</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>ChromaDB Vector Store</span>
            <span className="text-indigo-400 font-mono font-semibold">Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/40 backdrop-blur">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-400">Cluster:</span>
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1 text-sm font-mono text-emerald-400 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5" />
              IoT OrangePi Edge & Kubernetes (Project ID: 1)
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono">Ingest Rate: ~15 logs/sec</span>
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
                Active OrangePi Nodes
                <Server className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-400">4 / 4 Online</div>
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
                AI RCA & RAG
                <Cpu className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-indigo-400">Gemini / Chroma</div>
            </div>
          </div>

          {/* TAB 1: LIVE LOG STREAM */}
          {activeTab === 'logs' && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 gap-4">
                <div className="flex items-center gap-3">
                  <Terminal className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-200">Realtime Stream Logs</span>
                </div>

                <div className="flex items-center gap-3 flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Tìm theo service (orangepi-zero3), mã lỗi, IP..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {['ALL', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setFilterLevel(lvl)}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                        filterLevel === lvl ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
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
                  .filter(l => !searchKeyword || l.message.toLowerCase().includes(searchKeyword.toLowerCase()) || l.service.toLowerCase().includes(searchKeyword.toLowerCase()))
                  .map((log) => (
                    <div key={log.id} className="p-3.5 hover:bg-slate-800/40 transition-colors flex items-start gap-4">
                      <span className="text-slate-500 whitespace-nowrap">{log.timestamp.replace('T', ' ').replace('Z', '')}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getLevelBadge(log.level)}`}>
                        {log.level}
                      </span>
                      <span className="text-slate-400 font-semibold whitespace-nowrap">[{log.service}]</span>
                      <div className="flex-1 text-slate-200 break-all">
                        {log.message}
                        {log.metadata && (
                          <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                            {log.metadata.soc_temp_c && (
                              <span className="text-amber-400 font-bold">🌡️ {log.metadata.soc_temp_c}°C</span>
                            )}
                            {log.metadata.ram_pct && (
                              <span>RAM: {log.metadata.ram_pct}%</span>
                            )}
                          </div>
                        )}
                        {log.stack_trace && (
                          <pre className="mt-2 p-2.5 bg-slate-950/90 rounded border border-rose-900/50 text-rose-300 overflow-x-auto text-[11px]">
                            {log.stack_trace}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: ORANGEPI FLEET MONITOR */}
          {activeTab === 'orangepi' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                    <Server className="h-5 w-5 text-amber-400" />
                    OrangePi Mini PC Edge Telemetry
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Theo dõi trạng thái phần cứng, nhiệt độ chip SoC, RAM và lưu lượng hàng đợi ngoại tuyến từ các máy trạm biên
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {devices.map((dev) => {
                  const isHighTemp = dev.soc_temperature_c >= 75.0;
                  return (
                    <div
                      key={dev.device_id}
                      className={`p-5 rounded-xl border transition-all ${
                        isHighTemp
                          ? 'bg-red-950/30 border-red-500/50 shadow-lg shadow-red-500/10'
                          : 'bg-slate-900/80 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base text-slate-100">{dev.device_id}</h4>
                            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Armbian Linux</span>
                          </div>
                          <span className="text-xs text-slate-500">Cập nhật: {dev.last_seen}</span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                            dev.status === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                              : dev.status === 'WARNING'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}
                        >
                          {dev.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-3 text-center">
                        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mb-1">
                            <Thermometer className="h-3 w-3" /> SoC Temp
                          </div>
                          <div className={`text-base font-bold font-mono ${isHighTemp ? 'text-red-400' : 'text-slate-200'}`}>
                            {dev.soc_temperature_c}°C
                          </div>
                        </div>

                        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mb-1">
                            <Cpu className="h-3 w-3" /> RAM Used
                          </div>
                          <div className="text-base font-bold font-mono text-slate-200">{dev.memory_used_pct}%</div>
                        </div>

                        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mb-1">
                            <Activity className="h-3 w-3" /> Load 1m
                          </div>
                          <div className="text-base font-bold font-mono text-slate-200">{dev.load_1m}</div>
                        </div>

                        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mb-1">
                            <HardDrive className="h-3 w-3" /> eMMC Disk
                          </div>
                          <div className="text-base font-bold font-mono text-slate-200">{dev.disk_used_pct}%</div>
                        </div>
                      </div>

                      {isHighTemp && (
                        <div className="mt-3 p-2.5 bg-red-950/50 rounded-lg border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                          <span>Cảnh báo: Nhiệt độ vượt ngưỡng an toàn (&gt; 75°C). Nguy cơ giảm xung nhịp CPU do quá nhiệt.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ANOMALIES & AI RCA */}
          {activeTab === 'incidents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-rose-400" />
                    Detected Anomaly Spikes & AI Root Cause Analysis
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tự động kích hoạt khi có đột biến lỗi phần cứng OrangePi hoặc microservices
                  </p>
                </div>
              </div>

              {incidents.map((inc) => (
                <div key={inc.id} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
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
                      <button
                        onClick={() => handleTriggerRCA(inc.id)}
                        disabled={analyzingId === inc.id}
                        className="flex items-center gap-1.5 text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 px-3 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-50"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {analyzingId === inc.id ? 'Đang phân tích RCA...' : 'Run AI RCA'}
                      </button>

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
                    <div className="p-4 bg-slate-950/80 rounded-xl border border-indigo-500/30 text-xs space-y-2">
                      <div className="text-indigo-400 font-bold flex items-center gap-2">
                        <Cpu className="h-4 w-4" />
                        AI Root Cause Analysis (Multi-LLM Engine)
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[13px]">{inc.rca_summary}</p>
                      {inc.fix_suggestion && (
                        <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2">
                          <span className="text-emerald-400 font-bold shrink-0">🛠️ Đề xuất xử lý:</span>
                          <span className="text-emerald-300 font-mono text-[12px]">{inc.fix_suggestion}</span>
                        </div>
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

          {/* TAB 4: AI LOG Q&A ASSISTANT (RAG) */}
          {activeTab === 'chat' && (
            <div className="h-[620px] bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bot className="h-5 w-5 text-indigo-400" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">LogIQ AI Copilot</h3>
                    <p className="text-[11px] text-slate-400">Hỏi đáp ngôn ngữ tự nhiên trên dữ liệu log (ChromaDB + Multi-LLM)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">Gemini 1.5</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">RAG Vector Ready</span>
                </div>
              </div>

              {/* Chat Message Scroll */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-2xl p-4 rounded-xl text-sm leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>

                      {/* Document Citations from ChromaDB */}
                      {m.sources && m.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5">
                          <span className="text-[11px] font-bold text-indigo-400 block">
                            📚 Log Dẫn Chứng từ ChromaDB:
                          </span>
                          {m.sources.map((s, idx) => (
                            <div key={idx} className="bg-slate-900 p-2 rounded text-[11px] font-mono text-slate-300 border border-slate-800/80">
                              <span className="text-emerald-400">[{Math.round(s.relevance_score * 100)}% match]</span> {s.document}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono p-2">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    Đang tìm kiếm log trên ChromaDB và tổng hợp câu trả lời...
                  </div>
                )}
              </div>

              {/* Chat Input Box */}
              <div className="p-3 border-t border-slate-800 bg-slate-900/90">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Hỏi AI: 'Tại sao máy OrangePi bị quá nhiệt?', 'Chi tiết lỗi thanh toán Stripe'..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
