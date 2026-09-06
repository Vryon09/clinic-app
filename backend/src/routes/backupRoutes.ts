import { Router } from "express";
import {
  backupToDrive,
  importBackup,
  restoreBackup,
} from "../controller/backupController";
import { verifyToken } from "../middleware/verifyToken";
import { uploadRestore } from "../middleware/multer";

const router = Router();

router.post("/drive", verifyToken, backupToDrive);
router.post("/restore", uploadRestore.single("backup"), restoreBackup);
router.post("/import", uploadRestore.single("backup"), importBackup);

export default router;
