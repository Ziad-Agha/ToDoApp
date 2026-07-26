import type { Request, Response } from "express";
import prisma from "../db/prisma";
import { connect } from "node:http2";

// const tasks: task[] = [];
let nextId = 1;

export async function createTask(req: Request, res: Response) {
  const user_id = req.user!.user_id;
  // console.log('Raw request body:', JSON.stringify(req.body, null, 2));
  // console.log('Content-Type:', req.headers['content-type']);
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
export async function updateTask(req: Request, res: Response) {
  try {
    const { user_id } = req.user!;
    const task_id = req.params.task_id as string;

    const updatedTask = await prisma.task.update({
      where: { task_id, user_id },
      data: req.body,
    });
    res.json(updatedTask);
  } catch (error) {
    console.error("Full error:", JSON.stringify(error, null, 2));
    res.status(500).json({ error });
  }
}
// export function getAllTasks(req: Request, res: Response) {
//   res.json(tasks);}
