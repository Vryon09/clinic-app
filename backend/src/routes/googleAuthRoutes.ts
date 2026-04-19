import { Router } from "express";
import {
  deleteGoogleAuthToken,
  getGoogleAuthData,
  googleAuthCallback,
  initGoogleDriveAuth,
} from "../controller/googleAuthController";

const router = Router();

router.get("/", initGoogleDriveAuth);

router.get("/callback", googleAuthCallback);

router.get("/data", getGoogleAuthData);

router.delete("/", deleteGoogleAuthToken);

export default router;
