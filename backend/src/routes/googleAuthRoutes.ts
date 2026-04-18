import { Router } from "express";
import {
  deleteGoogleAuthToken,
  getGoogleAuthStatus,
  googleAuthCallback,
  initGoogleDriveAuth,
} from "../controller/googleAuthController";

const router = Router();

router.get("/", initGoogleDriveAuth);

router.get("/callback", googleAuthCallback);

router.get("/status", getGoogleAuthStatus);

router.delete("/", deleteGoogleAuthToken);

export default router;
