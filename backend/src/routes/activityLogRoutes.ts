import { Router } from "express";
import { getActivityLogs } from "../controller/activityLogController";
import { verifyToken } from "../middleware/verifyToken";
import { requireFeature } from "../middleware/requireFeature";
import { authorize } from "../middleware/authorize";
import { PERMISSIONS } from "../rbac/permissions";

const router = Router();

router.get(
  "/",
  verifyToken,
  requireFeature("settings.activityLog"),
  authorize(PERMISSIONS.ACTIVITY_LOG_VIEW),
  getActivityLogs,
);

export default router;
