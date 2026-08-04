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

type DateStore = {
    currentDate: Date
    nextDay: () => void
    prevDay: () => void
}

/*  On using next instead of currentDate

    I creat a new object (next) instead of altering the existing currentDate, 
    because Zustand detects change by comparing obejct references. 

    Mutating an existing obj  => same obj ref  =>  doesn't trigger re-render
    Newly created object      => new obj ref   =>  triggers a re-render
*/
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