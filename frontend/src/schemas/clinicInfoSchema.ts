import z from "zod";

export const clinicInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z
    .string()
    .min(7, "Phone must be at least 7 digits")
    .regex(/^[0-9+\-() ]+$/, "Invalid phone number"),
});

export type ClinicInfoForm = z.infer<typeof clinicInfoSchema>;
