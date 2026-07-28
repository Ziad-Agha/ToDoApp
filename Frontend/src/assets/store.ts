import { create } from "zustand"

type TaskFormStore = {
    refresh: number
    taskCreated: () => void

    isFormOpen: boolean
    openForm: () => void
    closeForm: () => void
}

export const useTaskFormStore = create<TaskFormStore>((set) => ({
    refresh: 0,
    taskCreated: () => set((state) => ({ refresh: state.refresh + 1 })),

    isFormOpen: false,
    openForm: () => set({ isFormOpen: true }),
    closeForm: () => set({ isFormOpen: false }),

}))