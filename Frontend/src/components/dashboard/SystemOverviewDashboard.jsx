import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { StatCards } from "./StatCards";
import { LiveReadings } from "./LiveReadings";
import { TrendChart } from "./TrendChart";
import { SensorStatus } from "./SensorStatus";

export function SystemOverviewDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sensorStatus={{ online: 3, total: 3 }}
      />

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6 overflow-auto">
        {/* Header */}
        <Header
          title="System Overview"
          subtitle="Live readings · Updated every 30 seconds"
          criticalAlerts={2}
          warningAlerts={2}
          onExport={() => console.log("Exporting report...")}
        />

        {/* Stat Cards */}
        <StatCards />

        {/* Live Readings */}
        <LiveReadings stationName="Station A (River Pra)" />

        {/* Chart and Sensor Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trend Chart - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <TrendChart
              title="Today's Trend — EC (µS/cm)"
              dataKey="ec"
              unit="µS/cm"
              threshold={800}
              warning="EC exceeded safe threshold (800 µS/cm) at 14:00 — possible heavy metal runoff"
            />
          </div>

          {/* Sensor Status - Takes 1 column on large screens */}
          <SensorStatus />
        </div>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </main>
    </div>
  );
}
