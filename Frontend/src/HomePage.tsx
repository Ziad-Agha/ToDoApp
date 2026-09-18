import { useDateStore, useTaskStore } from "./assets/store";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { getAllTasks } from "./services/taskService";
import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

export default function HomePage() {
  const location = useLocation();
  const isWeekly = location.pathname.includes("weekly");
  // Fetch raw tasks
  const setRawtasks = useTaskStore((s) => s.setTasks);
  const fetchTasks = async () => {
    console.log("fetchTasks run");
    setRawtasks([]);
    try {
      const response = await getAllTasks();
      setRawtasks(response);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="bg-backdrop flex flex-col ">
      <Nav />
      <div className="bg-subnav flex full h-20 items-center p-3">
        <DateNav />

      </div>
      <Outlet />
    </div>
  );
}

function Nav() {
  return (
    <header>
      <nav className="bg-nav">
        <ul className="flex m-0 p-0">
          <li>
            <a href="#" title="Logo">
              Logo
            </a>
          </li>
          <li>
            <a href="#" title="Tasks">
              Tasks
            </a>
          </li>
          <li>
            <a href="#" title="Party">
              Party
            </a>
          </li>
          <li>
            <a href="#" title="Stats">
              Stats
            </a>
          </li>
          <li>
            <a href="#" title="Shop">
              Shop
            </a>
          </li>
          <li>
            <a href="#" title="About">
              About
            </a>
          </li>
          <div className="flex ml-auto">
            <li>
              <a href="#" title="Gems">
                G1
              </a>
            </li>
            <li>
              <a href="#" title="Coins">
                C327
              </a>
            </li>
            <li>
              <a href="#" title="Profile">
                Logo
              </a>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
}

function SubNav() {
  // Currently basic, but later will be expanded
  return (
    <div className="bg-subnav h-24 flex items-center">
      <h1 className="text-3xl m-0 px-6">LV 4</h1>
    </div>
  );
}

function DateNav() {
  const { currentDate, nextDay, prevDay } = useDateStore();
  const displayDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(currentDate);
  return (
    <>
      <div className="bg-nav p-2 rounded-4xl flex items-center text-nav-text gap-1">
        <button className="hover:bg-subnav rounded-3xl px-4 py-2">
          Today
        </button>
        <button className="hover:bg-subnav rounded-3xl px-1" onClick={prevDay}>
          <MdNavigateBefore size={35} />
        </button>

        <button className="hover:bg-subnav rounded-3xl px-1" onClick={nextDay}>
          <MdNavigateNext size={35} />
        </button>

        <span className="w-30 pr-3">{displayDate}</span>
      </div>
      <nav className="bg-nav rounded-3xl p-1 flex justify-center self-center">
        <NavLink
          to="daily"
          className="rounded-l-3xl"
        >
          Daily
        </NavLink>
        <NavLink
          to="weekly"
          className="rounded-r-3xl"
        >
          Weekly
        </NavLink>
      </nav>
    </>
  );
}
