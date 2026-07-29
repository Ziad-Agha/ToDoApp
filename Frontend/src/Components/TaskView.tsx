import { useRef } from "react";
import { updateRequest } from "../services/taskService";

export default function TaskView({
  task_id,
  title,
  note,
  isPrivate,
}: {
  task_id: string;
  title: string;
  note: string;
  isPrivate: boolean;
}) {
  const titleRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);
  const isPrivateRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    title = titleRef.current!.value;
    note = noteRef.current!.value;
    isPrivate = isPrivateRef.current!.checked;

    const updatedTask = await updateRequest(task_id, {
      title,
      note,
      isPrivate,
    });
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Update Title"
          value={title}
          ref={titleRef}
        />
        <input
          type="text"
          placeholder="Update Note"
          value={note}
          ref={noteRef}
        />
        <input
          type="checkbox"
          name="private"
          checked={isPrivate}
          ref={isPrivateRef}
        />
        <p>Private</p>
      </form>
      ;
    </div>
  );
}
