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
    toast.success("Text Size Updated", {
      description: `Application text size set to ${label}.`,
      duration: 2000,
    });
  };

  const handleReset = () => {
    resetTextSize();
    toast.info("Text Size Reset", {
      description: "Application text size reset to Medium (Default).",
      duration: 2000,
    });
  };

  return (
    <Card className="border-border/80 bg-card space-y-6 rounded-xl border p-6 shadow-xs">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary rounded-lg p-2">
            <Type className="size-5" />
          </div>
          <div>
            <h2 className="text-foreground text-lg font-semibold">
              Display & Text Size
            </h2>
            <p className="text-muted-foreground text-xs">
              Adjust the application text scale for better legibility and
              reading comfort
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={textSize === "medium"}
          className="h-9 cursor-pointer gap-1.5 text-xs"
        >
          <RotateCcw className="size-3.5" /> Reset to Default
        </Button>
      </div>

      <Separator className="bg-border/60" />

      {/* Size Selection Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((option) => {
          const isSelected = textSize === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelectSize(option.value, option.label)}
              className={`relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 ring-primary/20 shadow-xs ring-2"
                  : "border-border/80 bg-background/50 hover:border-border hover:bg-muted/40"
              }`}
            >
              <div className="w-full space-y-2">
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
                    <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full">
                      <Check className="size-3" />
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-foreground text-sm font-semibold">
                      {option.label}
                    </span>
                    {option.value === "medium" && (
                      <Badge
                        variant="outline"
                        className="px-1.5 py-0 text-[10px]"
                      >
                        Default
                      </Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {option.pixelEquivalent} ({option.percentage})
                  </span>
                </div>

                <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Preview Box */}
      <div className="border-border/70 bg-muted/20 space-y-3 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold">
            <Eye className="text-primary size-4" />
            <span>Live Consultation & Patient Card Preview</span>
          </div>
          <span className="text-muted-foreground text-[11px]">
            Current Scale:{" "}
            {options.find((o) => o.value === textSize)?.percentage}
          </span>
        </div>

        <div className="border-border/80 bg-card space-y-3 rounded-lg border p-4 shadow-xs">
          <div className="border-border/60 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-foreground text-sm font-semibold">
                  Dela Cruz, Juan M.
                </span>
                <Badge variant="secondary" className="text-xs font-medium">
                  Patient #2026-0042
                </Badge>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">
                45 years old • Male • Last visit: Oct 28, 2026
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Active Consultation
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
            <div className="bg-muted/40 rounded-md p-2.5">
              <span className="text-foreground mb-0.5 block font-semibold">
                Chief Complaint
              </span>
              <p className="text-muted-foreground">
                Persistent dry cough for 3 days, mild sore throat, no fever.
              </p>
            </div>

            <div className="bg-muted/40 rounded-md p-2.5">
              <span className="text-foreground mb-0.5 block font-semibold">
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
