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
} from "../controller/authController";
import { validateSchema } from "../middleware/validateSchema";
import {
  addUserSchema,
  loginSchema,
  registerSchema,
} from "../schemas/authSchema";
import { verifyToken } from "../middleware/verifyToken";
import { authorize } from "../middleware/authorize";

const router = Router();

router.post("/register", validateSchema(registerSchema), registerUser);

router.post(
  "/addUser",
  verifyToken,
  authorize("user:create"),
  validateSchema(addUserSchema),
  addUser,
);

router.post("/login", validateSchema(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.get("/me", verifyToken, getMe);
router.get("/status", getAuthStatus);
router.get("/users", verifyToken, getUsers);
router.get("/doctors", verifyToken, getDoctors);

router.patch("/update", verifyToken, authorize("user:update"), updateUser);

router.patch("/changeFullName", verifyToken, updateFullName);
router.patch("/changePassword", verifyToken, changePassword);
router.patch("/changeLicenseNum", verifyToken, changeLicenseNum);
router.patch(
  "/toggleStatus",
  verifyToken,
  authorize("user:toggleStatus"),
  toggleUserStatus,
);

export default router;
