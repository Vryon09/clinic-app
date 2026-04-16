import { Router } from "express";
import { backupToDrive } from "../controller/backupController";

const router = Router();

router.post("/drive", backupToDrive);

export default router;
