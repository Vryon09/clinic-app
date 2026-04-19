import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({ message: "User created", user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

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
