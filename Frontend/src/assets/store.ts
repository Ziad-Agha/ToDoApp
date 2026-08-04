import { create } from "zustand";
import type { Task } from "../utils/types";

type DateStore = {
  currentDate: Date
  nextDay: () => void
  prevDay: () => void
}

type TaskStore = {
  isFormOpen: string | null;
  openForm: (header: string) => void;
  closeForm: () => void;

  isUpdateFormOpen: string | null;
  openUpdateForm: (task_id: string) => void;
  closeUpdateForm: () => void;

  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (task_id: string | null) => void;
};

export const useDateStore = create<DateStore>((set) => ({
  currentDate: new Date(),
  nextDay: () => set((date) => {
    const next = new Date(date.currentDate)
    next.setDate(next.getDate() + 1)
    return { currentDate: next }
  }),
  prevDay: () => set((date) => {
    const prev = new Date(date.currentDate)
    prev.setDate(prev.getDate() - 1)
    return { currentDate: prev }
  })
}))

export const useTaskStore = create<TaskStore>((set) => ({
  isFormOpen: null,
  openForm: (header) => set({ isFormOpen: header }),
  closeForm: () => set({ isFormOpen: null }),

  isUpdateFormOpen: null,
  openUpdateForm: (task_id) => set({ isUpdateFormOpen: task_id }),
  closeUpdateForm: () => set({ isUpdateFormOpen: null }),

  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (newTask: Task) =>
    set((state) => ({
      tasks: [...state.tasks, newTask],
    })),
  deleteTask: (task_id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.task_id != task_id),
    })),
  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.task_id === updatedTask.task_id ? updatedTask : t,
      ),
    })),
}));

/*  
  On using next instead of currentDate

  the creation of a new object (next) instead of altering the existing currentDate, 
  is necessary because Zustand detects change by comparing obejct references. 

  Mutating an existing obj  => same obj ref  =>  doesn't trigger re-render
  Newly created object      => new obj ref   =>  triggers a re-render
*/

