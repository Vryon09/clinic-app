import { Router } from "express";
import {
  addCase,
  archiveCase,
  getArchivedCases,
  getCases,
  restoreCase,
  updateCase,
} from "../controller/caseController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.use(verifyToken);

router.get("/archived", getArchivedCases);
router.get("/:patientId", getCases);

router.post("/:patientId", addCase);

router.patch("/:id/archive", archiveCase);
router.patch("/:id/restore", restoreCase);

router.patch("/:patientId/:caseId", updateCase);

export default router;
