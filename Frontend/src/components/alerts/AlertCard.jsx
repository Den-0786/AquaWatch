import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  X,
} from "lucide-react";

export function AlertCard({
  id,
  type,
  title,
  description,
  sensor,
  timestamp,
  reading,
  threshold,
  onDismiss,
  onAcknowledge,
}) {
  const typeConfig = {
    critical: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      labelColor: "bg-red-100 text-red-700",
      icon: <AlertTriangle size={20} />,
      label: "Critical",
    },
    warning: {
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      labelColor: "bg-amber-100 text-amber-700",
      icon: <AlertCircle size={20} />,
      label: "Warning",
    },
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      labelColor: "bg-blue-100 text-blue-700",
      icon: <CheckCircle2 size={20} />,
      label: "Info",
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`${config.bgColor} border ${config.borderColor} rounded-xl p-5 space-y-3 hover:shadow-md transition-all duration-300 group`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3 flex-1">
          <div
            className={`${config.iconBg} p-2 rounded-lg shrink-0 group-hover:scale-110 transition-transform`}
          >
            <div className={config.iconColor}>{config.icon}</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${config.labelColor}`}
              >
                {config.label}
              </span>
            </div>
            <p className="text-sm text-gray-700">{description}</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200/30 rounded-lg shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 bg-white/50 rounded-lg p-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Sensor</p>
          <p className="text-sm font-semibold text-gray-900">{sensor}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Reading</p>
          <p className="text-sm font-semibold text-gray-900">{reading}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Safe Range</p>
          <p className="text-sm font-semibold text-gray-900">{threshold}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
            <Clock size={12} /> Time
          </p>
          <p className="text-sm font-semibold text-gray-900">{timestamp}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onAcknowledge}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
            type === "critical"
              ? "bg-red-600 text-white hover:bg-red-700"
              : type === "warning"
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Zap size={14} className="inline mr-1" />
          Acknowledge
        </button>
        <button className="flex-1 py-2 px-3 rounded-lg font-medium text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
          View Details
        </button>
      </div>
    </div>
  );
}
