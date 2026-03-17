import z from "zod";

const optionalInt = z
  .number()
  .int()
  .optional()
  .or(z.nan())
  .transform((v) => (isNaN(v as number) ? undefined : v));
const optionalFloat = z
  .number()
  .optional()
  .or(z.nan())
  .transform((v) => (isNaN(v as number) ? undefined : v));

export const createVitalSignsSchema = z.object({
  bloodPressureSystolic: optionalInt,
  bloodPressureDiastolic: optionalInt,
  temperature: optionalFloat,
  weightKg: optionalFloat,
});

export const updateVitalSignsSchema = createVitalSignsSchema.partial();

export type CreateVitalSignsInput = z.infer<typeof createVitalSignsSchema>;
export type UpdateVitalSignsInput = z.infer<typeof updateVitalSignsSchema>;
