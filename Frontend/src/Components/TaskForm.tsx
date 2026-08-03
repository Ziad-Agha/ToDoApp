import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { HiMiniXMark } from "react-icons/hi2";
import { apiFetch } from "../utils/api";
import { useTaskFormStore } from "../assets/store";

export default function TaskForm() {
  const task = useTaskForm();
  const closeForm = useTaskFormStore(state => state.closeForm)

  return <div className="task-form bg-backdrop rounded-xl w-85 p-5 flex flex-col text-text-dark">

    <button className="text-nav/50 absolute self-end hover:text-nav"
      onClick={closeForm}><HiMiniXMark size={28} />
    </button>

    <div className="flex flex-col gap-3 p-5 self-center">
      <input className="border-b w-full text-2xl focus:outline-none"
        type="text"
        value={task.title}
        placeholder="Add Title"
        onChange={(e) => task.setTitle(e.target.value)}
      />
      <textarea className="border-b w-full text-lg focus:outline-none"
        name="note" value={task.note}
        rows={1} placeholder="Add Note"
        onChange={(e) => task.setNote(e.target.value)}
      />
      <div className="task-type flex gap-2 items-center">
        <label>Type:</label>
        <CustomSelect
          value={task.type} onChange={task.setType}
          options={[
            { value: "day", label: "daily" },
            { value: "week", label: "weekly" },
            { value: "month", label: "monthly" },
          ]}
        />
      </div>

      <div className="task-type flex gap-2 items-center ">
        <input type="checkbox" name="repeating" checked={task.regular}
          onChange={() => task.setRegular(!task.regular)} />
        <p>Regular</p>
      </div>

      <div className="frequency-options">
        {task.regular ? task.handleFrequency(task.type) : task.handleDeadline(task.type)}
      </div>

      <div className="task-difficulty-input flex gap-2 items-center">
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

      <div className="is-private flex gap-2">
        <input type="checkbox" name="private" checked={task.isPrivate}
          onChange={() => task.setIsPrivate(!task.isPrivate)} />
        <p>Private</p>
      </div>

      {task.errors.length > 0 && (
        <div className="form-errors">
          {task.errors.map((error, index) => (
            <p key={index} style={{ color: "red" }}>{error}</p>
          ))}
        </div>
      )}
    </div>

    <button className="bg-nav text-backdrop w-[33%] p-2 rounded self-end text-lg hover:bg-subnav"
      onClick={() => task.handleSubmit()}>Create
    </button>

  </div>
}

type WeekRange = {
  start: Date;  // Monday
  end: Date;    // Sunday
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
  if (!date || !time) return null
  const deadline = new Date(date);
  deadline.setHours(time?.getHours(), time?.getMinutes(), 0, 0)
  return deadline
}

//  State hooks for form variables and handle functions
function useTaskForm() {

  const taskCreated = useTaskFormStore(state => state.taskCreated)
  const closeForm = useTaskFormStore(state => state.closeForm)
  const defaultTime = new Date()
  defaultTime.setHours(23, 59, 0, 0)

  const [title, setTitle] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [type, setType] = useState("day");
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(new Date());
  const [deadlineTime, setDeadlineTime] = useState<Date | null>(defaultTime)
  const [difficulty, setDifficulty] = useState("easy");
  const [regular, setRegular] = useState(false);
  const [weekly, setWeekly] = useState("Sunday");
  const [frequency, setFrequency] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const weekRange = selectedWeek ? getWeekRange(selectedWeek) : null;
  const monthRange = selectedMonth ? getMonthRange(selectedMonth) : null;

  /*  Returns start and end dates based on chosen type [day, week, month] */
  function getDate(type: string) {
    if (regular) return null;

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
      <input className="task-element w-[16%] text-center focus:outline-none caret-transparent"
        type="number" min="1" step="1" value={frequency}
        onPaste={(e) => e.preventDefault()}
        onKeyDown={(e) => e.preventDefault()}
        onChange={(e) => setFrequency(Number(e.target.value))}
      />
    );

    const weekdaySelect = type === "week" && (
      <div className="flex gap-2 items-center">
        <p>Day:</p>
        <select className="task-element"
          name="weekly-task" value={weekly}
          onChange={(e) => setWeekly(e.target.value)}>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>
    );

    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <p>Repeats every</p>
          {frequencyInput}
          <p>{labels[type]}</p>
        </div>
        {weekdaySelect}
      </div>
    );
  }

  /*  Returns appropriate DatePickers based on chosen type */
  function handleDeadline(type: string) {
    if (type === "day") {
      return <div className="day-date-picker flex gap-2 items-center">
        <label>Date:</label>
        <DatePicker wrapperClassName="w-[120px]"
          className="task-element w-full text-sm text-center focus:outline-none caret-transparent"
          dateFormat="MMM. d, yyyy"
          showDateSelect selected={deadlineDate}
          onFocus={(e) => e.target.blur()}
          onChange={(date: Date | null) => setDeadlineDate(date)}
        />
        <DatePicker wrapperClassName="w-[90px]"
          className="task-element w-full text-sm text-center focus:outline-none caret-transparent"
          timeFormat="hh:mm aa"
          dateFormat="hh:mm aa"
          selected={deadlineTime}
          showTimeSelect showTimeSelectOnly
          onChange={(date: Date | null) => setDeadlineTime(date)}
        />
      </div>
    }
    if (type === "week") {
      return <div className="week-date-picker flex gap-2 items-center">
        <DatePicker className="task-element focus:outline-none caret-transparent"
          placeholderText="Select a week"
          showWeekPicker calendarStartDay={1}
          selected={weekRange?.end}
          onChange={(date: Date | null) => setSelectedWeek(date)}
        />
      </div>
    }
    if (type === "month") {
      return <div className="week-date-picker gap-2 items-center">
        <DatePicker className="task-element focus:outline-none"
          placeholderText="Select a month"
          dateFormat="MMMM yyyy"
          showMonthYearPicker selected={monthRange?.end}
          onChange={(date: Date | null) => setSelectedMonth(date)}
        />
      </div>
    }
  }

  function validateForm(): string[] {
    const errors: string[] = [];
    if (!title.trim()) errors.push("Title is required.")
    if (!difficulty) errors.push("Difficulty is required.")
    if (!regular) {
      const dateValidators: Record<string, () => string | null> = {
        day: () => !deadlineDate ? "Deadline is required." : null,
        week: () => !selectedWeek ? "Please select a week."
          : isNaN(selectedWeek.getTime()) ? "Please select a valid week. (MM/DD/YYYY)"
            : null,
        month: () => !selectedMonth ? "Please select a month."
          : isNaN(selectedMonth.getTime()) ? "Please select a valid month."
            : null,
      }
      const dateError = dateValidators[type]?.()
      if (dateError) errors.push(dateError)
    }

    return errors;
  }

  async function handleSubmit() {

    // Validate
    const errors = validateForm();
    if (errors.length > 0) {
      setErrors(errors);
      return;
    } else

      setErrors([]);

    // Wrap data in an object
    const dateRange = getDate(type);
    const newTask = {
      title: title,
      note: note,
      difficulty: difficulty,
      created_on: new Date(new Date),
      type: type,
      start_date: dateRange ? new Date(dateRange.start) : null,
      deadline: dateRange && deadlineTime ? buildDeadline(dateRange.end, deadlineTime) : null,
      frequency: frequency,
      status: "active",
      weekday: weekly,
      isPrivate: isPrivate,
    };

    console.log("\nIn TaskForm - Submit:\ndateRange.start:", dateRange!.start,"\ndeadline: ", buildDeadline(dateRange!.end, deadlineTime))

    // Send object -> routes -> controller
    try {
      const response = await apiFetch("/tasks/createTask", {
        method: "POST",
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

    // Close form
    taskCreated()
    closeForm();

  }

  return {
    title, setTitle,
    note, setNote,
    type, setType,
    difficulty, setDifficulty,
    regular, setRegular,
    isPrivate, setIsPrivate,
    errors, handleFrequency,
    handleDeadline, handleSubmit
  }
}

/* Custome Dropdown for custom styling */
// Claude generated
interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

function CustomSelect({ value, onChange, options }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find(o => o.value === value)?.label ?? value;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button type="button"
        className="task-element flex items-center gap-4"
        onClick={() => setIsOpen(prev => !prev)}
      >
        {selectedLabel}
        <span className={`transition-transform -mt-1`}>⌄</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-backdrop border-taskcard border-2 rounded shadow-md">
          {options.map(option => (
            <li
              key={option.value}
              className={`p-1.5 m-0.5 rounded-xs cursor-pointer hover:bg-taskcard/60`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}