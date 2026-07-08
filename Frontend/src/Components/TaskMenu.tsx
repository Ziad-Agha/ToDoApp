import { useState } from "react";
import DatePicker from "react-datepicker";

type WeekRange = {
  start: Date; // Monday
  end: Date; // Sunday
}
type MonthRange = {
  start: Date;
  end: Date;
}
function getWeekRange(date: Date): WeekRange {
  const day = date.getDay();
  const mondayOffset = (day === 0 ? -6 : 1) - day;

  const start = new Date(date);
  start.setDate(date.getDate() + mondayOffset);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    start: new Date(
      Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0),
    ),
    end: new Date(
      Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 0),
    ),
  };
}
function getMonthRange(date: Date): MonthRange {
  const year = date.getFullYear();
  const month = date.getMonth();

  return {
    start: new Date(Date.UTC(year, month, 1, 0, 0, 0)),
    end: new Date(Date.UTC(year, month + 1, 0, 23, 59, 0)),
  };
}
//  Combines time and date into a Date object
function buildDeadline(date: Date | null, time: Date | null): Date | null {
  if (date && time) {
    const deadline = date && new Date(date);
    deadline.setHours(time?.getHours(), time?.getMinutes(), 0, 0)
    return deadline
  } return null
}

//  State hooks for form variables and handle functions
function useTaskForm() {
  const defaultTime = new Date()
  defaultTime.setHours(23, 59, 0, 0)

  const [title, setTitle] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [type, setType] = useState("day");
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(new Date());
  const [deadlineTime, setDeadlineTime] = useState<Date | null>(defaultTime)
  const [difficulty, setDifficulty] = useState("easy");
  const [repeatable, setRepeatable] = useState(false);
  const [weekly, setWeekly] = useState("Sunday");
  const [frequency, setFrequency] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const weekRange = selectedWeek ? getWeekRange(selectedWeek) : null;
  const monthRange = selectedMonth ? getMonthRange(selectedMonth) : null;

  /*  Returns start and end dates based on chosen type [day, week, month] */
  function getDate(type: string) {
    if (repeatable) return null;

    if (type === "day" && deadlineDate) {
      const date = new Date(deadlineDate)
      date.setHours(0, 0, 0, 0);
      return { start: date, end: date };
    }

    if (type === "week" && weekRange) {
      return { start: weekRange.start, end: weekRange.end };
    }

    if (type === "month" && monthRange) {
      return { start: monthRange.start, end: monthRange.end };
    }

  }

  /*  Returns appropriate elment based on chosen type */
  function handleFrequency(type: string) {
    const labels: Record<string, string> = {
      day: "days",
      week: "weeks",
      month: "months",
    };

    const frequencyInput = (
      <input type="number"
        min="1" step="1" value={frequency}
        onChange={(e) => setFrequency(Number(e.target.value))}
        onKeyDown={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
      />
    );

    const weekdaySelect = type === "week" && (
      <>
        <p>Day:</p>
        <select name="weekly-task" value={weekly} onChange={(e) => setWeekly(e.target.value)}>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </>
    );

    return (
      <div>
        <p>Repeats every</p>
        {frequencyInput}
        <p>{labels[type]}</p>
        {weekdaySelect}
      </div>
    );
  }

  /*  Returns appropriate DatePickers based on chosen type */
  function handleDeadline(type: string) {
    if (type === "day") {
      return <div className="day-date-picker flex gap-2 items-center">
        <label>Date:</label>
        <DatePicker
          selected={deadlineDate}
          onChange={(date: Date | null) => setDeadlineDate(date)}
          showDateSelect
          dateFormat="MMM. d, yyyy"
          className="task-element datepicker-input "
          wrapperClassName="w-[120px]"
          onFocus={(e) => e.target.blur()}
        />
        <DatePicker
          selected={deadlineTime}
          onChange={(date: Date | null) => setDeadlineTime(date)}
          showTimeSelect showTimeSelectOnly
          timeFormat="hh:mm aa"
          dateFormat="hh:mm aa"
          className="task-element datepicker-input"
          wrapperClassName="w-[90px]"
        />
      </div>
    }
    if (type === "week") {
      return <div className="week-date-picker flex gap-2 items-center">
        <DatePicker
          selected={weekRange?.end}
          onChange={(date: Date | null) => setSelectedWeek(date)}
          showWeekPicker
          calendarStartDay={1}
          className="task-element"
          placeholderText="Select a week"
        />
      </div>
    }
    if (type === "month") {
      return <div className="week-date-picker flex gap-2 items-center">
        <DatePicker
          selected={monthRange?.end}
          onChange={(date: Date | null) => setSelectedMonth(date)}
          showMonthYearPicker
          dateFormat="MMMM yyyy"
          className="task-element"
          placeholderText="Select a month"
        />
      </div>
    }
  }

  async function handleSubmit() {

    // ------------------ VALIDATION BLOCK -------------------------- //
    const validationErrors: string[] = [];

    // Use turnary op--------------------------------------------------
    if (!title.trim()) validationErrors.push("Title is required.");
    if (!difficulty) validationErrors.push("Difficulty is required.");

    // Try switch------------------------------------------------------
    if (!repeatable) {
      if (type === "day" && !deadlineDate)
        validationErrors.push("Deadline is required.");
      if (type === "week") {
        if (!selectedWeek) validationErrors.push("Please select a week.");
        else if (isNaN(selectedWeek.getTime()))
          validationErrors.push("Please select a valid week from the calendar. (MM/DD/YYYY)");
      }

      // Use turnary op--------------------------------------------------
      if (type === "month") {
        if (!selectedMonth) validationErrors.push("Please select a month.");
        else if (isNaN(selectedMonth.getTime()))
          validationErrors.push("Please select a valid month from the calendar.");
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    const dateRange = getDate(type);
    const newTask = {
      name: title,
      note: note,
      difficulty: difficulty,
      createdon: new Date(),
      type: type,
      startDate: dateRange ? dateRange.start : null,
      deadline: dateRange ? buildDeadline(dateRange.end, deadlineTime) : null,
      frequency: frequency,
      status: repeatable ? "" : "active",
      weekday: weekly,
      isPrivate: isPrivate,
    };


    // ------------------ POST REQ BLOCK ----------------- //
    //  SENDING TASK TO BACKEND SERVER
    try {
      // API SHOULD BE REFERENCED NOT EXPLICIT
      // SHOULDN'T THE REQUEST BE IN ROUTES?
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

  return {
    title, setTitle,
    note, setNote,
    type, setType,
    difficulty, setDifficulty,
    repeatable, setRepeatable,
    isPrivate, setIsPrivate,
    errors,

    handleFrequency, handleDeadline, handleSubmit
  }
}

export default function TaskMenu() {
  const {
    title, setTitle,
    note, setNote,
    type, setType,
    difficulty, setDifficulty,
    repeatable, setRepeatable,
    isPrivate, setIsPrivate,
    errors, handleFrequency,
    handleDeadline, handleSubmit
  } = useTaskForm();

  return <div className="task-menu-container bg-tasks-view self-center rounded-2xl w-[400px] p-10 m-8 text-left text-text-dark">
    <div className="flex flex-col gap-3 self-center">
      <input className="border-b w-[100%] text-2xl"
        type="text" value={title} placeholder="Add Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea className="border-b w-[100%] text-lg"
        name="note" value={note} rows={1} placeholder="Add Note"
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="task-type flex gap-2 items-center">
        <label>Type:</label>
        <select className="task-element" name="task-type" value={type}
          onChange={(e) => setType(e.target.value)}>
          <option value="day">daily</option>
          <option value="week">weekly</option>
          <option value="month">monthly</option>
        </select>
      </div>
      <div className="task-type flex gap-2 items-center">
        <input type="checkbox" name="repeating" checked={repeatable}
          onChange={() => setRepeatable(!repeatable)} />
        <p>Repeating</p>
      </div>
      <div className="repeat-options">
        {repeatable ? handleFrequency(type) : handleDeadline(type)}
      </div>
      <div className="task-difficulty-input flex gap-2 items-center">
        <p>Difficulty:</p>
        <select className="task-element"
          name="difficulty" value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
      </div>
      <div className="is-private flex gap-2">
        <input type="checkbox" name="private" checked={isPrivate}
          onChange={() => setIsPrivate(!isPrivate)} />
        <p>Private</p>
      </div>
      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((error, index) => (
            <p key={index} style={{ color: "red" }}>{error}</p>
          ))}
        </div>
      )}

      <button className="bg-nav text-tasks-view w-[33%] p-2 rounded self-end text-lg"
        onClick={handleSubmit}>Create
      </button>
    </div>
  </div>
}
