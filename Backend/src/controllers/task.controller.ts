import type { Request, Response } from "express";
import task from "../types/task.types";

const tasks: task[] = [];
let nextId = 1;

export function createTask(req: Request, res: Response) {
  const {
    name,
    note,
    difficulty,
    createdon,
    type,
    startDate,
    status,
    deadline,
    deadlineTime,
    frequency,
    weekday,
    isPrivate,
  } = req.body;

  const newTask: task = {
    id: nextId++,
    name,
    note,
    difficulty,
    createdon,
    type,
    startDate,
    status,
    deadline,
    deadlineTime,
    frequency,
    weekday,
    isPrivate,
    graceperiod: "7",
    streak: "7",
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
}
export function getAllTasks(req: Request, res: Response) {
  res.json(tasks);
}
