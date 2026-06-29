export default function HomePage() {

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


    return <>
        <Nav />
        <SubNav />
        <main className="grid grid-cols-3 gap-3 p-8 pr-75 bg-tasks-view w-full h-[80vh]">
            <TaskSection header="Dailies" tasks={[dummyTasks[0], dummyTasks[1], dummyTasks[2]]} />
            <TaskSection header="To Dos" tasks={[dummyTasks[3], dummyTasks[4]]} />
            <TaskSection header="Pending" tasks={[dummyTasks[5], dummyTasks[6]]} />
        </main>
    </>
}

function Nav() {
    return <header>
        <nav className="bg-nav1">
            <ul className="flex m-0 p-0">
                <li><a href="#" title="Logo">Logo</a></li>
                <li><a href="#" title="Tasks">Tasks</a></li>
                <li><a href="#" title="Party">Party</a></li>
                <li><a href="#" title="Stats">Stats</a></li>
                <li><a href="#" title="Shop">Shop</a></li>
                <li><a href="#" title="About">About</a></li>
                <div className="flex ml-auto">
                    <li><a href="#" title="Gems">G1</a></li>
                    <li><a href="#" title="Coins">C327</a></li>
                    <li><a href="#" title="Profile">Logo</a></li>
                </div>
            </ul>
        </nav>
    </header>
}

function SubNav() {
    return <div className="h-24 flex items-center bg-sub-nav1">
        <h1 className="text-3xl m-0 px-6">LV 4</h1>
    </div>
}

function TaskSection({ header, tasks }) {

    return <section>
        <h2 className="text-left text-text-dark">{header}</h2>
        <div className="flex flex-col bg-tasks-section1 h-[60vh] p-4 rounded-[15px]">

            <div className="flex flex-col w-full">
                {tasks.map(task => <TaskBox key={task.task_id} task={task} />)}
            </div>
        </div>
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

function TaskBox({ task }) {
    return (
        <article className="grid grid-cols-[65px_1fr_65px] bg-task-box mb-[5px] rounded overflow-hidden">

            <div className="flex justify-center pt-3 pb-3">
                <button className="w-9 h-9 rounded bg-checkmark border border-checkmark" />
            </div>

            <div className="flex flex-col text-text-dark text-left  pt-3 pb-3 h-[100%] relative">

                <span className="leading-4">{task.title}</span>
                <span className="text-xs opacity-50">{task.recurrence}</span>
                {task.timeleft && <span className="text-xs opacity-50 text-right absolute bottom-1 right-2.5">{task.timeleft}</span>}

            </div>

            <div className="flex flex-col justify-center items-center gap-1 h-full bg-coin-area">
                <Coin />
                <span className="text-coin-value font-semibold text-sm leading-2">{task.value}</span>
            </div>

        </article>
    );
}

function Coin({ size = 26, outerColor = "#F5B731", innerColor = "#D4952A" }) {
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

export {Nav,SubNav}