import { Router } from "express";
import {
  deleteGoogleAuthToken,
  getGoogleAuthData,
  googleAuthCallback,
  initGoogleDriveAuth,
} from "../controller/googleAuthController";
import { verifyToken } from "../middleware/verifyToken";
import { requireFeature } from "../middleware/requireFeature";
import { authorize } from "../middleware/authorize";
import { PERMISSIONS } from "../rbac/permissions";

const router = Router();

router.get("/callback", googleAuthCallback);

router.get("/", initGoogleDriveAuth);

router.use(verifyToken, requireFeature("settings.backup"));

router.get("/data", getGoogleAuthData);

router.delete("/", authorize(PERMISSIONS.BACKUP_MANAGE), deleteGoogleAuthToken);

export default router;
