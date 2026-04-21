import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { registerSchema, loginSchema } from "../schemas/authSchema";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues,
      });
    }

    const { username, password, role } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({
      message: "User created",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      errors: parsed.error.issues,
    });
  }

  const { username, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    role: user.role,
  });
};
