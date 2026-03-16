import z from "zod";

export const createVitalSignsSchema = z.object({
  recordId: z.uuid(),
  bloodPressureSystolic: z.number().int().optional(),
  bloodPressureDiastolic: z.number().int().optional(),
  temperature: z.number().optional(),
  weightKg: z.number().optional(),
});

export const updateVitalSignsSchema = createVitalSignsSchema.partial();

export type CreateVitalSignsInput = z.infer<typeof createVitalSignsSchema>;
export type UpdateVitalSignsInput = z.infer<typeof updateVitalSignsSchema>;
