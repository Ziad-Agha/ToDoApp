import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import TaskForm from "./TaskForm";
import { createPortal } from "react-dom";
import { filterTasks, getActiveTasks } from "../services/taskService";
import { useTaskFormStore } from "../assets/store";

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

interface FilteredTasks {
    regulars: Task[]
    uniques: Task[]
    pendings: Task[]
}

export default function DailyView() {

    const refresh = useTaskFormStore(state => state.refresh)
    const [tasks, setTasks] = useState<FilteredTasks>({
        regulars: [],
        uniques: [],
        pendings: [],
    })

    const fetchTasks = async () => {
        const activeTasks = await getActiveTasks()
        const filteredTasks = filterTasks(activeTasks)
        setTasks(filteredTasks)
    }

    useEffect(() => {
        fetchTasks()
    }, [refresh])

    return <main className="bg-backdrop w-full h-[80vh] grid grid-cols-[repeat(3,minmax(0,310px))] gap-2 p-5">
        <TaskSection header="Dailies" tasks={tasks.regulars} />
        <TaskSection header="To Dos" tasks={tasks.uniques} />
        <TaskSection header="Pending" tasks={tasks.pendings} />
    </main>
}

function TaskSection({ header, tasks }: { header: string, tasks: Task[]}) {
    const isFormOpen = useTaskFormStore(state => state.isFormOpen)
    
    return <section className="">
        <div className="text-subnav flex justify-between mb-0.5">
            <h2>{header}</h2>
            <NewTaskButton header={header} />
        </div>
        <div className="bg-taskcard flex flex-col h-[60vh] p-1.5 rounded-sm overflow-auto">
            <div className="flex flex-col w-full gap-1">
                {tasks.map(task => <TaskBox key={task.task_id} task={task} />)}
            </div>
        </div>
        {isFormOpen && createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <TaskForm/>
            </div>,
            document.body
        )}
    </section>
}

function TaskBox({ task }: { task: Task }) {
    return (
        <article className="bg-backdrop grid grid-cols-[60px_1fr_60px] gap-1 rounded overflow-hidden">
            <div className="flex justify-center py-3">
                <button className="bg-checkmark w-8 h-8 rounded border border-checkmark" />
            </div>
            <div className="flex flex-col text-text-dark text-left py-3 h-full relative -ml-1">
                <span className="text-sm leading-4">{task.title}</span>
                <span className="text-xs opacity-50">{task.frequency}</span>
                {task.timeleft && <span className="text-xs opacity-50 text-right absolute bottom-1 right-2.5">{task.timeleft}</span>}
            </div>
            <div className="bg-coin-area flex flex-col justify-center items-center gap-1 h-full">
                <Coin />
                <span className="text-coin-value font-semibold text-sm leading-2">{task.value}</span>
            </div>
        </article>
    );
}

function Coin({ size = 24, outerColor = "#F5B731", innerColor = "#D4952A" }) {
    const center = size / 2;
    const outerRadius = size / 2;
    const innerRadius = size * 0.35;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={center} cy={center} r={outerRadius} fill={outerColor} />
            <circle cx={center} cy={center} r={innerRadius} fill={innerColor} />
        </svg>
    );
}

function NewTaskButton({ header }: { header: string }) {
    // if (header == "Pending") return;

    const openForm = useTaskFormStore(state => state.openForm)

    return <button className="p-0.5 text-subnav/70 hover:text-subnav" onClick={openForm}>
        <FaPlus size={24} />
    </button>
}