import z from "zod";

export const createRecordMedication = z.object({
  name: z.string().min(1),
  dosage: z.string().min(1),
  frequency: z.string().min(1),
  durationDays: z.number().int().optional(),
  instructions: z.string().optional(),
});
