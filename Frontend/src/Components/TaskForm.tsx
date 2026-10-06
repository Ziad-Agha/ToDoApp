import { useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { useTaskStore } from "../assets/store";
import { CustomSelect } from "./ui/CustomSelect";
import { createTask } from "../services/taskService";
import type { newTask } from "../utils/types";

export default function TaskForm() {
  const task = useTaskForm();
  const closeForm = useTaskStore((state) => state.closeForm);

  return (
    <div className="bg-backdrop border rounded-md rounded-br-4xl rounded-tl-4xl w-98 p-7 flex flex-col text-text-dark">
      <button
        className="text-nav/50 absolute self-end hover:text-nav"
        onClick={closeForm}
      >
        <HiMiniXMark size={32} />
      </button>

      <div className="flex flex-col gap-3 m-5 self-center">
        <input
          className="border-b w-full text-2xl focus:outline-none"
          type="text"
          value={task.title}
          placeholder="Add Title"
          onChange={(e) => task.setTitle(e.target.value)}
        />
        <textarea
          className="border-b text-xl focus:outline-none"
          name="note"
          value={task.note}
          rows={1}
          placeholder="Add Note"
          onChange={(e) => task.setNote(e.target.value)}
        />

        {/* Change to horizontal selection */}
        <div className="task-difficulty-input text-lg flex gap-2 items-center">
          <label>Difficulty:</label>
          <CustomSelect
            value={task.difficulty}
            onChange={task.setDifficulty}
            options={[
              { value: "easy", label: "easy" },
              { value: "medium", label: "medium" },
              { value: "hard", label: "hard" },
            ]}
          />
        </div>

        <div className="text-lg flex gap-2 items-center ">
          <input
            type="checkbox"
            name="regular"
            checked={task.isRegular}
            onChange={() => task.setIsRegular(!task.isRegular)}
          />
          <p>Regular</p>
        </div>

        <div className="text-lg flex gap-2">
          <input
            type="checkbox"
            name="private"
            checked={task.isPrivate}
            onChange={() => task.setIsPrivate(!task.isPrivate)}
          />
          <p>Private</p>
        </div>

        {task.errors.length > 0 && (
          <div className="form-errors">
            {task.errors.map((error, index) => (
              <p key={index} style={{ color: "red" }}>
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      <button
        className="bg-nav text-backdrop w-[33%] p-2 mb-1 mr-1 rounded-br-xl self-end text-lg hover:bg-subnav"
        onClick={() => task.handleSubmit()}
      >
        Create
      </button>
    </div>
  );
}

const defaultTime = new Date();
defaultTime.setHours(23, 59, 0, 0);

//  State hooks for form variables and handle functions
function useTaskForm() {

  const addTask = useTaskStore((state) => state.addTask);
  const closeForm = useTaskStore((state) => state.closeForm);

  const [title, setTitle] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [difficulty, setDifficulty] = useState("easy");
  const [isRegular, setIsRegular] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  function getTaskValue(difficulty: string): number {
    let value = 15
    if (difficulty === "medium") value = 20
    if (difficulty === "hard") value = 25
    return value
  }

  async function handleSubmit() {

    const errors: string[] = [];
    if (!title.trim()) errors.push("Title is required.");

    if (errors.length > 0) {
      setErrors(errors);
      return;
    } else setErrors([]);

    // Wrap data in an object
    const newTask: newTask = {
      title: title,
      note: note,
      difficulty: difficulty,
      created_on: new Date(),
      status: "active",
      isRegular: isRegular,
      isPrivate: isPrivate,
      value: getTaskValue(difficulty),
    };

    // Create object in database
    try {
      const createdTask = await createTask(newTask);
      addTask(createdTask); // to state manager
      console.log("Task created:", createdTask);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
    closeForm();
  }

  return {
    title,
    setTitle,
    note,
    setNote,
    difficulty,
    setDifficulty,
    isRegular,
    setIsRegular,
    isPrivate,
    setIsPrivate,
    errors,
    handleSubmit,
  };
}