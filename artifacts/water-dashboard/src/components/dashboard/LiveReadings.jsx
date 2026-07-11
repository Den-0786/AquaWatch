import {
  FlaskConical,
  Droplets,
  Eye,
  Thermometer,
  Zap,
  Activity,
} from "lucide-react";

export function LiveReadings({
  stationName = "Station A (River Pra)",
  readings,
} = {}) {
  const statusConfig = {
    normal: { label: "Normal", color: "bg-green-100 text-green-700" },
    warning: { label: "Warning", color: "bg-amber-100 text-amber-700" },
    critical: { label: "Critical", color: "bg-red-100 text-red-700" },
  };

  const defaultReadings: Reading[] = [
    {
      label: "pH Level",
      value: "8.1",
      unit: "",
      safeRange: "6.5 – 8.5",
      status: "warning",
      icon: <FlaskConical size={19} />,
      color: "text-amber-600",
      bgColor: "bg-amber-50 border-amber-200",
    },
    {
      label: "TDS",
      value: "475",
      unit: "mg/L",
      safeRange: "< 500",
      status: "warning",
      icon: <Droplets size={19} />,
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
    },
    {
      label: "Turbidity",
      value: "8.4",
      unit: "NTU",
      safeRange: "< 4.0",
      status: "critical",
      icon: <Eye size={19} />,
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200",
    },
    {
      label: "Temperature",
      value: "24.7",
      unit: "°C",
      safeRange: "10 – 30",
      status: "normal",
      icon: <Thermometer size={19} />,
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200",
    },
    {
      label: "EC",
      value: "950",
      unit: "µS/cm",
      safeRange: "< 800",
      status: "critical",
      icon: <Zap size={19} />,
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200",
    },
    {
      label: "ORP",
      value: "+182",
      unit: "mV",
      safeRange: "+200 – +600",
      status: "warning",
      icon: <Activity size={19} />,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 border-cyan-200",
    },
  ];

  const displayReadings = readings || defaultReadings;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Live Sensor Readings — {stationName}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayReadings.map((reading, idx) => {
          const statusInfo = statusConfig[reading.status];

          return (
            <div
              key={idx}
              className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1`}
              style={{
                animationDelay: `${idx * 50}ms`,
              }}
            >
              {/* Header with Icon and Status Badge */}
              <div className="flex justify-between items-start mb-3">
                <div
                  className={`w-10 h-10 rounded-lg ${reading.bgColor} border flex items-center justify-center`}
                >
                  <div className={reading.color}>{reading.icon}</div>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
              </div>

              {/* Value Display */}
              <div className="space-y-1 mb-3">
                <div className="text-3xl font-bold text-gray-900">
                  {reading.value}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {reading.unit}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{reading.label}</p>
              </div>

              {/* Safe Range Info */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-600">
                  Safe range:{" "}
                  <span className="font-semibold text-gray-900">
                    {reading.safeRange}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
