import { Router } from "express";

import { createTask, getAllTasks, getTask,  } from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

// router.get("/", getAllTasks);
// router.get("/:task_id", getTask);
// router.post("/", createTask);
router.post("/createTask",createTask);

export default router;