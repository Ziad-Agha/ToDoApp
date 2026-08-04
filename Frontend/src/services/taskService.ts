import { apiFetch } from "../utils/api";
import type { Task } from "../utils/types";

interface TaskUpdate {
  title: string;
  note?: string;
  isPrivate: boolean;
}

export async function getActiveTasks(): Promise<Task[]> {
  const response = await apiFetch("/tasks/getActiveTasks", { method: "GET" });

  if (!response.ok) throw new Error(`Server error: ${response.status}`);

  return response.json() as Promise<Task[]>;
}

export async function getCurrentDayTasks(date: Date): Promise<Task[]> {
  // start and end are created in local time
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  // but sending them with toISOString turns them into UTC strings
  const response = await apiFetch(
    `/tasks/d?start=${start.toISOString()}&end=${end.toISOString()}`,
    { method: "GET", cache: "no-store" },
  );

  if (!response.ok) throw new Error(`Server error: ${response.status}`);

  return response.json() as Promise<Task[]>;
}

export function filterTasks(tasks: Task[]) {
  const regulars = tasks.filter((task) => task.frequency > 0);
  const uniques = tasks.filter(
    (task) => task.frequency == 0 && task.status != "pending",
  );
  const pendings = tasks.filter((task) => task.status === "pending");

  return { regulars, uniques, pendings };
}
export async function updateRequest(
  task_id: string,
  { title, note, isPrivate }: TaskUpdate,
): Promise<Task> {
  const response = await apiFetch(`/tasks/updateTask/${task_id}`, {
    method: "PUT",
    body: JSON.stringify({ title, note, isPrivate }),
  });

  if (!response.ok) throw new Error(`Server error: ${response.status}`);

  return response.json() as Promise<Task>;
}

export async function deleteRequest(task_id: string) {
  const response = await apiFetch(`/tasks/deleteTask/${task_id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);

  return response.json() as Promise<Task>;
}
