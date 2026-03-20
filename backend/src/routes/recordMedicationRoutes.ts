import { Router } from "express";
import { getRecordMedications } from "../controller/recordMedicationController";

const router = Router();

router.get("/:recordId", getRecordMedications);

export default router;
