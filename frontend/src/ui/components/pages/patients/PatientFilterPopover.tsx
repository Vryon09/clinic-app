import { Filter, RotateCcw } from "lucide-react";
import { Button } from "../../shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadcn/popover";
import { Input } from "../../shadcn/input";
import { Label } from "../../shadcn/label";
import { Badge } from "../../shadcn/badge";
import type { PatientFilterParams } from "@/types/PatientType";

interface PatientFilterPopoverProps {
  filters: PatientFilterParams;
  onChange: (filters: Partial<PatientFilterParams>) => void;
  onReset: () => void;
  activeCount: number;
}

export function PatientFilterPopover({
  filters,
  onChange,
  onReset,
  activeCount,
}: PatientFilterPopoverProps) {
  const agePresets = [
    { label: "Pediatric (<18)", min: "", max: 17 },
    { label: "Adult (18-59)", min: 18, max: 59 },
    { label: "Senior (60+)", min: 60, max: "" },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative h-8.5 gap-2 border-border bg-background px-3 text-xs font-medium cursor-pointer hover:bg-muted/50"
        >
          <Filter className="size-3.5 text-muted-foreground" />
          <span>Filters</span>
          {activeCount > 0 && (
            <Badge
              variant="default"
              className="ml-1 h-4 min-w-4 px-1 text-[10px] font-semibold"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 space-y-4 rounded-lg border-border bg-card p-4 shadow-md text-foreground"
      >
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <div className="flex items-center gap-1.5">
            <Filter className="size-4 text-primary" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Filter Patients
            </h4>
          </div>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer gap-1"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </Button>
          )}
        </div>

        {/* Sex Filter */}
        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Sex
          </Label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { value: "", label: "All" },
              { value: "MALE", label: "Male" },
              { value: "FEMALE", label: "Female" },
            ].map((item) => {
              const isSelected = (filters.sex || "") === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      sex: (item.value as "MALE" | "FEMALE" | "") || undefined,
                    })
                  }
                  className={`rounded-md border px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Allergy Filter */}
        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Allergies
          </Label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { value: "all", label: "All" },
              { value: "yes", label: "Has Allergies" },
              { value: "no", label: "None" },
            ].map((item) => {
              const isSelected = (filters.hasAllergies || "all") === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      hasAllergies: item.value as "all" | "yes" | "no",
                    })
                  }
                  className={`rounded-md border px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Age Range Filter */}
        <div className="space-y-2">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Age Range
          </Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-1">
              <span className="text-[10px] text-muted-foreground">Min Age</span>
              <Input
                type="number"
                min="0"
                max="120"
                placeholder="0"
                value={filters.minAge ?? ""}
                onChange={(e) =>
                  onChange({
                    minAge: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="h-8 text-xs border-border bg-background"
              />
            </div>
            <span className="pt-4 text-xs text-muted-foreground">-</span>
            <div className="flex-1 space-y-1">
              <span className="text-[10px] text-muted-foreground">Max Age</span>
              <Input
                type="number"
                min="0"
                max="120"
                placeholder="100"
                value={filters.maxAge ?? ""}
                onChange={(e) =>
                  onChange({
                    maxAge: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="h-8 text-xs border-border bg-background"
              />
            </div>
          </div>

          {/* Age Presets */}
          <div className="flex flex-wrap gap-1 pt-1">
            {agePresets.map((preset) => {
              const isMatch =
                (filters.minAge ?? "") === preset.min &&
                (filters.maxAge ?? "") === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() =>
                    onChange({
                      minAge: preset.min as number | "",
                      maxAge: preset.max as number | "",
                    })
                  }
                  className={`rounded border px-1.5 py-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
                    isMatch
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default PatientFilterPopover;

