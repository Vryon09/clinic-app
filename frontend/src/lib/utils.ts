import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUserName(
  user?: {
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    role?: string | null;
    username?: string | null;
  } | null,
  options?: {
    includeMiddle?: boolean;
    useMiddleInitial?: boolean;
    fallback?: string;
  }
): string {
  if (!user) return options?.fallback || "";

  const parts: string[] = [];

  if (user.firstName?.trim()) {
    parts.push(user.firstName.trim());
  }

  if (options?.includeMiddle && user.middleName?.trim()) {
    if (options.useMiddleInitial) {
      parts.push(`${user.middleName.trim().charAt(0)}.`);
    } else {
      parts.push(user.middleName.trim());
    }
  }

  if (user.lastName?.trim()) {
    parts.push(user.lastName.trim());
  }

  const name = parts.join(" ") || user.username?.trim() || options?.fallback || "";
  if (!name || name === options?.fallback) return name;

  if (user.role === "DOCTOR" && !name.startsWith("Dr.")) {
    return `Dr. ${name}`;
  }

  return name;
}

export function formatNameWithRole(
  name?: string | null,
  role?: string | null
): string {
  if (!name) return "";
  const trimmed = name.trim();
  if (role === "DOCTOR" && !trimmed.startsWith("Dr.")) {
    return `Dr. ${trimmed}`;
  }
  return trimmed;
}

