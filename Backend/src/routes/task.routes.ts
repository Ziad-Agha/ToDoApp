import { Router } from "express";
import { createTask, updateTask } from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/createTask", createTask);
router.put("/updateTask/:task_id", updateTask);

export default router;
