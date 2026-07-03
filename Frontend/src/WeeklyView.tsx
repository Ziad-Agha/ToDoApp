import {useState} from "react";
import {Nav, SubNav} from "./HomePage.tsx";

export default function WeeklyView() {

    return <div className={"min-h-screen flex flex-col"}>
        <Nav/>
        <SubNav/>
        <main
            className={"bg-main flex-1 w-full flex flex-col gap-4 px-2  min-h-0"}>
            <ButtonToggle />
            <div className={"flex flex-1 min-h-0"}>
                <TaskSection header="Sunday" tasks={[]} />
                <TaskSection header="Monday" tasks={[]} />
                <TaskSection header="Tuesday" tasks={[]} />
                <TaskSection header="Wednesday" tasks={[]} />
                <TaskSection header="Thursday" tasks={[]} />
                <TaskSection header="Friday" tasks={[]} />
                <TaskSection header="Saturday" tasks={[]} />
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

function TaskSection({ header, tasks }: { header: string; tasks: string[] }) {
    return (
        <section className="flex flex-col flex-1 ">
            <h2 className="text-center text-text-dark">{header}</h2>
            <div className="flex flex-col bg-tasks-section1 flex-1 p-4 rounded-[15px] border-2 border-sub-nav1">
                <div className="flex flex-col w-full">

                </div>
                {tasks.map(task => <TaskBox key={task.task_id} task={task} />)}
            </div>
        </section>
    );
}

function TaskBox() {

}






























