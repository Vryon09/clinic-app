import { Router } from "express";
import { resetDatabase } from "../controller/systemController";
import { verifyToken } from "../middleware/verifyToken";
import { authorize } from "../middleware/authorize";
import { PERMISSIONS } from "../rbac/permissions";

const router = Router();

router.delete("/reset", verifyToken, authorize(PERMISSIONS.SYSTEM_RESET), resetDatabase);

export default router;
