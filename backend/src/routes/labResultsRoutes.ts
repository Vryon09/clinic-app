import { Router } from "express";
import upload from "../config/multer";
import { uploadLabResult } from "../controller/labResultsController";

const router = Router();

router.post("/upload", upload.single("file"), uploadLabResult);

export default router;
