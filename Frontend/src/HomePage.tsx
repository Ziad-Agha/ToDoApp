export default function HomePage() {
    return <>
        <NavBar />
        <SubNavBar />
        <TaskView />
    </>
}

function NavBar() {
    return <nav>
        <ul>
            <li><a href="#" title="Logo">Logo</a></li>
            <li><a href="#" title="Tasks">Tasks</a></li>
            <li><a href="#" title="Party">Party</a></li>
            <li><a href="#" title="Stats">Stats</a></li>
            <li><a href="#" title="Shop">Shop</a></li>
            <li><a href="#" title="About">About</a></li>
            <div className='navend'>
                <li><a href="#" title="Gems">G1</a></li>
                <li><a href="#" title="Coins">C327</a></li>
                <li><a href="#" title="Profile">Logo</a></li>
            </div>
        </ul>
    </nav>
}

function SubNavBar() {
    return <div className="subnavbar">
        <h1>LV 4</h1>
    </div>
}

function TaskView() {
    return <>

    </>
}