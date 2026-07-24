import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import TaskForm from "./TaskForm";
import { createPortal } from "react-dom";
import { getDailyTasks, getActiveTasks } from "../services/taskService";
import apiFetch from "../utils/api";

export default function DailyView() {
    const dummyTasks: Task[] = [
        {
            user_id: "u_001",
            task_id: "t_001",
            title: "Feed cats",
            description: "Create wireframes for the main task board page",
            difficulty: "medium",
            type: "design",
            recurrence: "Everyday",
            timeleft: "8h left",
            status: "incomplete",
            value: 50,
            created_on: new Date("2026-06-20"),
            deadline: new Date("2026-06-30"),
        },
        {
            user_id: "u_001",
            task_id: "t_002",
            title: "Workout",
            difficulty: "hard",
            type: "backend",
            recurrence: "Every 2 days",
            timeleft: "8h left",
            status: "complete",
            value: 75,
            created_on: new Date("2026-06-18"),
            deadline: new Date("2026-06-25"),
        },
        {
            user_id: "u_001",
            task_id: "t_003",
            title: "Jumu'a",
            description: "Cover login, registration and token refresh endpoints",
            difficulty: "medium",
            type: "backend",
            recurrence: "Every Friday",
            timeleft: "2h left",
            status: "incomplete",
            value: 40,
            created_on: new Date("2026-06-21"),
            deadline: new Date("2026-07-05"),
        },
        {
            user_id: "u_001",
            task_id: "t_004",
            title: "Quick shopping from Maxi",
            difficulty: "easy",
            type: "frontend",
            recurrence: "Every 2 days",
            timeleft: '9h left',
            status: "incomplete",
            value: 20,
            created_on: new Date("2026-06-24"),
            deadline: new Date("2026-06-27"),
        },
        {
            user_id: "u_001",
            task_id: "t_005",
            title: "Apply to Service Info Montreal",
            description: "Look into how Habitica and Duolingo handle levelling curves",
            difficulty: "easy",
            type: "research",
            recurrence: "Every Friday",
            timeleft: '12h left',
            status: "complete",
            value: 15,
            created_on: new Date("2026-06-15"),
            deadline: new Date("2026-06-22"),
        },
        {
            user_id: "u_001",
            task_id: "t_006",
            title: "Recharge Opus",
            description: "Look into how Habitica and Duolingo handle levelling curves",
            difficulty: "easy",
            type: "research",
            recurrence: "Every Month",
            // timeleft: '12h left',
            status: "complete",
            value: 15,
            created_on: new Date("2026-06-15"),
            deadline: new Date("2026-06-22"),
        },
        {
            user_id: "u_001",
            task_id: "t_007",
            title: "Buy cat litter",
            description: "Look into how Habitica and Duolingo handle levelling curves",
            difficulty: "easy",
            type: "research",
            recurrence: "Every Saturday",
            // timeleft: '12h left',
            status: "complete",
            value: 15,
            created_on: new Date("2026-06-15"),
            deadline: new Date("2026-06-22"),
        },
    ];

    const [dailyTasks, setDailyTasks] = useState<Task[]>([])
    const [day, setDay] = useState<Date>(new Date("2026-07-21"))

    const fetchTasks = async () => {
        try {
            // TESTING GETACTIVETASKS
            const tasks = await getActiveTasks()
            setDailyTasks(tasks)
        } catch (err) {
            console.error("Failed to fetch daily tasks:", err)
        }
    }
    useEffect(() => {
        fetchTasks()
    }, [])

    return <main className="bg-backdrop w-full h-[80vh] grid grid-cols-[repeat(3,minmax(0,310px))] gap-2 p-5">
        <TaskSection header="Dailies" tasks={dailyTasks} />
        <TaskSection header="To Dos" tasks={[dummyTasks[3], dummyTasks[4]]} />
        <TaskSection header="Pending" tasks={[dummyTasks[5], dummyTasks[6]]} />
    </main>
}

function TaskSection({ header, tasks }: { header: string, tasks: Task[] }) {
    const [isFormOpen, setIsFormOpen] = useState(false)
    return <section>
        <div className="text-subnav flex justify-between mb-0.5">
            <h2>{header}</h2>
            <NewTaskButton
                header={header}
                onClick={() => setIsFormOpen(true)}
            />
        </div>
        <div className="bg-taskcard flex flex-col h-[60vh] p-1.5 rounded-sm">
            <div className="flex flex-col w-full gap-1">
                {tasks.map(task => <TaskBox key={task.task_id} task={task} />)}
            </div>
        </div>
        {isFormOpen && createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <TaskForm onClose={() => setIsFormOpen(false)} />
            </div>,
            document.body
        )}
    </section>
}

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

function TaskBox({ task }: { task: Task }) {
    return (
        <article className="bg-backdrop grid grid-cols-[60px_1fr_60px] gap-1 rounded overflow-hidden">
            <div className="flex justify-center py-3">
                <button className="bg-checkmark w-8 h-8 rounded border border-checkmark" />
            </div>
            <div className="flex flex-col text-text-dark text-left py-3 h-full relative -ml-1">
                <span className="text-sm leading-4">{task.title}</span>
                <span className="text-xs opacity-50">{task.recurrence}</span>
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

function NewTaskButton({ header, onClick }: { header: string; onClick: () => void }) {
    // if (header == "Pending") return;
    return <button className="p-0.5 text-subnav/70 hover:text-subnav" onClick={onClick}>
        <FaPlus size={24} />
    </button>
}