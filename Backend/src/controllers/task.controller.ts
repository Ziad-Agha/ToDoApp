import type { Request, Response } from "express";
import prisma from "../db/prisma";
import { connect } from "node:http2";

// const tasks: task[] = [];
let nextId = 1;

export async function createTask(req: Request, res: Response) {
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
  // tasks.push(newTask);
}
// export function getAllTasks(req: Request, res: Response) {
//   res.json(tasks);}

export async function getAllTasks(req: Request, res: Response) {
  const tasks = await prisma.task.findMany({
    where: { user_id: "49c1c38b-cba4-4980-9b8d-03451eaf70b2" }
  })
  console.log(tasks)
  console.log(JSON.stringify(tasks))
  res.status(200).json(tasks);
}

export async function getTask(req: Request, res: Response) {
  const task_id = req.params.task_id as string;

  console.log('Raw request params:', JSON.stringify(req.params, null, 2));


  const task = await prisma.task.findUnique({
    where: { task_id: task_id }
  })
  
  res.status(200).json(task)
}
