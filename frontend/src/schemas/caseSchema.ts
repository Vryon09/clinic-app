import z from "zod";

export const addCaseSchema = z.object({
  doctorId: z.uuid(),
  caseName: z.string().min(1, "Case name is required"),
});

export type AddCaseInput = z.infer<typeof addCaseSchema>;
