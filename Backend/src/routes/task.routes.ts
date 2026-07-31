import { Router } from "express";
import { createTask, getActiveTasks, getCurrentDayTasks  } from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/d", getCurrentDayTasks)
router.get("/getActiveTasks", getActiveTasks)
router.post("/createTask",createTask);

export default router;