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
} from "../controller/authController";
import { validateSchema } from "../middleware/validateSchema";
import {
  addUserSchema,
  loginSchema,
  registerSchema,
} from "../schemas/authSchema";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/register", validateSchema(registerSchema), registerUser);
router.post("/addUser", verifyToken, validateSchema(addUserSchema), addUser);
router.post("/login", validateSchema(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.get("/me", verifyToken, getMe);
router.get("/status", getAuthStatus);
router.get("/users", verifyToken, getUsers);
router.get("/doctors", verifyToken, getDoctors);
router.patch("/update", verifyToken, updateUser);
router.patch("/changePassword", verifyToken, changePassword);
router.patch("/toggleStatus", verifyToken, toggleUserStatus);

export default router;
