import {
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  Battery,
  Thermometer,
  Droplets,
  Zap,
  FlaskConical,
  Activity,
  Eye,
  Bell,
  MapPin,
  Clock,
  Signal,
  Calendar,
} from "lucide-react";

const sensors = [
  {
    id: "S-01",
    name: "Station A",
    location: "River Pra — Dunkwa-on-Offin",
    status: "critical",
    online: true,
    battery: 78,
    signal: 92,
    lastReading: "30s ago",
    installed: "Jan 12, 2025",
    readings: { ph: "8.1", tds: "475", turbidity: "8.4", temp: "24.7", ec: "950", orp: "+182" },
    alerts: 2,
  },
  {
    id: "S-02",
    name: "Station B",
    location: "Ofin River — Konongo",
    status: "warning",
    online: true,
    battery: 45,
    signal: 68,
    lastReading: "1m ago",
    installed: "Jan 14, 2025",
    readings: { ph: "7.2", tds: "312", turbidity: "3.8", temp: "23.1", ec: "625", orp: "+218" },
    alerts: 1,
  },
  {
    id: "S-03",
    name: "Station C",
    location: "Birim River — Oda",
    status: "normal",
    online: true,
    battery: 91,
    signal: 88,
    lastReading: "45s ago",
    installed: "Jan 20, 2025",
    readings: { ph: "7.0", tds: "195", turbidity: "2.1", temp: "22.4", ec: "392", orp: "+298" },
    alerts: 0,
  },
  {
    id: "S-04",
    name: "Station D",
    location: "Ankobra River — Prestea",
    status: "offline",
    online: false,
    battery: 12,
    signal: 0,
    lastReading: "3h ago",
    installed: "Feb 3, 2025",
    readings: { ph: "—", tds: "—", turbidity: "—", temp: "—", ec: "—", orp: "—" },
    alerts: 0,
  },
];

const paramConfig = [
  { key: "ph",         label: "pH",       icon: FlaskConical, unit: "",       safe: "6.5–8.5" },
  { key: "tds",        label: "TDS",      icon: Droplets,     unit: "mg/L",   safe: "<500" },
  { key: "turbidity",  label: "Turb",     icon: Eye,          unit: "NTU",    safe: "<4.0" },
  { key: "temp",       label: "Temp",     icon: Thermometer,  unit: "°C",     safe: "10–30" },
  { key: "ec",         label: "EC",       icon: Zap,          unit: "µS/cm",  safe: "<800" },
  { key: "orp",        label: "ORP",      icon: Activity,     unit: "mV",     safe: "+200–+600" },
];

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  normal:  { color: "#059669", bg: "#d1fae5", label: "Normal" },
  warning: { color: "#d97706", bg: "#fef3c7", label: "Warning" },
  critical:{ color: "#dc2626", bg: "#fee2e2", label: "Critical" },
  offline: { color: "#6b7280", bg: "#f3f4f6", label: "Offline" },
};

function BatteryBar({ level }: { level: number }) {
  const color = level > 50 ? "#10b981" : level > 20 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <Battery size={13} color={color} />
      <div style={{ width: 40, height: 5, borderRadius: 3, background: "#e5e7eb", overflow: "hidden" }}>
        <div style={{ width: `${level}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 10, color: "#6b7280" }}>{level}%</span>
    </div>
  );
}

export default function SensorsPage() {
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
            { label: "Historical Data", icon: Calendar },
            { label: "Alerts", icon: Bell },
            { label: "Sensors", icon: Wifi, active: true },
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
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0c4a6e" }}>Sensors</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Manage and monitor all IoT sensor nodes</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ background: "#0ea5e9", borderRadius: 8, padding: "7px 16px", fontSize: 12, color: "#fff", fontWeight: 600 }}>
              + Add Sensor
            </div>
          </div>
        </div>

        {/* Status strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[
            { label: "Total Sensors", value: "4", icon: Wifi, color: "#0ea5e9", bg: "#e0f2fe" },
            { label: "Online", value: "3", icon: CheckCircle2, color: "#059669", bg: "#d1fae5" },
            { label: "Offline", value: "1", icon: WifiOff, color: "#6b7280", bg: "#f3f4f6" },
            { label: "Alerts Active", value: "3", icon: AlertTriangle, color: "#dc2626", bg: "#fee2e2" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,.06)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Sensor cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {sensors.map((sensor) => {
            const sc = statusConfig[sensor.status];
            return (
              <div key={sensor.id} style={{
                background: "#fff", borderRadius: 14,
                border: `1px solid ${sensor.status === "offline" ? "#e5e7eb" : sc.bg}`,
                boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                overflow: "hidden",
                opacity: sensor.online ? 1 : 0.65,
              }}>
                {/* Card header */}
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: sc.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {sensor.online ? <Wifi size={18} color={sc.color} /> : <WifiOff size={18} color="#9ca3af" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{sensor.name} <span style={{ fontWeight: 400, color: "#9ca3af" }}>({sensor.id})</span></div>
                      <div style={{ fontSize: 11, color: "#6b7280", display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                        <MapPin size={10} /> {sensor.location}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                    {sensor.alerts > 0 && (
                      <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: "#fee2e2", color: "#dc2626" }}>
                        {sensor.alerts} alert{sensor.alerts > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Readings grid */}
                <div style={{ padding: "12px 18px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {paramConfig.map(({ key, label, icon: Icon, unit }) => (
                    <div key={key} style={{ background: "#f9fafb", borderRadius: 8, padding: "8px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                        <Icon size={12} color="#9ca3af" />
                        <span style={{ fontSize: 10, color: "#9ca3af" }}>{label}</span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: sensor.online ? "#111827" : "#9ca3af" }}>
                        {sensor.readings[key as keyof typeof sensor.readings]}
                        {sensor.online && <span style={{ fontSize: 10, fontWeight: 400, color: "#9ca3af", marginLeft: 2 }}>{unit}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer meta */}
                <div style={{ padding: "10px 18px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <BatteryBar level={sensor.battery} />
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Signal size={12} color="#6b7280" />
                      <span style={{ fontSize: 10, color: "#6b7280" }}>{sensor.signal}%</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, fontSize: 10, color: "#9ca3af", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={10} /> {sensor.lastReading}</span>
                    <span>·</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Calendar size={10} /> {sensor.installed}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
