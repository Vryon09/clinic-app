import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  getAuthStatus,
  getUsers,
  updateUser,
  toggleUserStatus,
  changePassword,
  addUser,
  getDoctors,
  changeLicenseNum,
  updateFullName,
  updateUsername,
} from "../controller/authController";
import { validateSchema } from "../middleware/validateSchema";
import {
  addUserSchema,
  loginSchema,
  registerSchema,
  updateFullNameSchema,
  updateUsernameSchema,
} from "../schemas/authSchema";
import { verifyToken } from "../middleware/verifyToken";
import { requireSuperAdmin } from "../middleware/authorize";

const router = Router();

router.post("/register", validateSchema(registerSchema), registerUser);

router.post(
  "/addUser",
  verifyToken,
  requireSuperAdmin,
  validateSchema(addUserSchema),
  addUser,
);

router.post("/login", validateSchema(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.get("/me", verifyToken, getMe);
router.get("/status", getAuthStatus);
router.get("/users", verifyToken, requireSuperAdmin, getUsers);
router.get("/doctors", verifyToken, getDoctors);

router.patch("/update", verifyToken, requireSuperAdmin, updateUser);

router.patch(
  "/changeUsername",
  verifyToken,
  validateSchema(updateUsernameSchema),
  updateUsername,
);
router.patch(
  "/changeFullName",
  verifyToken,
  validateSchema(updateFullNameSchema),
  updateFullName,
);
router.patch("/changePassword", verifyToken, changePassword);
router.patch("/changeLicenseNum", verifyToken, changeLicenseNum);
router.patch(
  "/toggleStatus",
  verifyToken,
  requireSuperAdmin,
  toggleUserStatus,
);

export default router;
