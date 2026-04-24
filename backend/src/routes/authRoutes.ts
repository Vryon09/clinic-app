import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../controller/authController";
import { validateSchema } from "../middleware/validateSchema";
import { loginSchema, registerSchema } from "../schemas/authSchema";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/register", validateSchema(registerSchema), registerUser);
router.post("/login", validateSchema(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.get("/me", verifyToken, getMe);

export default router;
