import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  getAuthStatus,
  getUsers,
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
router.get("/users", getUsers);

export default router;
