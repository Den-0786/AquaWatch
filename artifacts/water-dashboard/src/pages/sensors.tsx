import { useState } from "react";
import {
  useListSensors,
  useCreateSensor,
  useDeleteSensor,
  useGetLatestReadings,
  getListSensorsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Wifi, WifiOff, AlertTriangle, CheckCircle2, Battery, Signal,
  Thermometer, Droplets, Zap, FlaskConical, Activity, Eye,
  MapPin, Clock, Calendar, Plus, Trash2,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

const statusConfig: Record<string, { label: string; color: string; dot: string; border: string }> = {
  normal:   { label: "Normal",   color: "text-green-600",     dot: "bg-green-500",     border: "border-green-200 dark:border-green-900" },
  warning:  { label: "Warning",  color: "text-amber-600",     dot: "bg-amber-500",     border: "border-amber-200 dark:border-amber-900" },
  critical: { label: "Critical", color: "text-destructive",   dot: "bg-destructive",   border: "border-destructive/30" },
  offline:  { label: "Offline",  color: "text-muted-foreground", dot: "bg-gray-400",   border: "border-border" },
};

const paramConfig = [
  { key: "ph",          label: "pH",    icon: FlaskConical, unit: ""       },
  { key: "tds",         label: "TDS",   icon: Droplets,     unit: "mg/L"   },
  { key: "turbidity",   label: "Turb",  icon: Eye,          unit: "NTU"    },
  { key: "temperature", label: "Temp",  icon: Thermometer,  unit: "°C"     },
  { key: "ec",          label: "EC",    icon: Zap,          unit: "µS/cm"  },
  { key: "orp",         label: "ORP",   icon: Activity,     unit: "mV"     },
];

function BatteryBar({ level }: { level: number }) {
  const color = level > 50 ? "bg-green-500" : level > 20 ? "bg-amber-500" : "bg-destructive";
  return (
    <div className="flex items-center gap-1.5">
      <Battery className="w-3.5 h-3.5 text-muted-foreground" />
      <div className="w-10 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${level}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">{level}%</span>
    </div>
  );
}

export default function Sensors() {
  const queryClient = useQueryClient();
  const { data: sensors, isLoading } = useListSensors();
  const { data: latestReadings } = useGetLatestReadings();
  const createSensor = useCreateSensor();
  const deleteSensor = useDeleteSensor();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const readingsBySensor = (latestReadings ?? []).reduce<Record<number, typeof latestReadings[0]>>(
    (acc, r) => { acc[r.sensorId] = r; return acc; }, {}
  );

  function handleCreate() {
    if (!name.trim() || !location.trim()) return;
    createSensor.mutate(
      { data: { name: name.trim(), location: location.trim() } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSensorsQueryKey() });
          setDialogOpen(false);
          setName(""); setLocation("");
        },
      },
    );
  }

  function handleDelete(id: number) {
    deleteSensor.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListSensorsQueryKey() }),
    });
  }

  const summaryItems = [
    { label: "Total Sensors", value: sensors?.length ?? 0, icon: Wifi, color: "text-primary", bg: "bg-primary/10" },
    { label: "Online",        value: sensors?.filter(s => s.online).length ?? 0, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20" },
    { label: "Offline",       value: sensors?.filter(s => !s.online).length ?? 0, icon: WifiOff, color: "text-muted-foreground", bg: "bg-muted" },
    { label: "Alerts Active", value: sensors?.filter(s => s.status === "critical" || s.status === "warning").length ?? 0, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sensors</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage and monitor all IoT sensor nodes</p>
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)} data-testid="button-add-sensor">
          <Plus className="w-4 h-4" />
          Add Sensor
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryItems.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sensors?.map((sensor) => {
            const sc = statusConfig[sensor.status] ?? statusConfig.offline;
            const reading = readingsBySensor[sensor.id];
            return (
              <Card
                key={sensor.id}
                data-testid={`card-sensor-${sensor.id}`}
                className={`shadow-sm border ${sc.border} transition-all ${!sensor.online ? "opacity-60" : ""}`}
              >
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${!sensor.online ? "bg-muted" : "bg-primary/10"}`}>
                        {sensor.online
                          ? <Wifi className="w-5 h-5 text-primary" />
                          : <WifiOff className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {sensor.name}
                          <span className="text-muted-foreground font-normal text-sm ml-1.5">({sensor.id})</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />{sensor.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge
                        variant={sensor.status === "critical" ? "destructive" : "outline"}
                        className={`text-xs ${sc.color}`}
                      >
                        {sc.label}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 text-muted-foreground hover:text-destructive"
                        data-testid={`button-delete-sensor-${sensor.id}`}
                        onClick={() => handleDelete(sensor.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-3 pb-3">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {paramConfig.map(({ key, label, icon: Icon, unit }) => {
                      const val = reading ? (reading as Record<string, unknown>)[key] : null;
                      return (
                        <div key={key} className="bg-muted/50 rounded-lg p-2">
                          <div className="flex items-center gap-1 mb-1">
                            <Icon className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{label}</span>
                          </div>
                          <div className="text-sm font-bold">
                            {val != null ? (
                              <>{Number(val).toFixed(1)}<span className="text-xs font-normal text-muted-foreground ml-0.5">{unit}</span></>
                            ) : "—"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex gap-3">
                      <BatteryBar level={sensor.battery} />
                      <div className="flex items-center gap-1">
                        <Signal className="w-3.5 h-3.5" />
                        <span>{sensor.signal}%</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {sensor.lastReadingAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(sensor.lastReadingAt), { addSuffix: true })}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(sensor.installedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register New Sensor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="sensor-name">Sensor Name</Label>
              <Input
                id="sensor-name"
                placeholder="e.g. Station E"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="input-sensor-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sensor-location">Location</Label>
              <Input
                id="sensor-location"
                placeholder="e.g. Ankobra River — Bogoso"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                data-testid="input-sensor-location"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreate}
              disabled={!name.trim() || !location.trim() || createSensor.isPending}
              data-testid="button-confirm-add-sensor"
            >
              {createSensor.isPending ? "Registering…" : "Register Sensor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
