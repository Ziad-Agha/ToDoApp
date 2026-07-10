import { Router } from "express";
import { createTask,  } from "../controllers/task.controller";

const router = Router();

// router.get("/", getAllTasks);
router.post("/",createTask);

export default router;