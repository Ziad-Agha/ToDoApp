import {useState} from "react";
import {Coin} from "./Components/DailyView.tsx"
import type { Task } from "../utils/types";

// import {SubNav, Nav} from "./HomePage.tsx";

export default function WeeklyView() {

    const dummyTasks: Task[] = [
        {
            user_id: "u_001",
            task_id: "t_001",
            title: "Feed cats ",
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
            timeleft: '12h left',
            status: "complete",
            value: 15,
            created_on: new Date("2026-06-15"),
            deadline: new Date("2026-06-22"),
        },
    ];

    const weekDates = getWeekDates();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return <div className={"min-h-screen flex flex-col"}>
        {/*<Nav/>*/}
        {/*<SubNav/>*/}
        <main
            className={"bg-main flex-1 w-full flex flex-col gap-4 px-2  min-h-0"}>
            {/*<ButtonToggle /> to be used later*/}
            <div className={"flex flex-1 min-h-0 "}>
                {days.map((day, i) => (
                    <TaskSection
                        key={day}
                        header={day}
                        date={weekDates[i]}
                        tasks={[dummyTasks[0], dummyTasks[1], dummyTasks[2]]} // tasks filtered by date
                    />
                ))}
            </div>
        </main>
    </div>;
}

// to be used later
type ViewType = "weekly" | "monthly";
function ButtonToggle() {
    const [selected, setSelected] = useState<ViewType>("weekly");

    return(
        <div className={"flex justify-center gap-20 "}>
            <GlowButton
                label={"Weekly"}
                isSelected={selected == "weekly"}
                onClick={() => setSelected("weekly")}
            />
            <GlowButton
                label={"Monthly"}
                isSelected={selected == "monthly"}
                onClick={() => setSelected("monthly")} />
        </div>
    );
}

// to be used later
function GlowButton({label, isSelected, onClick}:
                    {
                        label: string,
                        isSelected: boolean,
                        onClick: () => void
                    }) {
    return (
        <button
            onClick={onClick}
            className={`
                h-[50px] w-[120px] m-[5px]
                flex justify-center items-center
                cursor-pointer
                text-base rounded-[5px] font-mono
                bg-[linear-gradient(145deg,#2e2d2d,#212121)]
                transition-all duration-500
        ${isSelected
                ? "shadow-[1px_1px_13px_#20232e,-1px_-1px_13px_#545b78] text-[#d6d6d6]"
                : "shadow-[-1px_-5px_15px_#41465b,5px_5px_15px_#41465b,inset_5px_5px_10px_#212121,inset_-5px_-5px_10px_#212121] text-[rgb(161,161,161)]"
            }
      `}
        >
            {label}
        </button>
    );
}

function getWeekDates(): Date[] {
    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay()); // rewind to Sunday

    return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(sunday);
        day.setDate(sunday.getDate() + i);
        return day;
    });
}

function TaskSection({ header, tasks, date }: { header: string; tasks: string[]; date: Date }) {

    const isToday = new Date().toDateString() === date.toDateString();

    return (
        <section className="flex flex-col flex-1 ">
            <h2 className={`text-center ${isToday ? "text-red-500" : "text-text-dark"}`}>
                {header}
                <span className="ml-1 opacity-70">{date.getDate()}</span>
            </h2>
            <div className="flex flex-col bg-tasks-section1 flex-1 p-2 rounded-[15px] border-2 border-sub-nav1 ">
                <div className="flex flex-col w-full">

                </div>
                {tasks.map(task => <TaskBox key={task.task_id} task={task} />)}
            </div>
        </section>
    );
}


function Checkbox() {
    const [checked, setChecked] = useState(false);

    return (
        <div
            onClick={() => setChecked(!checked)} style={{ cursor: "pointer" }}>
            <svg width="22" height="22" viewBox="0 0 22 22">
                <rect
                    x="1"
                    y="1"
                    width="20"
                    height="20"
                    rx="4"
                    stroke={checked ? "#1e2235" : "#d1d6ee"}
                    strokeWidth={checked ? 1 : 1}
                    fill="#fff"
                    style={{
                        transition: "stroke 0.2s, stroke-width 0.2s",
                    }}
                />
                <path
                    d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13
             c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
                    stroke="#1e2235"
                    strokeWidth="1.5"
                    fill="none"
                    style={{
                        strokeDasharray: 93,
                        strokeDashoffset: checked ? 16 : 93, // this is the :checked replacement
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        transition: "stroke-dashoffset 0.4s",
                    }}
                />
            </svg>
        </div>
    );
}

function TaskBox({ task }:{ task: Task }) {
    return (
        <article className=" grid grid-cols-[auto_1fr_auto] bg-task-box mb-1.25 rounded-[5px] overflow-hidden border-2">

            <div className="flex flex-col justify-center items-center gap-1 h-full bg-coin-area px-1.5">
                <Checkbox/>
            </div>

            <div className="flex flex-col text-text-dark pt-2 pb-2 h-[100%] relative">
                {task.timeleft && <span className="text-xs opacity-50 bottom-1 right-2.5">{task.timeleft}</span>}
                <span className="leading-4">{task.title}</span>
                <span className="text-xs opacity-50">{task.recurrence}</span>
            </div>

            <div className="flex flex-col justify-center items-center gap-1 h-full bg-coin-area px-1.5">
                <Coin/>
                <span className="text-coin-value font-semibold text-sm leading-2">{task.value}</span>
            </div>

        </article>
    );
}

