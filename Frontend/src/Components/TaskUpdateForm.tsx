import { useRef } from "react";
import { updateRequest } from "../services/taskService";
import { useTaskStore } from "../assets/store";
import { HiMiniXMark } from "react-icons/hi2";
export default function TaskUpdateForm({
  task_id,
  title,
  note,
  isPrivate,
  onClose,
}: {
  task_id: string;
  title: string;
  note?: string;
  isPrivate: boolean;
  onClose: () => void;
}) {
  function close() {
    closeUpdateForm();
    onClose();
  }
  const titleRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const isPrivateRef = useRef<HTMLInputElement>(null);
  const closeUpdateForm = useTaskStore((state) => state.closeUpdateForm);
  const updateTask = useTaskStore((state) => state.updateTask);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    title = titleRef.current!.value;
    note = noteRef.current!.value;
    isPrivate = isPrivateRef.current!.checked;
    try {
      const updatedTask = await updateRequest(task_id, {
        title,
        note,
        isPrivate,
      });
      updateTask(updatedTask);
      console.log("Task updated:", updatedTask);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
    close();
  }
  return (
    <div className="task-update-form bg-backdrop rounded-xl w-85 p-5 flex flex-col text-text-dark">
      <button
        className="text-nav/50 absolute self-end hover:text-nav"
        onClick={close}
      >
        <HiMiniXMark size={28} />
      </button>
      <form
        className="flex flex-col gap-5 p-5 self-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-row gap-2">
          <label className="text-2xl" >Title: </label>
          <input
            className="border-b w-full text-2xl focus:outline-none"
            type="text"
            placeholder="Update Title"
            defaultValue={title}
            ref={titleRef}
          />
        </div>
        <div className="flex flex-row gap-2">
          <label className="text-lg">Note: </label>
          <textarea
            className="border-b w-full text-lg focus:outline-none"
            placeholder="Update Note"
            defaultValue={note}
            rows={1}
            ref={noteRef}
          />
        </div>

        <div className="is-private flex gap-2">
          <input
            type="checkbox"
            name="private"
            defaultChecked={isPrivate}
            ref={isPrivateRef}
          />
          <p>Private</p>
        </div>
        <button
          className="bg-nav text-backdrop w-[33%] p-2 rounded self-end text-lg hover:bg-subnav"
          type="submit"
        >
          Apply
        </button>
      </form>
    </div>
  );
}
