import { useState } from "react";
import { useGetDashboardTrends, useListReadings } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, FlaskConical, Zap, Eye, Thermometer, Activity, Droplets } from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

type Period = "today" | "week" | "month";

const paramConfig = [
  { key: "ph", label: "pH", icon: FlaskConical, color: "#8b5cf6", safe: "6.5–8.5", unit: "" },
  { key: "tds", label: "TDS", icon: Droplets, color: "#0ea5e9", safe: "< 500", unit: "mg/L" },
  { key: "ec", label: "EC", icon: Zap, color: "#f59e0b", safe: "< 800", unit: "µS/cm" },
  { key: "orp", label: "ORP", icon: Activity, color: "#10b981", safe: "+200–+600", unit: "mV" },
  { key: "turbidity", label: "Turbidity", icon: Eye, color: "#ef4444", safe: "< 4.0", unit: "NTU" },
  { key: "temperature", label: "Temperature", icon: Thermometer, color: "#06b6d4", safe: "10–30", unit: "°C" },
];

export default function Historical() {
  const [period, setPeriod] = useState<Period>("week");

  const { data: trends, isLoading } = useGetDashboardTrends({ period });
  const { data: readings } = useListReadings({ limit: 200 });

  const stats = paramConfig.map(({ key, label, color, safe, unit }) => {
    if (!trends || trends.length === 0) return { key, label, color, safe, unit, avg: 0, min: 0, max: 0 };
    const vals = trends.map((t) => Number((t as Record<string, unknown>)[key] ?? 0));
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return { key, label, color, safe, unit, avg: +avg.toFixed(2), min: +Math.min(...vals).toFixed(2), max: +Math.max(...vals).toFixed(2) };
  });

  // Exceedance data — count readings above threshold
  const exceedanceData = [
    { name: "pH", normal: 0, warning: 0, critical: 0 },
    { name: "TDS", normal: 0, warning: 0, critical: 0 },
    { name: "Turbidity", normal: 0, warning: 0, critical: 0 },
    { name: "EC", normal: 0, warning: 0, critical: 0 },
    { name: "ORP", normal: 0, warning: 0, critical: 0 },
  ];
  if (readings) {
    for (const r of readings) {
      const phStatus = r.ph > 8.5 || r.ph < 6.5 ? (r.ph > 9 || r.ph < 6 ? "critical" : "warning") : "normal";
      const tdsStatus = r.tds > 700 ? "critical" : r.tds > 500 ? "warning" : "normal";
      const turbStatus = r.turbidity > 8 ? "critical" : r.turbidity > 4 ? "warning" : "normal";
      const ecStatus = r.ec > 1000 ? "critical" : r.ec > 800 ? "warning" : "normal";
      const orpStatus = r.orp < 100 ? "critical" : r.orp < 200 ? "warning" : "normal";
      exceedanceData[0][phStatus]++;
      exceedanceData[1][tdsStatus]++;
      exceedanceData[2][turbStatus]++;
      exceedanceData[3][ecStatus]++;
      exceedanceData[4][orpStatus]++;
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Historical Data</h2>
          <p className="text-muted-foreground text-sm mt-1">Aggregated readings across all active stations</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger className="w-36" data-testid="select-period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2" data-testid="button-export-csv">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats row */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map(({ key, label, color, safe, unit, avg, min, max }) => (
            <Card key={key} className="shadow-sm" data-testid={`card-stat-${key}`}>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">{label}{unit ? ` (${unit})` : ""}</div>
                <div className="text-2xl font-bold" style={{ color }}>{avg}</div>
                <div className="text-xs text-muted-foreground mt-1">avg</div>
                <div className="flex gap-2 mt-2 text-xs">
                  <span className="text-green-600">↓{min}</span>
                  <span className="text-destructive">↑{max}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate" title={`Safe: ${safe}`}>Safe: {safe}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="w-4 h-4 text-amber-500" />
              Electrical Conductivity (EC)
              <Badge variant="outline" className="text-xs ml-auto">µS/cm</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-52 w-full" /> : (
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={trends ?? []}>
                  <defs>
                    <linearGradient id="ecGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                  <Area type="monotone" dataKey="ec" stroke="#f59e0b" strokeWidth={2} fill="url(#ecGrad)" name="EC" />
                </AreaChart>
              </ResponsiveContainer>
            )}
            <p className="text-xs text-muted-foreground mt-2">Safe threshold: 800 µS/cm</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4 text-primary" />
              pH & TDS Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-52 w-full" /> : (
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={trends ?? []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Line yAxisId="left" type="monotone" dataKey="ph" stroke="#8b5cf6" strokeWidth={2} dot={false} name="pH" />
                  <Line yAxisId="right" type="monotone" dataKey="tds" stroke="#0ea5e9" strokeWidth={2} dot={false} name="TDS" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Threshold Exceedance — Reading Count by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={exceedanceData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="normal" name="Normal" fill="#10b981" stackId="a" />
              <Bar dataKey="warning" name="Warning" fill="#f59e0b" stackId="a" />
              <Bar dataKey="critical" name="Critical" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
