import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getActivityLogs(req: Request, res: Response) {
  try {
    const activityLogs = await prisma.systemLogs.findMany();

    res.status(200).json(activityLogs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}
