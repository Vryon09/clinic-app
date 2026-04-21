import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().email("Invalid email format"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),

  role: z.enum(["ADMIN", "DOCTOR", "ASSISTANT"]),
});

export const loginSchema = z.object({
  username: z.string().email("Invalid email format"),

  password: z.string().min(1, "Password is required"),
});
