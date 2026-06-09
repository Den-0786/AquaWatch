import { useListAlerts, useUpdateAlert, getListAlertsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Bell, BellOff, CheckCircle2, Clock, MapPin, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function severityClass(severity: string) {
  return severity === "critical"
    ? "border-l-destructive bg-destructive/5"
    : "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20";
}
function severityBadge(severity: string) {
  return severity === "critical" ? "destructive" : "outline";
}

export default function Alerts() {
  const queryClient = useQueryClient();
  const { data: allAlerts, isLoading } = useListAlerts({}, {
    query: { queryKey: getListAlertsQueryKey({}) },
  });
  const updateAlert = useUpdateAlert();

  const activeAlerts = allAlerts?.filter((a) => a.status === "active") ?? [];
  const acknowledgedAlerts = allAlerts?.filter((a) => a.status === "acknowledged") ?? [];
  const resolvedAlerts = allAlerts?.filter((a) => a.status === "resolved") ?? [];

  function handleUpdate(id: number, status: "acknowledged" | "resolved") {
    updateAlert.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAlertsQueryKey({}) });
        },
      },
    );
  }

  const summaryCards = [
    { label: "Active", count: activeAlerts.length, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
    { label: "Acknowledged", count: acknowledgedAlerts.length, icon: Bell, color: "text-violet-600", bg: "bg-violet-100 dark:bg-violet-900/20" },
    { label: "Resolved Today", count: resolvedAlerts.length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alerts</h2>
          <p className="text-muted-foreground text-sm mt-1">Threshold violations across all monitoring stations</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" data-testid="button-silence-all">
          <BellOff className="w-4 h-4" />
          Silence All
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {summaryCards.map(({ label, count, icon: Icon, color, bg }) => (
          <Card key={label} className="shadow-sm" data-testid={`card-alert-${label.toLowerCase()}`}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-3xl font-bold ${color}`}>{count}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {allAlerts?.length === 0 && (
            <Card className="shadow-sm">
              <CardContent className="p-12 flex flex-col items-center gap-3 text-muted-foreground">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
                <p className="font-medium">No alerts — all parameters within safe range</p>
              </CardContent>
            </Card>
          )}
          {allAlerts?.map((alert) => (
            <div
              key={alert.id}
              data-testid={`alert-item-${alert.id}`}
              className={`border-l-4 rounded-xl border border-border p-4 transition-all ${severityClass(alert.severity)}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {alert.parameter} — {alert.value}
                    </span>
                    <Badge variant={severityBadge(alert.severity) as "destructive" | "outline"} className="text-xs uppercase">
                      {alert.severity}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        alert.status === "active" ? "border-destructive text-destructive" :
                        alert.status === "acknowledged" ? "border-violet-500 text-violet-600" :
                        "border-green-500 text-green-600"
                      }`}
                    >
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{alert.message}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Threshold: {alert.threshold}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {alert.sensorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(alert.triggeredAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                {alert.status === "active" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid={`button-acknowledge-${alert.id}`}
                      onClick={() => handleUpdate(alert.id, "acknowledged")}
                      disabled={updateAlert.isPending}
                    >
                      Acknowledge
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      data-testid={`button-resolve-${alert.id}`}
                      onClick={() => handleUpdate(alert.id, "resolved")}
                      disabled={updateAlert.isPending}
                    >
                      Resolve
                    </Button>
                  </div>
                )}
                {alert.status === "acknowledged" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-shrink-0 text-green-600 border-green-500 hover:bg-green-50"
                    data-testid={`button-resolve-ack-${alert.id}`}
                    onClick={() => handleUpdate(alert.id, "resolved")}
                    disabled={updateAlert.isPending}
                  >
                    Resolve
                  </Button>
                )}
                {alert.status === "resolved" && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
