import { Wifi, Signal, Battery, Clock, MapPin, Zap } from "lucide-react";

export function SensorCard({
  id,
  name,
  location,
  status,
  signalStrength,
  battery,
  lastUpdate,
  readings,
  onClick,
}) {
  const statusConfig = {
    online: {
      label: "Online",
      color: "bg-green-100 text-green-700",
      dotColor: "bg-green-500",
    },
    offline: {
      label: "Offline",
      color: "bg-red-100 text-red-700",
      dotColor: "bg-red-500",
    },
    warning: {
      label: "Warning",
      color: "bg-amber-100 text-amber-700",
      dotColor: "bg-amber-500",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-cyan-200 transition-all duration-300 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Wifi
              size={16}
              className="text-cyan-600 group-hover:scale-110 transition-transform"
            />
            <h3 className="font-semibold text-gray-900">{name}</h3>
          </div>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <MapPin size={12} /> {location}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}
        >
          {config.label}
        </span>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-100">
        <div className="space-y-1">
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <Signal size={12} /> Signal
          </p>
          <div className="flex items-center gap-1">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all"
                style={{ width: `${signalStrength}%` }}
              ></div>
            </div>
            <span className="text-xs font-semibold text-gray-700">
              {signalStrength}%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <Battery size={12} /> Battery
          </p>
          <div className="flex items-center gap-1">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-full rounded-full transition-all ${
                  battery > 50
                    ? "bg-green-500"
                    : battery > 20
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${battery}%` }}
              ></div>
            </div>
            <span className="text-xs font-semibold text-gray-700">
              {battery}%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <Zap size={12} /> Power
          </p>
          <p className="text-xs font-semibold text-gray-900">12.4V</p>
        </div>
      </div>

      {/* Readings Grid */}
      <div className="space-y-2 mb-4">
        {readings.slice(0, 2).map((reading, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-xs text-gray-600">{reading.label}</span>
            <span className="text-sm font-semibold text-gray-900">
              {reading.value}
              <span className="text-xs text-gray-600 ml-1">{reading.unit}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-600 flex items-center gap-1">
          <Clock size={12} /> Last update: {lastUpdate}
        </p>
        <span className="text-xs font-mono text-gray-500">{id}</span>
      </div>
    </div>
  );
}
