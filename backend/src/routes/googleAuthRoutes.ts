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

router.get("/", initGoogleDriveAuth);

router.use(verifyToken);

router.get("/data", getGoogleAuthData);

router.delete("/", deleteGoogleAuthToken);

export default router;
