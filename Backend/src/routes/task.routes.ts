import { Router } from "express";

import { createTask, deleteTask, updateTask, getAllTasks   } from "../controllers/task.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/getAllTasks", getAllTasks)
router.post("/createTask", createTask);
router.put("/updateTask/:task_id", updateTask);
router.delete("/deleteTask/:task_id", deleteTask)

export default router;
