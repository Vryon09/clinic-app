import { Router } from "express";
import upload from "../config/multer";
import {
  deleteLabResult,
  getLabResults,
  uploadLabResult,
} from "../controller/labResultsController";

const router = Router();

router.get("/:patientId", getLabResults);
router.post("/upload", upload.single("file"), uploadLabResult);
router.delete("/:id", deleteLabResult);

export default router;
