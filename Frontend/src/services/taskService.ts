import { apiFetch } from "../utils/api"

interface Task {
  user_id: string;
  task_id: string;
  title: string;
  description?: string;
  difficulty: string;
  created_on: Date;
  deadline: Date;
  type: string;
  frequency: number;
  timeleft?: string;
  status: string;
  value: number;
}

export async function getActiveTasks(): Promise<Task[]> {
  const response = await apiFetch(
    "/tasks/getActiveTasks",
    { method: "GET" })

  if (!response.ok)
    throw new Error(`Server error: ${response.status}`)

  return response.json() as Promise<Task[]>
}

export async function getCurrentDayTasks(date: Date): Promise<Task[]> {
  
  // start and end are created in local time
  const start = new Date(date); start.setHours(0, 0, 0, 0)
  const end = new Date(date); end.setHours(23, 59, 59, 999)

  // but sending them with toISOString turns them into UTC strings
  const response = await apiFetch(
    `/tasks/d?start=${start.toISOString()}&end=${end.toISOString()}`,
    { method: "GET" })

  if (!response.ok) 
    throw new Error(`Server error: ${response.status}`)

  return response.json() as Promise<Task[]>
}

export function filterTasks(tasks: Task[]) {
  const regulars = tasks.filter(task => task.frequency > 0)
  const uniques = tasks.filter(task => task.frequency == 0 && task.status != "pending")
  const pendings = tasks.filter(task => task.status === "pending")

  return { regulars, uniques, pendings }
}