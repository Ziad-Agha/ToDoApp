import { Router } from "express";
import { createTask, getActiveTasks, getDailyTasks  } from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/createTask",createTask);
router.get("/getDailyTasks", getDailyTasks)
router.get("/getActiveTasks", getActiveTasks)

export default router;