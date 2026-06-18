import { Router } from "express";
import { addCase, getCases } from "../controller/caseController";

const router = Router();

router.get("/:patientId", getCases);

router.post("/:patientId", addCase);

export default router;
