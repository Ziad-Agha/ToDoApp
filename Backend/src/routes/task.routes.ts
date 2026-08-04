import { Router } from "express";
import { createTask, getCurrentDayTasks  } from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/d", getCurrentDayTasks)
router.post("/createTask",createTask);

export default router;