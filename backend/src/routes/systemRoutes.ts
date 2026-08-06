import { Router } from "express";
import { resetDatabase } from "../controller/systemController";

const router = Router();

router.delete("/reset", resetDatabase);

export default router;
