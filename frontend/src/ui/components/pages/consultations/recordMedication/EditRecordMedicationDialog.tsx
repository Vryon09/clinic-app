import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/components/shadcn/dialog";
import { Field, FieldError, FieldLabel } from "@/ui/components/shadcn/field";
import { Input } from "@/ui/components/shadcn/input";
import { Textarea } from "@/ui/components/shadcn/textarea";
import { Button } from "@/ui/components/shadcn/button";
import { Clock, Pill, Save } from "lucide-react";
import {
  createRecordMedicationSchema,
  type CreateRecordMedicationInput,
} from "@/schemas/recordMedication";

const FREQUENCY_PRESETS = [
  "Once daily (OD)",
  "Twice daily (BID)",
  "3x daily (TID)",
  "As needed (PRN)",
];

const DURATION_PRESETS = [3, 5, 7, 14, 30];

interface IEditRecordMedicationDialog {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  medication: CreateRecordMedicationInput | null;
  onSave: (updatedData: CreateRecordMedicationInput) => void;
}

export default function EditRecordMedicationDialog({
  isOpen,
  onOpenChange,
  medication,
  onSave,
}: IEditRecordMedicationDialog) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateRecordMedicationInput>({
    resolver: zodResolver(createRecordMedicationSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "",
      durationDays: undefined,
      instructions: "",
    },
  });

  useEffect(() => {
    if (medication && isOpen) {
      reset({
        name: medication.name || "",
        dosage: medication.dosage || "",
        frequency: medication.frequency || "",
        durationDays:
          medication.durationDays != null
            ? Number(medication.durationDays)
            : undefined,
        instructions: medication.instructions || "",
      });
    }
  }, [medication, isOpen, reset]);

  const handleFormSubmit = (data: CreateRecordMedicationInput) => {
    onSave({
      ...data,
      durationDays: data.durationDays ? Number(data.durationDays) : undefined,
      instructions: data.instructions || "",
    });
    onOpenChange(false);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(handleFormSubmit)(e);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Pill className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                Edit Medication
              </DialogTitle>
              <p className="text-[11px] text-muted-foreground">
                Update drug dosage, frequency, duration, or instructions
              </p>
            </div>
          </div>
        </DialogHeader>

        <div
          className="space-y-4"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit(handleFormSubmit)();
            }
          }}
        >
          <div className="grid grid-cols-2 gap-3 border-b border-border/60 pb-4">
            {/* Drug Name */}
            <Field className="col-span-2 sm:col-span-1">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Medication Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                className="h-9 rounded-lg border-border/80 text-xs"
                placeholder="e.g. Amoxicillin"
                {...register("name")}
              />
              {errors.name && (
                <FieldError className="text-xs" errors={[errors.name]} />
              )}
            </Field>

            {/* Dosage */}
            <Field className="col-span-2 sm:col-span-1">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Dosage / Form <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                className="h-9 rounded-lg border-border/80 text-xs"
                placeholder="e.g. 500mg, 1 tab"
                {...register("dosage")}
              />
              {errors.dosage && (
                <FieldError className="text-xs" errors={[errors.dosage]} />
              )}
            </Field>

            {/* Frequency */}
            <Field className="col-span-2 sm:col-span-1">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Frequency <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                className="h-9 rounded-lg border-border/80 text-xs"
                placeholder="e.g. 3x a day"
                {...register("frequency")}
              />
              {errors.frequency && (
                <FieldError className="text-xs" errors={[errors.frequency]} />
              )}

              {/* Frequency Presets */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                {FREQUENCY_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() =>
                      setValue("frequency", preset, { shouldValidate: true })
                    }
                    className="cursor-pointer rounded-md border border-border/60 bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </Field>

            {/* Duration */}
            <Field className="col-span-2 sm:col-span-1">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Duration <span className="text-muted-foreground/60">(days)</span>
              </FieldLabel>
              <Input
                className="h-9 rounded-lg border-border/80 text-xs"
                type="number"
                placeholder="e.g. 7"
                {...register("durationDays", {
                  setValueAs: (v) =>
                    v === "" || v === null || isNaN(v) ? undefined : Number(v),
                })}
              />
              {errors.durationDays && (
                <FieldError
                  className="text-xs"
                  errors={[errors.durationDays]}
                />
              )}

              {/* Duration Presets */}
              <div className="mt-1.5 flex items-center gap-1">
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <Clock className="size-2.5" />
                </span>
                {DURATION_PRESETS.map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() =>
                      setValue("durationDays", days, { shouldValidate: true })
                    }
                    className="cursor-pointer rounded-md border border-border/60 bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </Field>

            {/* Instructions */}
            <Field className="col-span-2">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                Instructions
              </FieldLabel>
              <Textarea
                className="min-h-[72px] resize-none rounded-lg border-border/80 text-xs"
                placeholder="e.g. Take after meals with full glass of water"
                {...register("instructions")}
              />
              {errors.instructions && (
                <FieldError
                  className="text-xs"
                  errors={[errors.instructions]}
                />
              )}
            </Field>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg text-xs"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="gap-1.5 rounded-lg text-xs font-medium cursor-pointer"
              onClick={handleSave}
            >
              <Save className="size-3.5" />
              <span>Save Changes</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
