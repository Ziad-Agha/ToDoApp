import DailyView from "./Components/DailyView"

export default function HomePage() {
    return <>
        <Nav />
        {/* <SubNav /> */}
        <DailyView />
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
    // Currently basic, but later will be expanded
    return <div className="bg-subnav h-24 flex items-center">
        <h1 className="text-3xl m-0 px-6">LV 4</h1>
    </div>
}

