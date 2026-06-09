import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Droplets,
  Thermometer,
  Zap,
  FlaskConical,
  Activity,
  Eye,
  Bell,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

const trendData = [
  { time: "06:00", ph: 7.1, tds: 210, turbidity: 3.2, ec: 420 },
  { time: "08:00", ph: 7.3, tds: 225, turbidity: 3.8, ec: 445 },
  { time: "10:00", ph: 6.9, tds: 198, turbidity: 2.9, ec: 398 },
  { time: "12:00", ph: 7.6, tds: 310, turbidity: 5.1, ec: 620 },
  { time: "14:00", ph: 8.1, tds: 475, turbidity: 8.4, ec: 950 },
  { time: "16:00", ph: 7.8, tds: 390, turbidity: 6.7, ec: 780 },
  { time: "18:00", ph: 7.4, tds: 280, turbidity: 4.2, ec: 560 },
];

const sensors = [
  { id: "S-01", name: "River Pra — Station A", status: "critical", lastSeen: "Just now" },
  { id: "S-02", name: "Ofin River — Station B", status: "warning", lastSeen: "2 min ago" },
  { id: "S-03", name: "Birim River — Station C", status: "normal", lastSeen: "1 min ago" },
];

const readings = [
  { label: "pH Level", value: "8.1", unit: "", safe: "6.5 – 8.5", status: "warning", icon: FlaskConical, color: "#f59e0b", bg: "#fef3c7" },
  { label: "TDS", value: "475", unit: "mg/L", safe: "< 500", status: "warning", icon: Droplets, color: "#f59e0b", bg: "#fef3c7" },
  { label: "Turbidity", value: "8.4", unit: "NTU", safe: "< 4.0", status: "critical", icon: Eye, color: "#ef4444", bg: "#fee2e2" },
  { label: "Temperature", value: "24.7", unit: "°C", safe: "10 – 30", status: "normal", icon: Thermometer, color: "#10b981", bg: "#d1fae5" },
  { label: "EC", value: "950", unit: "µS/cm", safe: "< 800", status: "critical", icon: Zap, color: "#ef4444", bg: "#fee2e2" },
  { label: "ORP", value: "+182", unit: "mV", safe: "+200 – +600", status: "warning", icon: Activity, color: "#f59e0b", bg: "#fef3c7" },
];

const statusColors: Record<string, string> = {
  normal: "#10b981",
  warning: "#f59e0b",
  critical: "#ef4444",
};

const statusLabels: Record<string, string> = {
  normal: "Normal",
  warning: "Warning",
  critical: "Critical",
};

export default function DashboardOverview() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f0f9ff", minHeight: "100vh" }}>
      {/* Sidebar + Main layout */}
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: "#0c4a6e", color: "#e0f2fe", display: "flex", flexDirection: "column", padding: "24px 0" }}>
          <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #075985" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Droplets size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>AquaWatch</div>
                <div style={{ fontSize: 10, color: "#7dd3fc" }}>IoT Monitor</div>
              </div>
            </div>
          </div>
          <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { label: "Overview", icon: Activity, active: true },
              { label: "Historical Data", icon: Clock },
              { label: "Alerts", icon: Bell },
              { label: "Sensors", icon: Wifi },
              { label: "Thresholds", icon: FlaskConical },
            ].map(({ label, icon: Icon, active }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400,
                background: active ? "#075985" : "transparent",
                color: active ? "#fff" : "#93c5fd",
              }}>
                <Icon size={16} />
                {label}
              </div>
            ))}
          </nav>
          <div style={{ padding: "12px 20px", borderTop: "1px solid #075985", fontSize: 11, color: "#7dd3fc" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
              3 of 3 sensors online
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: 28, display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0c4a6e" }}>System Overview</h1>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Live readings · Updated every 30 seconds</p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: "#dc2626", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <AlertTriangle size={14} />
                2 Critical Alerts
              </div>
              <div style={{ background: "#0ea5e9", borderRadius: 8, padding: "7px 16px", fontSize: 12, color: "#fff", fontWeight: 600 }}>
                Export Report
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { label: "Active Sensors", value: "3 / 3", sub: "All online", icon: Wifi, color: "#10b981", bg: "#d1fae5" },
              { label: "Active Alerts", value: "4", sub: "2 critical, 2 warnings", icon: Bell, color: "#ef4444", bg: "#fee2e2" },
              { label: "Overall Status", value: "At Risk", sub: "EC & Turbidity exceeded", icon: AlertTriangle, color: "#f59e0b", bg: "#fef3c7" },
            ].map(({ label, value, sub, icon: Icon, color, bg }) => (
              <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,.06)", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={22} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{value}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Live Readings Grid */}
          <div>
            <h2 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: "#374151" }}>Live Sensor Readings — Station A (River Pra)</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {readings.map(({ label, value, unit, safe, status, icon: Icon, color, bg }) => (
                <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={19} color={color} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: bg, color }}>
                      {statusLabels[status]}
                    </span>
                  </div>
                  <div style={{ marginTop: 12, fontSize: 26, fontWeight: 700, color: "#111827" }}>
                    {value}<span style={{ fontSize: 13, fontWeight: 400, color: "#9ca3af", marginLeft: 4 }}>{unit}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{label}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>Safe range: {safe}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart + Sensor Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
            {/* Trend chart */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#374151" }}>Today's Trend — EC (µS/cm)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,.12)", fontSize: 12 }} />
                  <Line type="monotone" dataKey="ec" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 8, padding: "8px 12px", background: "#fef9c3", borderRadius: 8, fontSize: 11, color: "#854d0e" }}>
                EC exceeded safe threshold (800 µS/cm) at 14:00 — possible heavy metal runoff
              </div>
            </div>

            {/* Sensor status */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: "#374151" }}>Sensor Status</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sensors.map(({ id, name, status, lastSeen }) => (
                  <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: "#f9fafb", border: `1px solid ${status === "critical" ? "#fca5a5" : status === "warning" ? "#fcd34d" : "#d1fae5"}` }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColors[status], flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>{id} · {lastSeen}</div>
                    </div>
                    {status === "normal"
                      ? <CheckCircle2 size={14} color="#10b981" />
                      : <AlertTriangle size={14} color={statusColors[status]} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
