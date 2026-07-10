import {useState} from "react";
import {Nav, SubNav} from "./HomePage.tsx";

export default function WeeklyView() {

    return <div className={"min-h-screen flex flex-col"}>
        <Nav/>
        <SubNav/>
        <main
            className={"bg-main flex-1 w-full flex flex-col gap-4 px-2  min-h-0"}>
            <ButtonToggle />
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
console.log(new Date().toDateString());
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

function TaskBox({ task }) {
    return (
        <article className="grid grid-cols-[auto_1fr_auto] bg-task-box mb-[5px] rounded overflow-hidden">

            <div className="flex justify-center pt-3 pb-3">
                <button className="w-9 h-9 rounded bg-checkmark border border-checkmark" />
            </div>

            <div className="flex flex-col text-text-dark text-left  pt-3 pb-3 h-[100%] relative">

                <span className="leading-4">{task.title}</span>
                <span className="text-xs opacity-50">{task.recurrence}</span>
                {task.timeleft && <span className="text-xs opacity-50 text-right absolute bottom-1 right-2.5">{task.timeleft}</span>}

            </div>

            <div className="flex flex-col justify-center items-center gap-1 h-full bg-coin-area">

                <span className="text-coin-value font-semibold text-sm leading-2">{task.value}</span>
            </div>

        </article>
    );
}






























