import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";
import { UserRequest } from "../types/express";

export async function getMe(req: UserRequest, res: Response) {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function registerUser(req: Request, res: Response) {
  try {
    const { username, password, role } = req.body;

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

    const token = generateToken(user.id, res);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          username,
        },
        token,
      },
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
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

    const token = generateToken(user.id, res);

    res.status(201).json({
      message: "User created",
      data: {
        user: {
          id: user.id,
          username,
        },
        token,
      },
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res
      .status(200)
      .json({ success: true, message: "User logged out successfully." });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}
