import { NextFunction, Request, Response } from "express";
import { ZodError, type ZodType } from "zod";

export function validateSchema(schema: ZodType<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(schema.parse(req.body));
      const validatedInput = schema.parse(req.body);

      req.body = validatedInput;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation Failed",
          details: error.message,
        });
      }
    }
  };
}
