// import type React from "react";
import { useState } from "react";
import type { ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TaskMenu() {
  const [title, setTitle] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [type, setType] = useState("day");
  const [deadlineDate, setDeadlineDate] = useState(getDefaultDate(new Date()));
  const [deadlineTime, setDeadlineTime] = useState("23:59");
  const [difficulty, setDifficulty] = useState("easy");
  const [repeatable, setRepeatable] = useState(false);
  const [weekly, setWeekly] = useState("Sunday");
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const weekRange = selectedWeek ? getWeekRange(selectedWeek) : null;
  const monthRange = selectedMonth ? getMonthRange(selectedMonth) : null;

  function getDate(type: string) {
    if (!repeatable) {
      if (type === "day") {
        return { start: deadlineDate, end: deadlineDate };
      } else if (type === "week" && weekRange) {
        return {
          start: getDefaultDate(weekRange?.start),
          end: getDefaultDate(weekRange.end),
        };
      } else if (type === "month" && monthRange) {
        return {
          start: getDefaultDate(monthRange?.start),
          end: getDefaultDate(monthRange.end),
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  type WeekRange = {
    start: Date; // Monday
    end: Date; // Sunday
  };

  type MonthRange = {
    start: Date;
    end: Date;
  };

  function getMonthRange(date: Date): MonthRange {
    const year = date.getFullYear();
    const month = date.getMonth();
    const start = new Date(year, month, 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(year, month + 1, 0); // day 0 of next month = last day of this month
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  function getWeekRange(date: Date): WeekRange {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, ...
    const diffToMonday = (day === 0 ? -6 : 1) - day;

    const start = new Date(date);
    start.setDate(date.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return {
      start,
      end,
    };
  }

  function handleRepetition(type: string) {
    if (type === "day") {
      return (
        <div>
          <p>Repeating every</p>
          <input
            type="number"
            min="1"
            step="1"
            value={repeatInterval}
            onChange={handleIntervalChange}
            onKeyDown={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
          />
          <p>days</p>
        </div>
      );
    } else if (type === "week") {
      return (
        <div>
          <p>Repeat every</p>
          <input
            type="number"
            min="1"
            step="1"
            value={repeatInterval}
            onChange={handleIntervalChange}
            onKeyDown={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
          />
          <p>weeks</p>
          <label>Date</label>
          <select name="weekly-task" value={weekly} onChange={handleWeekChange}>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
      );
    } else if (type === "month") {
      return (
        <div>
          <p>Repeat every</p>
          <input
            type="number"
            min="1"
            step="1"
            value={repeatInterval}
            onChange={handleIntervalChange}
            onKeyDown={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
          />
          <p>months</p>
        </div>
      );
    }
  }

  function handleDeadline(type: string) {
    if (type === "day") {
      return (
        <div className="task-deadline-input">

          <div className="flex gap-2 items-center">
            <label>Date:</label>
            <input
              type="date"
              value={deadlineDate}
              className="task-element"
              onChange={handleDateChange} />
            <input
              type="time"
              value={deadlineTime}
              className="task-element"
              onChange={handleTimeChange} />
          </div>
        </div>
      );
    } else if (type === "week") {
      return (
        <DatePicker
          selected={weekRange?.end}
          onChange={(date: Date | null) => setSelectedWeek(date)}
          showWeekPicker
          calendarStartDay={1}
          placeholderText="Select a week"
        />
      );
    } else if (type === "month") {
      return (
        <DatePicker
          selected={monthRange?.end}
          onChange={(date: Date | null) => setSelectedMonth(date)}
          showMonthYearPicker
          dateFormat="MMMM yyyy"
          placeholderText="Select a month"
        />
      );
    }
  }

  function getDefaultDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }
  function handleTextAreaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setNote(event.target.value);
  }
  function handleDateChange(event: ChangeEvent<HTMLInputElement>) {
    setDeadlineDate(event.target.value);
  }
  function handleTimeChange(event: ChangeEvent<HTMLInputElement>) {
    setDeadlineTime(event.target.value);
  }
  function handleTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    setType(event.target.value);
  }
  function handleIntervalChange(event: ChangeEvent<HTMLInputElement>) {
    setRepeatInterval(Number(event.target.value));
  }

  function handleDifficultyChange(event: ChangeEvent<HTMLSelectElement>) {
    setDifficulty(event.target.value);
  }
  function handleRepeatableChange() {
    setRepeatable(!repeatable);
  }
  function handleWeekChange(event: ChangeEvent<HTMLSelectElement>) {
    setWeekly(event.target.value);
  }
  function handlePrivacyChange() {
    setIsPrivate(!isPrivate);
  }

  async function handleSubmit() {
    const newTask = {
      name: title,
      note: note,
      difficulty: difficulty,
      createdon: getDefaultDate(new Date()),
      type: type,
      startDate: getDate(type)?.start,
      status: repeatable ? "" : "active",
      deadline: getDate(type)?.end,
      deadlineTime: deadlineTime,
      frequency: String(repeatInterval),
      weekday: weekly,
      isPrivate: isPrivate,
    };

    try {
      const response = await fetch("http://localhost:3001/api/tasks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const createdTask = await response.json();
      console.log("Task created:", createdTask);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }
  ///////////////////////////////////////////////////////////////////////////

  return (
    <div className="task-menu-container bg-tasks-view self-center rounded-2xl w-[400px] p-10 m-8 text-left text-text-dark">
      <div className="flex flex-col gap-3 self-center">

      {/*    TITLE    */}
      <input
        type="text"
        value={title}
        placeholder="Add Title"
        onChange={handleTitleChange}
        className="border-b w-[100%] text-2xl"
      />

      {/*    NOTE    */}
        <textarea
          name="note"
          value={note}
          rows={1}
          placeholder="Add Note"
          onChange={handleTextAreaChange}
          className="border-b w-[100%] text-lg"
        ></textarea>


      {/*    TYPE    */}
      <div className="task-type flex gap-2 items-center">
        <label>Type:</label>
        <select
          name="task-type"
          value={type}
          onChange={handleTypeChange}
          className="task-element">
          <option value="day">daily</option>
          <option value="week">weekly</option>
          <option value="month">monthly</option>
        </select>
      </div>


      {/*    RECURRENCE   */}
      <div className="task-type flex gap-2 items-center">
        <input
          type="checkbox"
          name="repeating"
          checked={repeatable}
          onChange={handleRepeatableChange}
        />
        <p>Repeating</p>
      </div>


      {/*    DATE    */}
      <div className="repeat-options">
        {repeatable ? handleRepetition(type) : handleDeadline(type)}
      </div>


      {/*    DIFFICULTY    */}
      <div className="task-difficulty-input flex gap-2 items-center">
        <p>Difficulty:</p>
        <select
          name="difficulty"
          value={difficulty}
          onChange={handleDifficultyChange}
          className="task-element"
        >
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
      </div>


      {/*    PRIVATE    */}
      <div className="is-private flex gap-2">
        <input
          type="checkbox"
          name="private"
          checked={isPrivate}
          onChange={handlePrivacyChange}
        />
        <p>Private</p>
      </div>

      {/*    BUTTON    */}
      <button 
        className="bg-"
      onClick={handleSubmit}>Create Task</button>
    </div>
    </div>
  );
}

export default TaskMenu;
