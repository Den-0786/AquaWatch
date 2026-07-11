// Mock API for development without backend
let mockSensors = [
  { id: 1, name: "Station A", location: "Ankobra River - Bogoso", online: true, status: "normal", battery: 85, signal: 92, lastReadingAt: new Date().toISOString(), installedAt: "2024-01-15" },
  { id: 2, name: "Station B", location: "Bonsa River - Tarkwa", online: true, status: "warning", battery: 62, signal: 78, lastReadingAt: new Date().toISOString(), installedAt: "2024-02-20" },
];

let mockReadings = [
  { id: 1, sensorId: 1, ph: 7.2, tds: 420, turbidity: 2.1, temperature: 24.5, ec: 650, orp: 320, recordedAt: new Date().toISOString() },
  { id: 2, sensorId: 2, ph: 8.9, tds: 680, turbidity: 5.8, temperature: 26.1, ec: 920, orp: 180, recordedAt: new Date().toISOString() },
];

let mockAlerts = [
  { id: 1, sensorId: 2, sensorName: "Station B", parameter: "pH", value: "8.9", threshold: "8.5", severity: "warning", status: "active", message: "pH above safe threshold", triggeredAt: new Date().toISOString() },
  { id: 2, sensorId: 2, sensorName: "Station B", parameter: "EC", value: "920", threshold: "800", severity: "critical", status: "active", message: "Electrical conductivity critical", triggeredAt: new Date().toISOString() },
];

let mockThresholds = [
  { id: 1, parameter: "pH", unit: "", minValue: 6.5, maxValue: 8.5, updatedAt: new Date().toISOString() },
  { id: 2, parameter: "TDS", unit: "mg/L", minValue: null, maxValue: 500, updatedAt: new Date().toISOString() },
  { id: 3, parameter: "Turbidity", unit: "NTU", minValue: null, maxValue: 4, updatedAt: new Date().toISOString() },
  { id: 4, parameter: "Temperature", unit: "°C", minValue: 10, maxValue: 30, updatedAt: new Date().toISOString() },
  { id: 5, parameter: "EC", unit: "µS/cm", minValue: null, maxValue: 800, updatedAt: new Date().toISOString() },
  { id: 6, parameter: "ORP", unit: "mV", minValue: 200, maxValue: null, updatedAt: new Date().toISOString() },
];

let nextId = 3;

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Sensors
  listSensors: async () => {
    await delay(300);
    return mockSensors;
  },

  createSensor: async (data) => {
    await delay(500);
    const newSensor = {
      id: nextId++,
      ...data,
      online: true,
      status: "normal",
      battery: 100,
      signal: 95,
      lastReadingAt: null,
      installedAt: new Date().toISOString().split("T")[0],
    };
    mockSensors.push(newSensor);
    return newSensor;
  },

  deleteSensor: async (id) => {
    await delay(300);
    mockSensors = mockSensors.filter(s => s.id !== id);
    return { success: true };
  },

  // Readings
  listReadings: async () => {
    await delay(300);
    return mockReadings;
  },

  getLatestReadings: async () => {
    await delay(300);
    return mockReadings;
  },

  // Alerts
  listAlerts: async () => {
    await delay(300);
    return mockAlerts;
  },

  updateAlert: async (id, data) => {
    await delay(300);
    const alert = mockAlerts.find(a => a.id === id);
    if (alert) {
      Object.assign(alert, data);
    }
    return alert;
  },

  // Thresholds
  listThresholds: async () => {
    await delay(300);
    return mockThresholds;
  },

  updateThreshold: async (parameter, data) => {
    await delay(300);
    const threshold = mockThresholds.find(t => t.parameter === parameter);
    if (threshold) {
      Object.assign(threshold, data, { updatedAt: new Date().toISOString() });
    }
    return threshold;
  },

  // Dashboard
  getDashboardSummary: async () => {
    await delay(300);
    return {
      totalSensors: mockSensors.length,
      onlineSensors: mockSensors.filter(s => s.online).length,
      offlineSensors: mockSensors.filter(s => !s.online).length,
      criticalAlerts: mockAlerts.filter(a => a.status === "active" && a.severity === "critical").length,
      warningAlerts: mockAlerts.filter(a => a.status === "active" && a.severity === "warning").length,
      overallStatus: mockAlerts.some(a => a.status === "active" && a.severity === "critical") ? "critical" : 
                    mockAlerts.some(a => a.status === "active") ? "warning" : "normal",
    };
  },

  getDashboardTrends: async () => {
    await delay(300);
    // Generate mock trend data
    return Array.from({ length: 24 }, (_, i) => ({
      label: `${i}:00`,
      ec: 600 + Math.random() * 400,
      ph: 6.5 + Math.random() * 2,
      tds: 300 + Math.random() * 400,
      turbidity: 1 + Math.random() * 8,
      temperature: 20 + Math.random() * 10,
      orp: 150 + Math.random() * 300,
    }));
  },
};

export default mockApi;
