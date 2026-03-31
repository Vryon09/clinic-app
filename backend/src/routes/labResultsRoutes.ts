import { Router } from "express";
import upload from "../config/multer";
import {
  getLabResults,
  uploadLabResult,
} from "../controller/labResultsController";

const router = Router();

router.get("/:patientId", getLabResults);
router.post("/upload", upload.single("file"), uploadLabResult);

export default router;
