import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCircle2,
  Clock,
  Droplets,
  Zap,
  Eye,
  FlaskConical,
  Activity,
  Filter,
  Calendar,
} from "lucide-react";

const alerts = [
  {
    id: 1, severity: "critical", parameter: "EC", value: "950 µS/cm", threshold: "800 µS/cm",
    sensor: "Station A — River Pra", time: "Today, 14:12", status: "active",
    icon: Zap, message: "Electrical Conductivity critically exceeds safe limit. Possible heavy metal or industrial runoff detected.",
  },
  {
    id: 2, severity: "critical", parameter: "Turbidity", value: "8.4 NTU", threshold: "4.0 NTU",
    sensor: "Station A — River Pra", time: "Today, 14:09", status: "active",
    icon: Eye, message: "Turbidity above acceptable limit. Suspended solids may indicate sediment disturbance from nearby mining activity.",
  },
  {
    id: 3, severity: "warning", parameter: "ORP", value: "+182 mV", threshold: "+200 mV (min)",
    sensor: "Station B — Ofin River", time: "Today, 13:55", status: "active",
    icon: Activity, message: "Oxidation-Reduction Potential below minimum threshold. Reduced ORP can indicate chemical contamination.",
  },
  {
    id: 4, severity: "warning", parameter: "pH", value: "8.1", threshold: "8.5 (max)",
    sensor: "Station A — River Pra", time: "Today, 11:30", status: "active",
    icon: FlaskConical, message: "pH approaching upper safe limit. Monitor closely; cyanide-based processing can elevate pH.",
  },
  {
    id: 5, severity: "warning", parameter: "TDS", value: "475 mg/L", threshold: "500 mg/L",
    sensor: "Station B — Ofin River", time: "Yesterday, 16:44", status: "acknowledged",
    icon: Droplets, message: "Total Dissolved Solids nearing threshold. Continue monitoring over the next 24 hours.",
  },
  {
    id: 6, severity: "critical", parameter: "EC", value: "1 120 µS/cm", threshold: "800 µS/cm",
    sensor: "Station A — River Pra", time: "Yesterday, 09:15", status: "resolved",
    icon: Zap, message: "EC spike resolved after 3 hours. Likely related to upstream mining discharge event.",
  },
];

const severityStyles: Record<string, { bg: string; border: string; text: string; badge: string; badgeText: string }> = {
  critical: { bg: "#fff5f5", border: "#fca5a5", text: "#dc2626", badge: "#fee2e2", badgeText: "#dc2626" },
  warning:  { bg: "#fffbeb", border: "#fcd34d", text: "#d97706", badge: "#fef3c7", badgeText: "#d97706" },
};

const statusBadge: Record<string, { bg: string; color: string; label: string }> = {
  active:       { bg: "#fee2e2", color: "#dc2626", label: "Active" },
  acknowledged: { bg: "#ede9fe", color: "#7c3aed", label: "Acknowledged" },
  resolved:     { bg: "#d1fae5", color: "#059669", label: "Resolved" },
};

const counts = { active: 4, acknowledged: 1, resolved: 1 };

export default function AlertsPage() {
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
            { label: "Alerts", icon: Bell, active: true },
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
              {label === "Alerts" && (
                <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "1px 6px" }}>4</span>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 28, display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0c4a6e" }}>Alerts</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Threshold violations across all monitoring stations</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "7px 14px", fontSize: 12, color: "#374151", display: "flex", alignItems: "center", gap: 6 }}>
              <Filter size={13} />
              Filter
            </div>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "7px 14px", fontSize: 12, color: "#374151", display: "flex", alignItems: "center", gap: 6 }}>
              <BellOff size={13} />
              Silence All
            </div>
          </div>
        </div>

        {/* Summary strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            { label: "Active", count: counts.active, color: "#ef4444", bg: "#fee2e2", icon: AlertTriangle },
            { label: "Acknowledged", count: counts.acknowledged, color: "#7c3aed", bg: "#ede9fe", icon: Bell },
            { label: "Resolved (today)", count: counts.resolved, color: "#059669", bg: "#d1fae5", icon: CheckCircle2 },
          ].map(({ label, count, color, bg, icon: Icon }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,.06)", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color }}>{count}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Alert list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {alerts.map((alert) => {
            const sev = severityStyles[alert.severity] ?? severityStyles.warning;
            const sts = statusBadge[alert.status];
            return (
              <div key={alert.id} style={{
                background: sev.bg, border: `1px solid ${sev.border}`,
                borderLeft: `4px solid ${sev.text}`, borderRadius: 12,
                padding: "16px 18px", boxShadow: "0 1px 3px rgba(0,0,0,.05)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: sev.badge, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <alert.icon size={18} color={sev.text} />
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                          {alert.parameter} — {alert.value}
                        </span>
                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: sev.badge, color: sev.badgeText, fontWeight: 600 }}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: sts.bg, color: sts.color, fontWeight: 600 }}>
                          {sts.label}
                        </span>
                      </div>
                      <p style={{ margin: "4px 0 6px", fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{alert.message}</p>
                      <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#6b7280" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Zap size={11} /> Threshold: {alert.threshold}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <AlertTriangle size={11} /> {alert.sensor}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={11} /> {alert.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  {alert.status === "active" && (
                    <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 12 }}>
                      <button style={{ background: "#fff", border: `1px solid ${sev.border}`, borderRadius: 7, padding: "5px 12px", fontSize: 11, color: "#374151", cursor: "pointer" }}>
                        Acknowledge
                      </button>
                      <button style={{ background: sev.text, border: "none", borderRadius: 7, padding: "5px 12px", fontSize: 11, color: "#fff", cursor: "pointer" }}>
                        Resolve
                      </button>
                    </div>
                  )}
                  {alert.status === "resolved" && (
                    <CheckCircle2 size={20} color="#059669" style={{ flexShrink: 0, marginLeft: 12 }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
