import { useGetDashboardSummary, useGetDashboardTrends, useListSensors, useGetLatestReadings } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function Overview() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: trends, isLoading: loadingTrends } = useGetDashboardTrends({ period: 'today' });
  const { data: sensors, isLoading: loadingSensors } = useListSensors();
  const { data: latestReadings, isLoading: loadingReadings } = useGetLatestReadings();

  if (loadingSummary || loadingTrends || loadingSensors || loadingReadings) {
    return <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">System Overview</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-muted-foreground font-medium">Live Monitoring Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Sensors</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.onlineSensors || 0} / {summary?.totalSensors || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary?.offlineSensors || 0} offline
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.criticalAlerts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.warningAlerts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Approaching thresholds</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{summary?.overallStatus.replace('_', ' ') || 'Unknown'}</div>
            <p className="text-xs text-muted-foreground mt-1">Based on recent readings</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-primary" />
              Today's Conductivity (EC) Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {trends && trends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="ec" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorEc)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">No trend data available for today</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Sensor Status</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y border-t">
              {sensors?.slice(0, 5).map(sensor => (
                <div key={sensor.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div>
                    <div className="font-medium text-sm">{sensor.name}</div>
                    <div className="text-xs text-muted-foreground">{sensor.location}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                      sensor.status === 'normal' ? 'bg-green-500' :
                      sensor.status === 'warning' ? 'bg-amber-500' :
                      sensor.status === 'critical' ? 'bg-destructive' : 'bg-gray-400'
                    }`}></span>
                    <span className="text-xs font-medium capitalize">{sensor.status}</span>
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
