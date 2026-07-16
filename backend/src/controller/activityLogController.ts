import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getActivityLogs(req: Request, res: Response) {
  try {
    const limit = Math.max(1, parseInt(req.query.limit as string)) || 10;
    const page = Math.max(1, parseInt(req.query.page as string)) || 1;
    const skip = (page - 1) * limit;

    const [activityLogs, total] = await prisma.$transaction([
      prisma.systemLogs.findMany({
        include: { user: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.systemLogs.count(),
    ]);

    res.status(200).json({
      success: true,
      data: activityLogs,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}
