import type { Request, Response } from "express";
import prisma from "../db/prisma";
import { connect } from "node:http2";


let nextId = 1;

export async function createTask(req: Request, res: Response) {
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
        connect: { user_id: "49c1c38b-cba4-4980-9b8d-03451eaf70b2" },
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

export async function getAllTasks(req: Request, res: Response) {
  const user_id = req.params.user_id as string
  const tasks = await prisma.task.findMany({
    where: { user_id: user_id }
  })
  console.log(tasks)
  console.log(JSON.stringify(tasks))

  if (!tasks) return res.status(404).json({ error: "No tasks found." })
  res.status(200).json(tasks)
}

export async function getTask(req: Request, res: Response) {
  // console.log('Raw request params:', JSON.stringify(req.params, null, 2));
  const task_id = req.params.task_id as string
  const task = await prisma.task.findUnique({
    where: { task_id: task_id }
  })
  
  if (!task) return res.status(404).json({ error: "Task not found." })
  res.status(200).json(task)
}

// export async function deleteTask(req: Request, res: Response){
//   const task_id = req.params.task_id as string
//   const task = await prisma.task.delete({
//     where: { task_id: task_id }
//   })
//   res.status(200).json(task)
// }