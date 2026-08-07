import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import TaskForm from "./TaskForm";
import { createPortal } from "react-dom";
import { deleteRequest, filterTasksByDay } from "../services/taskService";
import { useDateStore, useTaskStore } from "../assets/store";
import TaskUpdateForm from "./TaskUpdateForm";
import type { Task } from "../utils/types";
import { Pencil, Trash2 } from "lucide-react";
import { HiMiniXMark } from "react-icons/hi2";

export default function DailyView() {
    const day = useDateStore(d => d.currentDate)
    const rawTasks = useTaskStore(s => s.tasks)
    const tasks = filterTasksByDay(rawTasks, day)

    return (
        <main className="bg-backdrop w-full h-[80vh] grid grid-cols-[repeat(3,minmax(0,310px))] gap-2 p-5">
            <TaskSection header="Dailies" tasks={tasks.regulars} />
            <TaskSection header="To Dos" tasks={tasks.uniques} />
            <TaskSection header="Pending" tasks={tasks.pendings} />
        </main>
    );
}

function TaskSection({ header, tasks }: { header: string; tasks: Task[] }) {
    const isFormOpen = useTaskStore((state) => state.isFormOpen);

    return (
        <section className="">
            <div className="text-subnav flex justify-between mb-0.5">
                <h2>{header}</h2>
                <NewTaskButton header={header} />
            </div>
            <div className="bg-taskcard flex flex-col h-[60vh] p-1.5 rounded-sm overflow-auto">
                <div className="flex flex-col w-full gap-1">
                    {tasks.map((task) => (
                        <TaskBox key={task.task_id} task={task} />
                    ))}
                </div>
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
      className="bg-backdrop grid grid-cols-[60px_1fr_60px] gap-1 rounded overflow-hidden"
      onMouseEnter={() => setIsMenuOpen(true)}
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      <div className="flex justify-center py-3">
        <button className="bg-checkmark w-8 h-8 rounded border border-checkmark" />
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
        <span className="pt-3 text-sm leading-4">{task.title}</span>
        <span className="pb-3 text-xs opacity-50">{task.frequency}</span>
        <span className="text-xs opacity-50 text-right absolute bottom-1 right-2.5">
          {calculateTimeLeft(task)}
        </span>
      </div>
      <div className="bg-coin-area flex flex-col justify-center items-center gap-1 h-full">
        <Coin />
        <span className="text-coin-value font-semibold text-sm leading-2">
          {task.value}
        </span>
      </div>
    </article>
  );
}

function Coin({ size = 24, outerColor = "#F5B731", innerColor = "#D4952A" }) {
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
        <div className="absolute top-2 right-0 flex flex-col gap-2">
            <button
                className="hover:text-blue-500 z-60"
                onClick={() => {
                    openUpdateForm(task.task_id);
                }}
            >
                <Pencil size={15} />
            </button>
            <button
                className="hover:text-red-500 z-60"
                onClick={() => setIsAlertOpen(true)}
            >
                <Trash2 size={15} />
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
function calculateTimeLeft(task: Task) {
  const today = new Date();
  const taskDate = new Date(task.deadline);
  const timeLeft = taskDate.getTime() - today.getTime();
  let timeLeftString =
    timeLeft > 86400000 ? calculateDays(timeLeft) : calculateHours(timeLeft);
  if (timeLeft < 0) timeLeftString = `0 hours left`;
  return timeLeftString;
}

function calculateDays(timeLeft: number): string {
  return `${Math.round(timeLeft / 86400000)}d left`;
}

function calculateHours(timeLeft: number): string {
  return `${Math.round(timeLeft / 3600000)}h left`;
}

export {Coin}