import z from "zod";

export const uploadLabResultSchema = z.object({
  patientId: z.uuid(),
});
