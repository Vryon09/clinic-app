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
} from "../controller/authController";
import { validateSchema } from "../middleware/validateSchema";
import { loginSchema, registerSchema } from "../schemas/authSchema";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/register", validateSchema(registerSchema), registerUser);
router.post("/login", validateSchema(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.get("/me", verifyToken, getMe);
router.get("/status", getAuthStatus);
router.get("/users", verifyToken, getUsers);
router.patch("/update", updateUser);
router.patch("/toggleStatus", toggleUserStatus);

export default router;
