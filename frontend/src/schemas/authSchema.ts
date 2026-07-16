import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required."),

  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required.")
      .max(50, "First name must not exceed 50 characters."),

    middleName: z
      .string()
      .trim()
      .min(1, "Middle name is required.")
      .max(50, "Middle name must not exceed 50 characters."),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required.")
      .max(50, "Last name must not exceed 50 characters."),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),

    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),

    role: z.enum(["ADMIN", "ASSISTANT", "DOCTOR"]).default("ADMIN"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // attach error to this field
  });

export const addUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(50, "First name must not exceed 50 characters."),

  middleName: z
    .string()
    .trim()
    .min(1, "Middle name is required.")
    .max(50, "Middle name must not exceed 50 characters."),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(50, "Last name must not exceed 50 characters."),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_. ]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),

  licenseNum: z
    .string()
    .regex(/^\d{7}$/, {
      message: "Must be exactly 7 digits",
    })
    .or(z.literal("")),

  role: z.enum(["ADMIN", "ASSISTANT", "DOCTOR"], "Choose a role"),
});

export const updateUsernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_. ]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
});

export const updateFullNameSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(50, "First name must not exceed 50 characters."),

  middleName: z
    .string()
    .trim()
    .min(1, "Middle name is required.")
    .max(50, "Middle name must not exceed 50 characters."),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(50, "Last name must not exceed 50 characters."),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password should not be the same as the old password",
    path: ["newPassword"], // attach error to this field
  });

export const changeLicenseNumSchema = z.object({
  licenseNum: z
    .string()
    .regex(/^\d{7}$/, {
      message: "Must be exactly 7 digits",
    })
    .or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type AddUserInput = z.infer<typeof addUserSchema>;
export type UpdateUsernameInput = z.infer<typeof updateUsernameSchema>;
export type UpdateFullNameInput = z.infer<typeof updateFullNameSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ChangeLicenseNumInput = z.infer<typeof changeLicenseNumSchema>;
