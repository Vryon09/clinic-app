import { useTextSize, type TextSize } from "@/contexts/TextSizeContext";
import { Card } from "../../../shadcn/card";
import { Button } from "../../../shadcn/button";
import { Badge } from "../../../shadcn/badge";
import { Separator } from "../../../shadcn/separator";
import { Type, RotateCcw, Check, Eye } from "lucide-react";
import { toast } from "sonner";

export default function TextSizeSettings() {
  const { textSize, setTextSize, resetTextSize, options } = useTextSize();

  const handleSelectSize = (size: TextSize, label: string) => {
    setTextSize(size);
    toast.success(`Text size changed to ${label}`, {
      position: "top-center",
      duration: 2000,
    });
  };

  const handleReset = () => {
    resetTextSize();
    toast.info("Text size reset to Medium (Default)", {
      position: "top-center",
      duration: 2000,
    });
  };

  return (
    <Card className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Type className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Display & Text Size
            </h2>
            <p className="text-xs text-muted-foreground">
              Adjust the application text scale for better legibility and reading comfort
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={textSize === "medium"}
          className="gap-1.5 h-9 text-xs cursor-pointer"
        >
          <RotateCcw className="size-3.5" /> Reset to Default
        </Button>
      </div>

      <Separator className="bg-border/60" />

      {/* Size Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {options.map((option) => {
          const isSelected = textSize === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelectSize(option.value, option.label)}
              className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                  : "border-border/80 bg-background/50 hover:border-border hover:bg-muted/40"
              }`}
            >
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <span
                    className={`flex items-center justify-center rounded-md font-bold transition-transform ${
                      option.value === "small"
                        ? "size-7 text-xs"
                        : option.value === "medium"
                        ? "size-8 text-sm"
                        : option.value === "large"
                        ? "size-9 text-base"
                        : "size-10 text-lg"
                    } ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    A
                  </span>

                  {isSelected && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" />
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">
                      {option.label}
                    </span>
                    {option.value === "medium" && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        Default
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {option.pixelEquivalent} ({option.percentage})
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Preview Box */}
      <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Eye className="size-4 text-primary" />
            <span>Live Consultation & Patient Card Preview</span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            Current Scale: {options.find((o) => o.value === textSize)?.percentage}
          </span>
        </div>

        <div className="rounded-lg border border-border/80 bg-card p-4 space-y-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-sm">
                  Dela Cruz, Juan M.
                </span>
                <Badge variant="secondary" className="text-xs font-medium">
                  Patient #2026-0042
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                45 years old • Male • Last visit: Oct 28, 2026
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Active Consultation
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-md bg-muted/40 p-2.5">
              <span className="font-semibold text-foreground block mb-0.5">
                Chief Complaint
              </span>
              <p className="text-muted-foreground">
                Persistent dry cough for 3 days, mild sore throat, no fever.
              </p>
            </div>

            <div className="rounded-md bg-muted/40 p-2.5">
              <span className="font-semibold text-foreground block mb-0.5">
                Vitals & Assessment
              </span>
              <p className="text-muted-foreground">
                BP: 120/80 mmHg • HR: 74 bpm • Temp: 36.8°C • SpO2: 99%
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
