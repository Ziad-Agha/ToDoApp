import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import TaskForm from "./TaskForm";
import { createPortal } from "react-dom";
import { deleteRequest, filterTasksByCategory } from "../services/taskService";
import { useTaskStore } from "../assets/store";
import TaskUpdateForm from "./TaskUpdateForm";
import type { Task } from "../utils/types";
import { Pencil, Trash2 } from "lucide-react";
import { HiMiniXMark } from "react-icons/hi2";

export default function DailyView() {
  const rawTasks = useTaskStore((s) => s.tasks);
  const tasks = filterTasksByCategory(rawTasks);

  return (
    <main>
      <div className="grid grid-cols-[repeat(3,minmax(0,340px))] gap-6 p-7">
        <TaskSection header="Dailies" tasks={tasks.regulars} />
        <TaskSection header="To Dos" tasks={tasks.uniques} />
        <TaskSection header="Pending" tasks={tasks.pendings} />
      </div>{" "}
    </main>
  );
}

function TaskSection({ header, tasks }: { header: string; tasks: Task[] }) {
  const isFormOpen = useTaskStore((state) => state.isFormOpen);

  return (
    <section>
      <div className="text-subnav flex justify-between mb-1">
        <h2>{header}</h2>
        <NewTaskButton header={header} />
      </div>
      <div className="bg-taskcard border rounded-md flex flex-col gap-1 h-120 p-1 overflow-auto">
        {tasks.map((task) => (
          <TaskBox key={task.task_id} task={task} />
        ))}
      </div>
      {isFormOpen === header &&
        createPortal(
          <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/50">
            <TaskForm />
          </div>,
          document.body,
        )}
    </section>
  );
}

function TaskBox({ task }: { task: Task }) {
  const isUpdateFormOpen = useTaskStore((state) => state.isUpdateFormOpen);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <article
      className="bg-backdrop border grid grid-cols-[55px_1fr_70px] h-19 gap-0.5 pt-3 rounded overflow-hidden"
      onMouseEnter={() => setIsMenuOpen(true)}
    onMouseLeave={() => setIsMenuOpen(false)}
    >
      <div className="flex justify-center py-1">
        <button className="bg-checkmark w-5.5 h-5.5 rounded border" />
      </div>
      <div className="flex flex-col text-text-dark text-left h-full relative -ml-1">
        {isMenuOpen && <TaskMenu task={task} />}
        {isUpdateFormOpen === task.task_id &&
          createPortal(
            <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/50">
              <TaskUpdateForm
                task_id={task.task_id}
                title={task.title}
                note={task.note}
                isPrivate={task.isPrivate}
                onClose={() => setIsMenuOpen(false)}
              />
            </div>,
            document.body,
          )}
        <span className="text-sm leading-4">{task.title}</span>
        {task.note && <span className="text-xs opacity-50 w-30 truncate" >{task.note}</span>}
        {/* <span className="text-xs opacity-30">{task.frequency}</span> */}
      </div>
      <div className="flex flex-col pt-1 gap-1">
        <Coin value={task.value} />

        {/* <span className="text-xs opacity-50">
          {calculateTimeLeft(task)}
        </span> */}

      </div>
    </article>
  );
}

export function Coin({ size = 28, outerColor = "#da9d43", innerColor = "#f6ca79", value = 1 }) {
  const center = size / 2;
  const outerRadius = size / 2;
  const innerRadius = size * 0.35;

  return (<div className="flex items-center justify-center relative">
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={center} cy={center} r={outerRadius} fill={outerColor} />
      <circle cx={center} cy={center} r={innerRadius} fill={innerColor} />
    </svg>
    <span className="text-coin-value font-semibold text-xs absolute">
        {value}
    </span>
  </div>

  );
}

function NewTaskButton({ header }: { header: string }) {
  const openForm = useTaskStore((state) => state.openForm);

  return (
    <button
      className="p-0.5 text-subnav/70 hover:text-subnav"
      onClick={() => openForm(header)}
    >
      <FaPlus size={24} />
    </button>
  );
}

// returns a small menu for updating and deleting tasks
export function TaskMenu({ task }: { task: Task }) {
  const openUpdateForm = useTaskStore((state) => state.openUpdateForm);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  return (
    <div className="absolute top-1.5 right-0 flex flex-col gap-2 text-black/70">
      <button
        className="hover:text-blue-600/70 z-60"
        onClick={() => {
          openUpdateForm(task.task_id);
        }}
      >
        <Pencil size={17} />
      </button>
      <button
        className="hover:text-red-800/70 z-60"
        onClick={() => setIsAlertOpen(true)}
      >
        <Trash2 size={17} />
      </button>
      {isAlertOpen && (
        <DeleteAlert task={task} onClose={() => setIsAlertOpen(false)} />
      )}
    </div>
  );
}

function DeleteAlert({ task, onClose }: { task: Task; onClose: () => void }) {
  const deleteTask = useTaskStore((state) => state.deleteTask);

  return createPortal(
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/50">
      <div className="bg-backdrop rounded-xl p-8 flex flex-col gap-6 w-80 shadow-lg relative">
        <button
          className="text-text-dark/50 absolute top-3 right-3 hover:text-red-500 transition-colors"
          onClick={onClose}
        >
          <HiMiniXMark size={22} />
        </button>

        <p className="text-text-dark text-lg font-semibold text-center">
          Are you sure you want to delete "{task.title}"?
        </p>

        <div className="flex flex-row gap-3 justify-center">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded transition-colors"
            onClick={() => {
              deleteRequest(task.task_id);
              deleteTask(task.task_id);
            }}
          >
            Yes
          </button>
          <button
            className="bg-nav hover:bg-subnav text-backdrop font-medium py-2 px-6 rounded transition-colors"
            onClick={() => onClose()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// function calculateTimeLeft(task: Task) {
//   let timeLeftString;
//   if (!task.isRegular) {
//     const tonight = new Date();
//     tonight.setHours(0, 0, 0, 0);
//     return calculateHours(86400000 + tonight.getTime() - new Date().getTime());
//   }

//   const today = new Date();
//   const taskDate = new Date(task.deadline);
//   const timeLeft = taskDate.getTime() - today.getTime();
//   timeLeftString =
//     timeLeft > 86400000 ? calculateDays(timeLeft) : calculateHours(timeLeft);
//   if (timeLeft < 0) timeLeftString = `0h left`;
//   return timeLeftString;
// }

// function calculateDays(timeLeft: number): string {
//   return `${Math.round(timeLeft / 86400000)}d left`;
// }

// function calculateHours(timeLeft: number): string {
//   return `${Math.round(timeLeft / 3600000)}h left`;
// }
