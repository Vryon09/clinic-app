import { Router } from "express";
import { addCase, getCases } from "../controller/caseController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.use(verifyToken);

router.get("/:patientId", getCases);

router.post("/:patientId", addCase);

export default router;
