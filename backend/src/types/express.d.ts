declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: "ADMIN" | "DOCTOR" | "ASSISTANT";
    }
  }
}

export {};
