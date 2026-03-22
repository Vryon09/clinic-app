import z from "zod";

export const createRecordMedicationSchema = z.object({
  name: z.string().min(1),
  dosage: z.string().min(1),
  frequency: z.string().min(1),
  durationDays: z.number().int().optional(),
  instructions: z.string().optional(),
});

export const medicationInputSchema = z.object({
  name: z.string().optional(),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  durationDays: z.number().int().optional(),
  instructions: z.string().optional(),
});

export const updateRecordMedicationSchema =
  createRecordMedicationSchema.partial();

export type CreateRecordMedicationInput = z.infer<
  typeof createRecordMedicationSchema
>;

export type UpdateRecordMedicationInput = z.infer<
  typeof updateRecordMedicationSchema
>;
