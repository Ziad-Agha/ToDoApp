import { apiFetch } from "../utils/api";
import type { newTask, Task, TaskUpdate } from "../utils/types";

export async function getAllTasks(): Promise<Task[]> {
  const response = await apiFetch("/tasks/getAllTasks", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Server error: ${response.status}`);

  return response.json() as Promise<Task[]>;
}

export async function createTask(task: newTask) {
  const response = await apiFetch("/tasks/createTask", {
    method: "POST",
    body: JSON.stringify(task),
  });

  if (!response.ok)
    throw new Error(`Server responded with status ${response.status}`);

  return response.json();
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

export function filterTasksByCategory(tasks: Task[]) {
  const regulars = tasks.filter((task) => task.frequency > 0);
  const uniques = tasks.filter(
    (task) => task.frequency == 0 && task.status == "active",
  );
  const pendings = tasks.filter((task) => task.status === "pending");

  return { regulars, uniques, pendings };
}

export function filterTasksByDay(tasks: Task[], day: Date) {
  const dayTasks = tasks.filter(
    (t) => t.deadline && isSameDay(t.deadline, day),
  );

  return filterTasksByCategory(dayTasks);
}

export function isSameDay(deadline: string | Date, targetDate: Date): boolean {
  const d = new Date(deadline);
  return (
    d.getFullYear() === targetDate.getFullYear() &&
    d.getMonth() === targetDate.getMonth() &&
    d.getDate() === targetDate.getDate()
  );
}
