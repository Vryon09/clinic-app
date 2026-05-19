import { Router } from "express";
import {
  deleteGoogleAuthToken,
  getGoogleAuthData,
  googleAuthCallback,
  initGoogleDriveAuth,
} from "../controller/googleAuthController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.get("/callback", googleAuthCallback);

router.use(verifyToken);

router.get("/", initGoogleDriveAuth);

router.get("/data", getGoogleAuthData);

router.delete("/", deleteGoogleAuthToken);

export default router;
