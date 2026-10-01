import { useTaskStore } from "./assets/store";
import { getAllTasks } from "./services/taskService";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function HomePage() {
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
    <div className="flex flex-col ">
      <Outlet />
    </div>
  );
}
