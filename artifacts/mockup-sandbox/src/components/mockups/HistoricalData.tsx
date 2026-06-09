import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Calendar, Download, Filter, FlaskConical, Droplets, Zap, Activity } from "lucide-react";

const weeklyData = [
  { day: "Mon", ph: 7.1, tds: 210, ec: 420, orp: 285, turbidity: 3.2 },
  { day: "Tue", ph: 7.3, tds: 225, ec: 445, orp: 271, turbidity: 3.8 },
  { day: "Wed", ph: 6.9, tds: 198, ec: 398, orp: 310, turbidity: 2.9 },
  { day: "Thu", ph: 7.6, tds: 310, ec: 620, orp: 248, turbidity: 5.1 },
  { day: "Fri", ph: 8.1, tds: 475, ec: 950, orp: 182, turbidity: 8.4 },
  { day: "Sat", ph: 7.8, tds: 390, ec: 780, orp: 201, turbidity: 6.7 },
  { day: "Sun", ph: 7.4, tds: 280, ec: 560, orp: 264, turbidity: 4.2 },
];

const hourlyEC = [
  { time: "00:00", ec: 415 }, { time: "02:00", ec: 408 }, { time: "04:00", ec: 422 },
  { time: "06:00", ec: 435 }, { time: "08:00", ec: 448 }, { time: "10:00", ec: 510 },
  { time: "12:00", ec: 620 }, { time: "14:00", ec: 950 }, { time: "16:00", ec: 780 },
  { time: "18:00", ec: 640 }, { time: "20:00", ec: 510 }, { time: "22:00", ec: 462 },
];

const exceedanceData = [
  { parameter: "pH", normal: 5, warning: 1, critical: 1 },
  { parameter: "TDS", normal: 4, warning: 2, critical: 1 },
  { parameter: "Turbidity", normal: 3, warning: 2, critical: 2 },
  { parameter: "EC", normal: 3, warning: 2, critical: 2 },
  { parameter: "ORP", normal: 5, warning: 1, critical: 1 },
];

const metrics = [
  { label: "pH", icon: FlaskConical, avg: "7.46", min: "6.9", max: "8.1", color: "#8b5cf6", range: "6.5–8.5" },
  { label: "TDS (mg/L)", icon: Droplets, avg: "298", min: "198", max: "475", color: "#0ea5e9", range: "< 500" },
  { label: "EC (µS/cm)", icon: Zap, avg: "596", min: "398", max: "950", color: "#f59e0b", range: "< 800" },
  { label: "ORP (mV)", icon: Activity, avg: "252", min: "182", max: "310", color: "#10b981", range: "+200–+600" },
];

export default function HistoricalData() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f0f9ff", minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: "#0c4a6e", color: "#e0f2fe", display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 }}>
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
            { label: "Overview", icon: Activity },
            { label: "Historical Data", icon: Calendar, active: true },
            { label: "Alerts", icon: Filter },
            { label: "Sensors", icon: Zap },
          ].map(({ label, icon: Icon, active }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
              borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 400,
              background: active ? "#075985" : "transparent",
              color: active ? "#fff" : "#93c5fd",
            }}>
              <Icon size={16} />
              {label}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 28, display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0c4a6e" }}>Historical Data</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Weekly analysis — River Pra, Station A</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "7px 14px", fontSize: 12, color: "#374151", display: "flex", alignItems: "center", gap: 6 }}>
              <Calendar size={13} />
              Last 7 Days
            </div>
            <div style={{ background: "#0ea5e9", borderRadius: 8, padding: "7px 16px", fontSize: 12, color: "#fff", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Download size={13} />
              Export CSV
            </div>
          </div>
        </div>

        {/* Stats summary row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {metrics.map(({ label, icon: Icon, avg, min, max, color, range }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Icon size={15} color={color} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{label}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{avg}</div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>7-day avg</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8, fontSize: 10 }}>
                <span style={{ color: "#10b981" }}>Min: {min}</span>
                <span style={{ color: "#9ca3af" }}>·</span>
                <span style={{ color: "#ef4444" }}>Max: {max}</span>
              </div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>Safe: {range}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* EC hourly */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: "#374151" }}>EC — Today (hourly)</h3>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={hourlyEC}>
                <defs>
                  <linearGradient id="ecGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,.1)", fontSize: 11 }} />
                <Area type="monotone" dataKey="ec" stroke="#f59e0b" strokeWidth={2} fill="url(#ecGrad)" />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>
              Safe threshold: 800 µS/cm · <span style={{ color: "#ef4444" }}>Exceeded 14:00–18:00</span>
            </div>
          </div>

          {/* Weekly multi-param */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: "#374151" }}>pH & TDS — Weekly trend</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,.1)", fontSize: 11 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="left" type="monotone" dataKey="ph" stroke="#8b5cf6" strokeWidth={2} dot={false} name="pH" />
                <Line yAxisId="right" type="monotone" dataKey="tds" stroke="#0ea5e9" strokeWidth={2} dot={false} name="TDS" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exceedance chart */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: "#374151" }}>Threshold Exceedance — Past 7 Days (reading count by status)</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={exceedanceData} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="parameter" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,.1)", fontSize: 11 }} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="normal" name="Normal" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="warning" name="Warning" fill="#f59e0b" stackId="a" />
              <Bar dataKey="critical" name="Critical" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
