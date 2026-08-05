import { apiFetch } from "../utils/api";
import type { Task } from "../utils/types";

interface TaskUpdate {
  title: string;
  note?: string;
  isPrivate: boolean;
}


export async function getAllTasks(): Promise<Task[]> {
  const response = await apiFetch(
    "/tasks/allTasks", { method: "GET", cache: "no-store" });

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


export async function getCurrentMonthTasks(d: Date): Promise<Task[]> {

  // Set start to the first of the current month 
  const start = new Date(d.getFullYear(), d.getMonth(), 1)
  // Set end to the end of the current month 
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0)

  const response = await apiFetch(
    `/tasks/d?start=${start.toISOString()}&end=${end.toISOString()}`,
    { method: "GET", cache: "no-store" },
  )

  if (!response.ok) throw new Error(`Server error: ${response.status}`);

  return response.json() as Promise<Task[]>;
}


export async function updateRequest(task_id: string,
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
  const uniques = tasks.filter((task) => task.frequency == 0 && task.status != "pending");
  const pendings = tasks.filter((task) => task.status === "pending");

  return { regulars, uniques, pendings };
}

export function filterTasksByDay(tasks: Task[], day: Date) {
  const dayTasks = tasks.filter(
    (t) => t.deadline && isSameDay(t.deadline, day)
  )
  return filterTasksByCategory(dayTasks)
}

function isSameDay(deadline: Date, targetDate: Date): boolean {
  const d = new Date(deadline)
  return (
    d.getFullYear() === targetDate.getFullYear() &&
    d.getMonth() === targetDate.getMonth() &&
    d.getDate() === targetDate.getDate() 
  )
}