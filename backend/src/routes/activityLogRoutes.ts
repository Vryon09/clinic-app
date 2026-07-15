import { Router } from "express";
import { getActivityLogs } from "../controller/activityLogController";

const router = Router();

router.get("/", getActivityLogs);

export default router;
