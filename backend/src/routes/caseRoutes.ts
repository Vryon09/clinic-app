import { Router } from "express";
import { getCases } from "../controller/caseController";

const router = Router();

router.get("/:patientId", getCases);

export default router;
