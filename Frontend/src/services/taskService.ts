import { apiFetch } from "../utils/api"

interface Task {
  user_id: string;
  task_id: string;
  title: string;
  description?: string;
  difficulty: string;
  type: string;
  recurrence?: string;
  timeleft?: string;
  status: string;
  value: number;
  created_on: Date;
  deadline: Date;
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
  if (!response.ok) throw new Error(`Server error: ${response.status}`)
  return response.json() as Promise<Task[]>
}