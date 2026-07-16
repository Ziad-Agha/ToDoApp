import { Router } from "express";
import { createTask,  } from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/createTask",createTask);

export default router;