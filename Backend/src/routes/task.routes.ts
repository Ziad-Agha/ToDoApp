import { Router } from "express";
import { createTask, getAllTasks } from "../controllers/task.controller";

const router = Router();

router.get("/", getAllTasks);
router.post("/",createTask);

export default router;