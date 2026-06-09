import { useGetDashboardSummary, useGetDashboardTrends, useListSensors } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

const STATUS_DOT: Record<string, string> = {
  normal:   "bg-green-500",
  warning:  "bg-amber-500",
  critical: "bg-destructive",
  offline:  "bg-muted-foreground/50",
};

export default function Overview() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: trends, isLoading: loadingTrends } = useGetDashboardTrends({ period: "today" });
  const { data: sensors, isLoading: loadingSensors } = useListSensors();

  const isLoading = loadingSummary || loadingTrends || loadingSensors;

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  const statusLabel = summary?.overallStatus?.replace("_", " ") ?? "Unknown";
  const statusColor =
    summary?.overallStatus === "critical" ? "text-destructive" :
    summary?.overallStatus === "warning"  ? "text-amber-500"   :
    summary?.overallStatus === "normal"   ? "text-green-600"   : "text-muted-foreground";

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Heading */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">System Overview</h2>
        <div className="flex items-center gap-2 text-sm shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="text-muted-foreground font-medium hidden sm:inline">Live Monitoring Active</span>
        </div>
      </div>

      {/* Summary cards — 2-col on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="shadow-sm border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Active Sensors</CardTitle>
            <Activity className="h-4 w-4 text-primary shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold">
              {summary?.onlineSensors ?? 0}<span className="text-muted-foreground text-lg font-normal"> / {summary?.totalSensors ?? 0}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{summary?.offlineSensors ?? 0} offline</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-destructive">{summary?.criticalAlerts ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Immediate attention</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-amber-500">{summary?.warningAlerts ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Approaching thresholds</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Overall Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className={`text-2xl font-bold capitalize ${statusColor}`}>{statusLabel}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Based on recent readings</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts + sensor list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* EC Trend chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <Droplet className="w-4 h-4 text-primary shrink-0" />
              Today's Conductivity (EC) Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-56 md:h-72 w-full">
              {trends && trends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px", border: "1px solid hsl(var(--border))", fontSize: 11 }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                    />
                    <Area type="monotone" dataKey="ec" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorEc)" name="EC (µS/cm)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  No trend data available for today
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sensor status list */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base flex items-center justify-between">
              Sensor Status
              <Link href="/sensors" className="text-xs font-normal text-primary hover:underline">
                View all →
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {sensors?.map((sensor) => (
                <div key={sensor.id} className="px-4 py-3 flex items-center justify-between hover:bg-muted/40 transition-colors">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{sensor.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{sensor.location}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_DOT[sensor.status] ?? STATUS_DOT.offline}`} />
                    <span className="text-xs font-medium capitalize hidden sm:inline">{sensor.status}</span>
                  </div>
                </div>
              ))}
              {!sensors?.length && (
                <div className="p-8 text-center text-muted-foreground text-sm">No sensors found</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
