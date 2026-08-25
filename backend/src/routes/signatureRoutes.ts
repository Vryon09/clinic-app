import { Router } from "express";
import { uploadSignatures } from "../middleware/multer";
import {
  deleteSignature,
  getSignature,
  uploadSignature,
} from "../controller/signatureController";
import { verifyToken } from "../middleware/verifyToken";
import { isAlreadySigned } from "../middleware/isAlreadySigned";

const router = Router();

router.use(verifyToken);

router.get("/:userId", getSignature);
router.post(
  "/upload",
  isAlreadySigned(),
  uploadSignatures.single("file"),
  uploadSignature,
);
router.delete("/", deleteSignature);

export default router;
