import type { Request, Response } from "express";
import prisma from "../db/prisma";
import { connect } from "node:http2";


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
}
export async function updateTask(req: Request, res: Response) {
  try {
    const { user_id } = req.user!;
    const task_id = req.params.task_id as string;
    const {title, note, isPrivate} = req.body;

    const updatedTask = await prisma.task.update({
      where: { task_id, user_id },
      data: {title, note, isPrivate},
    });
    res.json(updatedTask);
  } catch (error) {
    console.error("Full error:", JSON.stringify(error, null, 2));
    res.status(500).json({ error });
  }
}
// export function getAllTasks(req: Request, res: Response) {
//   res.json(tasks);}

export async function getActiveTasks(req: Request, res: Response) {
  const tasks = await prisma.task.findMany({
    where: { 
      user_id: req.user!.user_id, 
      status: { in: ["active", "pending"] } }
  })
  if (!tasks) return res.status(200).json({ error: "No tasks found." })
  res.status(200).json(tasks)
}

// TODO: Get active tasks within a certain window, not all user tasks
export async function getDailyTasks(req: Request, res: Response) {
  const start = new Date(req.query.start as string)
  const  end  = new Date(req.query.end as string)

  const tasks = await prisma.task.findMany({
    where: {
      user_id: req.user!.user_id,
      deadline: { gte: start, lte: end },
      status: { in: ["active", "pending"] },
    }
  })

  if (!tasks) return res.status(200).json({ error: "No tasks found." })
  res.status(200).json(tasks)
}
