import { Router } from "express";
import { getDashboardSummary } from "../controller/dashboardController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.use(verifyToken);
router.get("/summary", getDashboardSummary);

export default router;
