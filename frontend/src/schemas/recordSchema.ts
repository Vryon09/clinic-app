import z from "zod";

export const createRecordSchema = z.object({
  patientId: z.string(),
  chiefComplaint: z.string().optional(),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
});

export const updateRecordSchema = createRecordSchema.partial();

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
