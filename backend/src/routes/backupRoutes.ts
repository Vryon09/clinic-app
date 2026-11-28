import { Router } from "express";
import {
  backupToDrive,
  importBackup,
  restoreBackup,
} from "../controller/backupController";
import { verifyToken } from "../middleware/verifyToken";
import { uploadRestore } from "../middleware/multer";
import { requireFeature } from "../middleware/requireFeature";
import { authorize } from "../middleware/authorize";
import { PERMISSIONS } from "../rbac/permissions";

const router = Router();

router.post(
  "/drive",
  verifyToken,
  requireFeature("settings.backup"),
  authorize(PERMISSIONS.BACKUP_MANAGE),
  backupToDrive,
);
router.post("/restore", uploadRestore.single("backup"), restoreBackup);
router.post("/import", uploadRestore.single("backup"), importBackup);

export default router;
