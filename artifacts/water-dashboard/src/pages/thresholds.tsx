import { useState } from "react";
import {
  useListThresholds,
  useUpdateThreshold,
  getListThresholdsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { FlaskConical, Droplets, Eye, Thermometer, Zap, Activity, Edit2, Check, X, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";

const paramIcons: Record<string, React.ElementType> = {
  pH: FlaskConical,
  TDS: Droplets,
  Turbidity: Eye,
  Temperature: Thermometer,
  EC: Zap,
  ORP: Activity,
};

const paramDescriptions: Record<string, string> = {
  pH: "Measure of acidity/alkalinity. Values outside 6.5–8.5 indicate contamination.",
  TDS: "Total Dissolved Solids — elevated levels suggest dissolved minerals or pollutants.",
  Turbidity: "Water clarity. High turbidity indicates suspended particles from mining runoff.",
  Temperature: "Water temperature. Affects dissolved oxygen and chemical reaction rates.",
  EC: "Electrical Conductivity — key indicator of heavy metal contamination from galamsey.",
  ORP: "Oxidation-Reduction Potential — low values indicate chemical reducing agents present.",
};

const paramColors: Record<string, string> = {
  pH: "text-violet-600",
  TDS: "text-sky-600",
  Turbidity: "text-orange-600",
  Temperature: "text-cyan-600",
  EC: "text-amber-600",
  ORP: "text-emerald-600",
};

export default function Thresholds() {
  const queryClient = useQueryClient();
  const { data: thresholds, isLoading } = useListThresholds();
  const updateThreshold = useUpdateThreshold();
  const { toast } = useToast();

  const [editing, setEditing] = useState<string | null>(null);
  const [minVal, setMinVal] = useState("");
  const [maxVal, setMaxVal] = useState("");

  function startEdit(parameter: string, minValue: number | null, maxValue: number | null) {
    setEditing(parameter);
    setMinVal(minValue != null ? String(minValue) : "");
    setMaxVal(maxValue != null ? String(maxValue) : "");
  }

  function cancelEdit() {
    setEditing(null);
    setMinVal(""); setMaxVal("");
  }

  function saveEdit(parameter: string) {
    const body = {
      minValue: minVal !== "" ? parseFloat(minVal) : null,
      maxValue: maxVal !== "" ? parseFloat(maxVal) : null,
    };
    updateThreshold.mutate(
      { parameter, data: body },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListThresholdsQueryKey() });
          setEditing(null);
          toast({ title: `${parameter} threshold updated`, description: "Safe range has been saved." });
        },
        onError: () => {
          toast({ title: "Update failed", description: "Could not save threshold.", variant: "destructive" });
        },
      },
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Thresholds</h2>
        <p className="text-muted-foreground text-sm mt-1">Configure safe parameter ranges for alert triggering</p>
      </div>

      <Card className="shadow-sm border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-start gap-3">
          <SlidersHorizontal className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            When a sensor reading exceeds these safe ranges, an alert is automatically triggered.
            EC and ORP thresholds are critical for detecting heavy metal contamination from illegal mining activity.
          </p>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {thresholds?.map((t) => {
            const Icon = paramIcons[t.parameter] ?? SlidersHorizontal;
            const colorClass = paramColors[t.parameter] ?? "text-primary";
            const isEditingThis = editing === t.parameter;

            return (
              <Card key={t.id} className="shadow-sm" data-testid={`card-threshold-${t.parameter}`}>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className={`w-5 h-5 ${colorClass}`} />
                      {t.parameter}
                      {t.unit && (
                        <span className="text-xs font-normal text-muted-foreground">({t.unit})</span>
                      )}
                    </CardTitle>
                    {!isEditingThis ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 text-xs"
                        onClick={() => startEdit(t.parameter, t.minValue, t.maxValue)}
                        data-testid={`button-edit-threshold-${t.parameter}`}
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-green-600 hover:text-green-700"
                          onClick={() => saveEdit(t.parameter)}
                          disabled={updateThreshold.isPending}
                          data-testid={`button-save-threshold-${t.parameter}`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground"
                          onClick={cancelEdit}
                          data-testid={`button-cancel-threshold-${t.parameter}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    {paramDescriptions[t.parameter]}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Min Value</Label>
                      {isEditingThis ? (
                        <Input
                          value={minVal}
                          onChange={(e) => setMinVal(e.target.value)}
                          placeholder="No minimum"
                          className="h-8 text-sm"
                          data-testid={`input-min-${t.parameter}`}
                        />
                      ) : (
                        <div className="text-lg font-semibold">
                          {t.minValue != null ? t.minValue : <span className="text-muted-foreground text-sm font-normal">None</span>}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Max Value</Label>
                      {isEditingThis ? (
                        <Input
                          value={maxVal}
                          onChange={(e) => setMaxVal(e.target.value)}
                          placeholder="No maximum"
                          className="h-8 text-sm"
                          data-testid={`input-max-${t.parameter}`}
                        />
                      ) : (
                        <div className="text-lg font-semibold">
                          {t.maxValue != null ? t.maxValue : <span className="text-muted-foreground text-sm font-normal">None</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  {t.updatedAt && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Last updated: {format(new Date(t.updatedAt), "MMM d, yyyy")}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
