import { useState } from "react";
import { Sidebar } from "../dashboard/Sidebar";
import { Header } from "../dashboard/Header";
import { AlertCard } from "./AlertCard";
import { Bell, Filter, ArrowUpDown } from "lucide-react";

export function AlertsList({ alerts } = {}) {
  const [activeTab, setActiveTab] = useState("alerts");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const defaultAlerts = [
    {
      id: "A-001",
      type: "critical",
      title: "EC Level Critical",
      description:
        "Electrical conductivity exceeded safe threshold at Station A",
      sensor: "S-01 (River Pra)",
      timestamp: "Just now",
      reading: "950 µS/cm",
      threshold: "< 800 µS/cm",
      acknowledged: false,
    },
    {
      id: "A-002",
      type: "critical",
      title: "Turbidity Critical",
      description: "Water turbidity level critically high at Station A",
      sensor: "S-01 (River Pra)",
      timestamp: "2 min ago",
      reading: "8.4 NTU",
      threshold: "< 4.0 NTU",
      acknowledged: false,
    },
    {
      id: "A-003",
      type: "warning",
      title: "pH Level Warning",
      description: "pH level slightly above normal range",
      sensor: "S-01 (River Pra)",
      timestamp: "5 min ago",
      reading: "8.1",
      threshold: "6.5 – 8.5",
      acknowledged: false,
    },
    {
      id: "A-004",
      type: "warning",
      title: "Low Signal Strength",
      description: "Sensor S-02 signal strength is weak",
      sensor: "S-02 (Ofin River)",
      timestamp: "8 min ago",
      reading: "65%",
      threshold: "> 70%",
      acknowledged: true,
    },
    {
      id: "A-005",
      type: "info",
      title: "Maintenance Due",
      description: "Scheduled maintenance reminder for sensor calibration",
      sensor: "S-03 (Birim River)",
      timestamp: "1 hour ago",
      reading: "—",
      threshold: "—",
      acknowledged: true,
    },
  ];

  const displayAlerts = alerts || defaultAlerts;

  let filteredAlerts = displayAlerts.filter((alert) => {
    if (dismissedAlerts.includes(alert.id)) return false;
    if (typeFilter === "all") return true;
    return alert.type === typeFilter;
  });

  if (sortBy === "severity") {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    filteredAlerts = [...filteredAlerts].sort(
      (a, b) => severityOrder[a.type] - severityOrder[b.type],
    );
  } else if (sortBy === "oldest") {
    filteredAlerts = [...filteredAlerts].reverse();
  }

  const criticalCount = displayAlerts.filter(
    (a) => a.type === "critical",
  ).length;
  const warningCount = displayAlerts.filter((a) => a.type === "warning").length;

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-cyan-50 flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6 overflow-auto">
        {/* Header */}
        <Header
          title="Alerts & Notifications"
          subtitle="Real-time alerts from all monitoring stations"
          criticalAlerts={criticalCount}
          warningAlerts={warningCount}
          onExport={() => console.log("Exporting alerts...")}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Alerts",
              value: displayAlerts.length.toString(),
              color: "bg-gray-100 text-gray-700",
            },
            {
              label: "Critical",
              value: criticalCount.toString(),
              color: "bg-red-100 text-red-700",
            },
            {
              label: "Warnings",
              value: warningCount.toString(),
              color: "bg-amber-100 text-amber-700",
            },
            {
              label: "Unacknowledged",
              value: displayAlerts
                .filter((a) => !a.acknowledged)
                .length.toString(),
              color: "bg-blue-100 text-blue-700",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`${stat.color} rounded-lg px-4 py-3 font-semibold text-sm`}
            >
              <p className="opacity-75">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex gap-4 items-center flex-wrap">
          {/* Filter */}
          <div className="flex gap-2">
            {["all", "critical", "warning", "info"].map((filter) => (
              <button
                key={filter}
                onClick={() => setTypeFilter(filter as typeof typeFilter)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all capitalize ${
                  typeFilter === filter
                    ? "bg-cyan-500 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-cyan-300"
                }`}
              >
                <Filter size={14} className="inline mr-2" />
                {filter}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 flex items-center gap-2"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="severity">By Severity</option>
          </select>

          <div className="flex-1"></div>

          {/* Clear All Button */}
          <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all">
            Clear All
          </button>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                {...alert}
                onDismiss={() =>
                  setDismissedAlerts([...dismissedAlerts, alert.id])
                }
                onAcknowledge={() =>
                  console.log("Acknowledged alert:", alert.id)
                }
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No alerts</h3>
              <p className="text-gray-600 mt-1">
                All systems are operating normally
              </p>
            </div>
          )}
        </div>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </main>
    </div>
  );
}
