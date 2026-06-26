export default function HomePage() {
    return <>
        <Nav />
        <SubNav />
        <main className="tasks-view">
            <TaskSection header="Dailies" type="repeating-tasks-section" />
            <TaskSection header="To Dos" type="normal-tasks-section" />
            <TaskSection header="Pending" type="pending-tasks-section" />
        </main>
    </>
}

function Nav() {
    return <header>
        <nav>
            <ul>
                <li><a href="#" title="Logo">Logo</a></li>
                <li><a href="#" title="Tasks">Tasks</a></li>
                <li><a href="#" title="Party">Party</a></li>
                <li><a href="#" title="Stats">Stats</a></li>
                <li><a href="#" title="Shop">Shop</a></li>
                <li><a href="#" title="About">About</a></li>
                <div className='nav-end'>
                    <li><a href="#" title="Gems">G1</a></li>
                    <li><a href="#" title="Coins">C327</a></li>
                    <li><a href="#" title="Profile">Logo</a></li>
                </div>
            </ul>
        </nav>
    </header>
}

function SubNav() {
    return <div className="sub-nav">
        <h1>LV 4</h1>
    </div>
}

function TaskSection({ header, type }) {
    return <section className={`tasks-section ${type}`}>
        <h3>{header}</h3>
        <div className="tasks-list">
            <Task />
        </div>
    </section>
}

function Task(){
    return <div className="task">

    </div>
}

export {Nav,SubNav}