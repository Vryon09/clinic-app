import { Router } from "express";
import { getRecordMedications } from "../controller/recordMedicationController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.get("/:recordId", verifyToken, getRecordMedications);

export default router;
