import apiFetch from "../utils/api"

interface Task {
    user_id: string;
    task_id: string;
    title: string;
    description?: string; // or details or note
    difficulty: string;
    type: string;
    recurrence?: string;
    timeleft?: string;
    status: string;
    value: number;
    created_on: Date;
    deadline: Date;
}

export async function getDailyTasks(): Promise<Task[]> {
  const response = await apiFetch("/tasks/getDailyTasks", { method: "GET" })
  if (!response.ok) throw new Error(`Server error: ${response.status}`)
  return response.json()
}