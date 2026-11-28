import { Router } from "express";
import { getDashboardSummary } from "../controller/dashboardController";
import { verifyToken } from "../middleware/verifyToken";
import { requireFeature } from "../middleware/requireFeature";

const router = Router();

router.use(verifyToken, requireFeature("dashboard"));
router.get("/summary", getDashboardSummary);

export default router;
