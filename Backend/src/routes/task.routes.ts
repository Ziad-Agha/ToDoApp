import { Router } from "express";

import { createTask, deleteTask, getActiveTasks, updateTask, getCurrentDayTasks   } from "../controllers/task.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/createTask", createTask);
router.put("/updateTask/:task_id", updateTask);
router.get("/getActiveTasks", getActiveTasks)
router.delete("/deleteTask/:task_id", deleteTask)
router.get("/d", getCurrentDayTasks)

export default router;
