export default function HomePage() {
    return <>
        <Nav />
        <SubNav />
        <main className="grid grid-cols-3 gap-6 p-10 bg-tasks-view w-full h-[70vh]">
            <TaskSection header="Dailies" />
            <TaskSection header="To Dos"  />
            <TaskSection header="Pending" />
        </main>
    </>
}

function Nav() {
    return <header>
        <nav className="bg-nav">
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
    return <div className="h-24 flex items-center bg-sub-nav">
        <h1 className="text-3xl m-0 px-6">LV 4</h1>
    </div>
}

function TaskSection({ header }) {
    const dummyTasks: Task[] = [
        {
            user_id: "u_001",
            task_id: "t_001",
            title: "Design quest layout",
            description: "Create wireframes for the main task board page",
            difficulty: "medium",
            type: "design",
            status: "incomplete",
            value: 50,
            created_on: new Date("2026-06-20"),
            deadline: new Date("2026-06-30"),
        },
        {
            user_id: "u_001",
            task_id: "t_002",
            title: "Set up PostgreSQL",
            difficulty: "hard",
            type: "backend",
            status: "complete",
            value: 75,
            created_on: new Date("2026-06-18"),
            deadline: new Date("2026-06-25"),
        },
        {
            user_id: "u_001",
            task_id: "t_003",
            title: "Write unit tests for auth module",
            description: "Cover login, registration and token refresh endpoints",
            difficulty: "medium",
            type: "backend",
            status: "incomplete",
            value: 40,
            created_on: new Date("2026-06-21"),
            deadline: new Date("2026-07-05"),
        },
        {
            user_id: "u_001",
            task_id: "t_004",
            title: "Fix navbar alignment on mobile",
            difficulty: "easy",
            type: "frontend",
            status: "incomplete",
            value: 20,
            created_on: new Date("2026-06-24"),
            deadline: new Date("2026-06-27"),
        },
        {
            user_id: "u_001",
            task_id: "t_005",
            title: "Research XP progression systems",
            description: "Look into how Habitica and Duolingo handle levelling curves",
            difficulty: "easy",
            type: "research",
            status: "complete",
            value: 15,
            created_on: new Date("2026-06-15"),
            deadline: new Date("2026-06-22"),
        },
    ];

    return <section className="flex flex-col items-center bg-tasks-section h-[50vh] p-4 rounded-[15px]">
        <h3 className="text-text-dark">{header}</h3>
        <div className="flex flex-col w-full">
            <TaskBox task={dummyTasks[0]} />
            <TaskBox task={dummyTasks[1]} />
            <TaskBox task={dummyTasks[2]} />
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
    status: string;
    value: number;
    created_on: Date;
    deadline: Date;
}

function TaskBox({ task }) {
    return (
        <article className="flex items-center min-w-[300px] min-h-[70px] rounded bg-task-box my-[5px]">
            <div className="flex-[0.2] flex justify-center">
                <button className="w-10 h-10 rounded bg-checkmark border border-checkmark" />
            </div>
            <div className="flex-[0.6] flex justify-center">
                <span className="text-text-dark">{task.title}</span>
            </div>
            <div className="flex-[0.2] flex justify-center">
                <span className="text-text-dark">{task.value}</span>
            </div>
        </article>
    );
};