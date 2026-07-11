import { useState } from "react";
import { Sidebar } from "../dashboard/Sidebar";
import { Header } from "../dashboard/Header";
import { SensorCard } from "./SensorCard";
import { Plus, Search, Filter } from "lucide-react";

export function SensorsList({ sensors } = {}) {
  const [activeTab, setActiveTab] = useState("sensors");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const defaultSensors = [
    {
      id: "S-01",
      name: "River Pra Station A",
      location: "Koforidua, Ghana",
      status: "online",
      signalStrength: 95,
      battery: 87,
      lastUpdate: "Just now",
      readings: [
        { value: 8.1, unit: "", label: "pH Level" },
        { value: 475, unit: "mg/L", label: "TDS" },
      ],
    },
    {
      id: "S-02",
      name: "Ofin River Station B",
      location: "Akyem, Ghana",
      status: "warning",
      signalStrength: 65,
      battery: 42,
      lastUpdate: "2 min ago",
      readings: [
        { value: 7.2, unit: "", label: "pH Level" },
        { value: 320, unit: "mg/L", label: "TDS" },
      ],
    },
    {
      id: "S-03",
      name: "Birim River Station C",
      location: "New Juaso, Ghana",
      status: "online",
      signalStrength: 88,
      battery: 76,
      lastUpdate: "1 min ago",
      readings: [
        { value: 7.5, unit: "", label: "pH Level" },
        { value: 280, unit: "mg/L", label: "TDS" },
      ],
    },
    {
      id: "S-04",
      name: "Test Pond Station D",
      location: "Lab, Ghana",
      status: "offline",
      signalStrength: 0,
      battery: 5,
      lastUpdate: "15 min ago",
      readings: [
        { value: 0, unit: "", label: "pH Level" },
        { value: 0, unit: "mg/L", label: "TDS" },
      ],
    },
  ];

  const displaySensors = sensors || defaultSensors;

  const filteredSensors = displaySensors.filter((sensor) => {
    const matchesSearch =
      sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sensor.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || sensor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6 overflow-auto">
        {/* Header */}
        <Header
          title="Sensors Management"
          subtitle="Monitor and configure all connected sensors"
          criticalAlerts={0}
          onExport={() => console.log("Exporting sensor data...")}
        />

        {/* Toolbar */}
        <div className="flex gap-4 items-center flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-64 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search sensors by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {["all", "online", "warning", "offline"].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter as typeof statusFilter)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  statusFilter === filter
                    ? "bg-cyan-500 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-cyan-300"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Add Sensor Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95">
            <Plus size={18} />
            Add Sensor
          </button>
        </div>

        {/* Sensors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSensors.length > 0 ? (
            filteredSensors.map((sensor) => (
              <SensorCard
                key={sensor.id}
                {...sensor}
                onClick={() => console.log("Open sensor details:", sensor.id)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No sensors found
              </h3>
              <p className="text-gray-600 mt-1">
                Try adjusting your search or filters
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
