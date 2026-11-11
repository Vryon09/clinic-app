import { z } from "zod";

const nameField = (fieldLabel: string) =>
  z
    .string()
    .trim()
    .min(1, `${fieldLabel} is required.`)
    .max(50, `${fieldLabel} must not exceed 50 characters.`)
    .regex(/^[^\d]+$/, `${fieldLabel} cannot contain numbers.`);

const optionalMiddleNameField = z
  .string()
  .trim()
  .max(50, "Middle name must not exceed 50 characters.")
  .regex(/^[^\d]*$/, "Middle name cannot contain numbers.")
  .optional()
  .or(z.literal(""));

const usernameField = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Username must not exceed 30 characters.")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores.",
  )
  .refine(
    (val) => !/^\d+$/.test(val),
    "Username cannot consist only of numbers.",
  );

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required."),

  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    firstName: nameField("First name"),

    middleName: optionalMiddleNameField,

    lastName: nameField("Last name"),

    username: usernameField,

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),

    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),

    role: z.enum(["ADMIN", "ASSISTANT", "DOCTOR"]).default("ADMIN"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const addUserSchema = z.object({
  firstName: nameField("First name"),

  middleName: optionalMiddleNameField,

  lastName: nameField("Last name"),

  username: usernameField,

  licenseNum: z
    .string()
    .regex(/^\d{7}$/, {
      message: "Must be exactly 7 digits",
    })
    .or(z.literal("")),

  role: z.enum(["ADMIN", "ASSISTANT", "DOCTOR"], "Choose a role"),
});

export const updateUsernameSchema = z.object({
  username: usernameField,
});

export const updateFullNameSchema = z.object({
  firstName: nameField("First name"),

  middleName: optionalMiddleNameField,

  lastName: nameField("Last name"),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password should not be the same as the old password",
    path: ["newPassword"],
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
