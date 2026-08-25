import { Router } from "express";
import { uploadSignatures } from "../middleware/multer";
import {
  getSignature,
  uploadSignature,
} from "../controller/signatureController";
import { verifyToken } from "../middleware/verifyToken";
import { isAlreadySigned } from "../middleware/isAlreadySigned";

const router = Router();

router.use(verifyToken);

router.get("/", getSignature);
router.post(
  "/upload",
  isAlreadySigned(),
  uploadSignatures.single("file"),
  uploadSignature,
);

export default router;
