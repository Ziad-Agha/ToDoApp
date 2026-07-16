import type { Request, Response } from "express";
import prisma from "../db/prisma";
import { connect } from "node:http2";

// const tasks: task[] = [];
let nextId = 1;

export async function createTask(req: Request, res: Response) {
  const user_id = req.user!.user_id;
  const {
    title,
    note,
    difficulty,
    created_on,
    type,
    start_date,
    status,
    deadline,
    frequency,
    weekday,
    isPrivate,
  } = req.body;

  const newTask = await prisma.task.create({
    data: {
      user: {
        connect: { user_id },
      },
      title,
      note,
      difficulty,
      created_on,
      type,
      start_date,
      status,
      deadline,
      frequency,
      weekday,
      isPrivate,
    },
  });

  res.status(201).json(newTask);
  // tasks.push(newTask);
}
// export function getAllTasks(req: Request, res: Response) {
//   res.json(tasks);}
