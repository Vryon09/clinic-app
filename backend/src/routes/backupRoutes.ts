import { Router } from "express";
import { backupToDrive } from "../controller/backupController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/drive", verifyToken, backupToDrive);

export default router;
