import { apiFetch } from "../utils/api"


/* Updated Task interface */
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

// INACTIVE
export async function getDailyTasks(day: Date): Promise<Task[]> {
  const start = new Date(day); start.setHours(0, 0, 0, 0)
  const end = new Date(day); end.setHours(23, 59, 59, 999)

  const response = await apiFetch(`/tasks/getDailyTasks?start=${start.toISOString()}&end=${end.toISOString()}`,
    { method: "GET" })
  if (!response.ok) throw new Error(`Server error: ${response.status}`)
  return response.json()
}

export async function getActiveTasks(): Promise<Task[]> {
  const response = await apiFetch("/tasks/getActiveTasks",
    { method: "GET" })

  if (!response.ok)
    throw new Error(`Server error: ${response.status}`)

  return response.json() as Promise<Task[]>
}

/*
  Must update Task creation and Task interfaces

*/
export function filterTasks(tasks: Task[]) {
  const regulars = tasks.filter(task => task.frequency > 0)
  const uniques = tasks.filter(task => task.frequency == 0)
  const pendings = tasks.filter(task => task.status === "pending")

  return { regulars, uniques, pendings }
}