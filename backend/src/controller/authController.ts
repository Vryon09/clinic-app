import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";
import { UserRequest } from "../types/express";

export async function getAuthStatus(req: Request, res: Response) {
  try {
    const userCount = await prisma.user.count();

    res.status(200).json({ isSetupComplete: !!userCount });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getUsers(req: UserRequest, res: Response) {
  try {
    const userId = req.userId;

    const users = await prisma.user.findMany({
      where: { AND: [{ role: { not: "ADMIN" } }, { id: { not: userId } }] },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        licenseNum: true,
      },
    });

    if (!users) {
      return res.status(400).json({ message: "Users not found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getDoctors(req: UserRequest, res: Response) {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: "DOCTOR", isActive: true },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        cases: { include: { records: true } },
        licenseNum: true,
        createdRecords: true,
        createdAt: true,
      },
    });

    if (!doctors) {
      return res.status(400).json({ message: "Doctors not found" });
    }

    res.status(200).json(doctors);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getMe(req: UserRequest, res: Response) {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, role: true, isActive: true },
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
        licenseNum: "",
      },
    });

    const token = generateToken(user.id, user.role, res);

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

export async function addUser(req: Request, res: Response) {
  try {
    const { username, password, role, licenseNum } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    const existingLicenseNum = await prisma.user.findFirst({
      where: { licenseNum },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (existingLicenseNum && licenseNum !== "" && role === "DOCTOR") {
      return res.status(400).json({ message: "License Number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
        licenseNum,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          username,
        },
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

    if (!user.isActive) {
      return res.status(401).json({ message: "User is disabled" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id, user.role, res);

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
    res.status(500).json({ message: err.message });
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
    res.status(500).json({ message: err.message });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { id, username, role, licenseNum } = req.body;

    const isUsernameUsed = await prisma.user.findUnique({
      where: { username },
    });

    const isLicenseNumUsed = await prisma.user.findFirst({
      where: { licenseNum },
    });

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (isUsernameUsed && isUsernameUsed.id !== id) {
      return res.status(400).json({ message: "Username already used" });
    }

    if (isLicenseNumUsed) {
      return res.status(400).json({ message: "License Number already used" });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { username, role, licenseNum },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function changePassword(req: UserRequest, res: Response) {
  try {
    const { oldPassword, newPassword } = req.body;

    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    const isNewPasswordMatch = await bcrypt.compare(newPassword, user.password);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (!isOldPasswordMatch) {
      res.status(400).json({ message: "Wrong password" });
      return;
    }

    if (isNewPasswordMatch) {
      res
        .status(400)
        .json({ message: "New password is the same as the old password" });

      return;
    }

    const updatedPasswordUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    if (!updatedPasswordUser) {
      res.status(400).json({ message: "Update Password failed" });
      return;
    }

    res.status(200).json({ message: "Update Password successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function toggleUserStatus(req: Request, res: Response) {
  try {
    const { id } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      res.status(400).json({ message: "User not found." });
      return;
    }

    const toggledUser = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    if (!toggledUser) {
      res.status(400).json({ message: "Toggling user status failed." });
      return;
    }

    res.status(200).json({ message: "User toggled the status successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}
