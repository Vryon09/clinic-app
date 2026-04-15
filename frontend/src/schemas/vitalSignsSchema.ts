import z from "zod";

const optionalInt = (min: number, max: number) =>
  z
    .number()
    .int()
    .min(min)
    .max(max)
    .optional()
    .or(z.nan())
    .transform((v) => (isNaN(v as number) ? undefined : v));
const optionalFloat = (min: number, max: number) =>
  z
    .number()
    .min(min)
    .max(max)
    .optional()
    .or(z.nan())
    .transform((v) => (isNaN(v as number) ? undefined : v));

const bloodPressureRefinement = (data: {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
}) => {
  const { bloodPressureSystolic, bloodPressureDiastolic } = data;
  if (
    bloodPressureSystolic !== undefined &&
    bloodPressureDiastolic !== undefined
  )
    return bloodPressureSystolic > bloodPressureDiastolic;
  return true;
};

const bloodPressureRefinementConfig = {
  message: "Systolic pressure must be higher than diastolic pressure",
  path: ["bloodPressureSystolic"],
};

const baseVitalSignsSchema = z.object({
  bloodPressureSystolic: optionalInt(50, 300),
  bloodPressureDiastolic: optionalInt(20, 150),
  temperature: optionalFloat(25, 45),
  weightKg: optionalFloat(0.5, 700),
});

export const createVitalSignsSchema = baseVitalSignsSchema.refine(
  bloodPressureRefinement,
  bloodPressureRefinementConfig,
);

export const updateVitalSignsSchema = baseVitalSignsSchema.partial();

export type CreateVitalSignsInput = z.infer<typeof createVitalSignsSchema>;
export type UpdateVitalSignsInput = z.infer<typeof updateVitalSignsSchema>;
