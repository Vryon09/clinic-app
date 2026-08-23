import { Router } from "express";
import {
  deleteLabResult,
  getLabResults,
  uploadLabResult,
} from "../controller/labResultsController";
import { validateSchema } from "../middleware/validateSchema";
import { uploadLabResultSchema } from "../schemas/labResultSchema";
import { verifyToken } from "../middleware/verifyToken";
import { uploadLabResults } from "../middleware/multer";

const router = Router();

router.use(verifyToken);

router.get("/:patientId", getLabResults);
router.post(
  "/upload",
  uploadLabResults.single("file"),
  validateSchema(uploadLabResultSchema),
  uploadLabResult,
);
router.delete("/:id", deleteLabResult);

export default router;
