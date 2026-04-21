import { Router } from "express";
import upload from "../config/multer";
import {
  deleteLabResult,
  getLabResults,
  uploadLabResult,
} from "../controller/labResultsController";
import { validateSchema } from "../middleware/validateSchema";
import { uploadLabResultSchema } from "../schemas/labResultSchema";

const router = Router();

router.get("/:patientId", getLabResults);
router.post(
  "/upload",
  upload.single("file"),
  validateSchema(uploadLabResultSchema),
  uploadLabResult,
);
router.delete("/:id", deleteLabResult);

export default router;
