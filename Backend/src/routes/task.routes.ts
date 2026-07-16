import { Router } from "express";
import { createTask, getAllTasks, getTask,  } from "../controllers/task.controller";

const router = Router();

router.get("/", getAllTasks);
router.get("/:task_id", getTask);
router.post("/", createTask);

export default router;