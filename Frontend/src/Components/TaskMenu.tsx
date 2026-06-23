import type React from "react";
import { useState, useTransition } from "react";
import type { ChangeEvent } from "react";

function TaskMenu() {
  const [repeatable, setRepeatable] = useState("None");
  const [deadlineDate, setDeadlineDate] = useState(getDefaultDate());
  const [deadlineTime, setDeadlineTime] = useState("23:59");
  const [difficulty, setDifficulty] = useState("easy");



  function getDefaultDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function handleDateChange(event: ChangeEvent<HTMLInputElement>) {
    setDeadlineDate(event.target.value);
  }
  function handleTimeChange(event: ChangeEvent<HTMLInputElement>) {
    setDeadlineTime(event.target.value);
  }
    function handleRepeatingChange(event: ChangeEvent<HTMLSelectElement>) {
    setRepeatable(event.target.value);
  }

  function handleDifficultyChange(event: ChangeEvent<HTMLSelectElement>){
    setDifficulty(event.target.value);
  }

  return (
    <div className="task-menu-container">
      <div className="task-name-input">
        <label htmlFor="">Name: </label>
        <input type="text" placeholder="Enter the task name here..." />
      </div>

      <div className="task-repeatable-input">
        <label>Repeat every </label>
        <select
          name="repeatable"
          value={repeatable}
          onChange={handleRepeatingChange}
        >
          <option value="None">None</option>
          <option value="day">day</option>
          <option value="Week">Week</option>
          <option value="Month">Month</option>
        </select>
        {repeatable != "None" && (
          <div className="repeat-options">
            <p>Select how often this task will repeat.</p>
            <div className="repeat-options-row">
              <input type="number" />
              <p>{repeatable}s</p>
            </div>
          </div>
        )}
      </div>
      {repeatable === "None" && (
        <div className="task-deadline-input">
          <label>Deadline: </label>
          <input type="date" value={deadlineDate} onChange={handleDateChange} />
          <input type="time" value={deadlineTime} onChange={handleTimeChange} />
        </div>
      )}

      <div className="task-difficulty-input">
        <p>Select a difficulty</p>
         <select
          name="difficulty"
          value={difficulty}
          onChange={handleDifficultyChange}
        >
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>

      </div>
      <div className="is-private">
        <p>Set as private task</p>
        <input type="checkbox" name="private"/>
      </div>
      <button>Create Task</button>
    </div>
  );
}

export default TaskMenu;
