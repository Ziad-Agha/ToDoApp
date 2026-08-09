import { useState } from "react";
import DatePicker from "react-datepicker";
import { HiMiniXMark } from "react-icons/hi2";
import { useTaskStore } from "../assets/store";
import { buildDeadline, getMonthRange, getWeekRange } from "../utils/dateUtils"
import { CustomSelect } from "./ui/CustomSelect";
import { validateForm } from "../utils/validationUtils";
import { createTask } from "../services/taskService";
import type { newTask } from "../utils/types";

export default function TaskForm() {
  const task = useTaskForm();
  const closeForm = useTaskStore((state) => state.closeForm);

  return (
    <div className="task-form bg-backdrop rounded-xl w-85 p-5 flex flex-col text-text-dark">
      <button
        className="text-nav/50 absolute self-end hover:text-nav"
        onClick={closeForm}
      >
        <HiMiniXMark size={28} />
      </button>

      <div className="flex flex-col gap-3 p-5 self-center">
        <input
          className="border-b w-full text-2xl focus:outline-none"
          type="text"
          value={task.title}
          placeholder="Add Title"
          onChange={(e) => task.setTitle(e.target.value)}
        />
        <textarea
          className="border-b w-full text-lg focus:outline-none"
          name="note"
          value={task.note}
          rows={1}
          placeholder="Add Note"
          onChange={(e) => task.setNote(e.target.value)}
        />
        <div className="task-type flex gap-2 items-center">
          <label>Type:</label>
          <CustomSelect
            value={task.type}
            onChange={task.setType}
            options={[
              { value: "day", label: "daily" },
              { value: "week", label: "weekly" },
              { value: "month", label: "monthly" },
            ]}
          />
        </div>

        <div className="task-type flex gap-2 items-center ">
          <input
            type="checkbox"
            name="repeating"
            checked={task.regular}
            onChange={() => task.setRegular(!task.regular)}
          />
          <p>Regular</p>
        </div>

        <div className="frequency-options">
          {task.regular
            ? task.handleFrequency(task.type)
            : task.handleDeadline(task.type)}
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
        className="bg-nav text-backdrop w-[33%] p-2 rounded self-end text-lg hover:bg-subnav"
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
  const [type, setType] = useState("day");
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(new Date());
  const [deadlineTime, setDeadlineTime] = useState<Date | null>(defaultTime);
  const [difficulty, setDifficulty] = useState("easy");
  const [regular, setRegular] = useState(false);
  const [weekly, setWeekly] = useState("Sunday");
  const [frequency, setFrequency] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const weekRange = selectedWeek ? getWeekRange(selectedWeek) : null;
  const monthRange = selectedMonth ? getMonthRange(selectedMonth) : null;

  /*  Returns start and end dates based on chosen type [day, week, month] */
  function getStartAndEndDate(type: string) {
    if (regular) return null;

    if (type === "day" && deadlineDate) {
      const date = new Date(deadlineDate);
      date.setHours(0, 0, 0, 0);
      return { start: date, end: new Date(date) };
    }

    if (type === "week" && weekRange) {
      return { start: weekRange.start, end: weekRange.end };
    }

    if (type === "month" && monthRange) {
      return { start: monthRange.start, end: monthRange.end };
    }
  }

  /*  Returns appropriate HTML elment based on chosen type [day, week, month] */
  function handleFrequency(type: string) {
    const labels: Record<string, string> = {
      day: "days",
      week: "weeks",
      month: "months",
    };

    const frequencyInput = (
      <input
        className="task-element w-[16%] text-center focus:outline-none caret-transparent"
        type="number" min="1" step="1" value={frequency}
        onPaste={(e) => e.preventDefault()}
        onKeyDown={(e) => e.preventDefault()}
        onChange={(e) => setFrequency(Number(e.target.value))}
      />
    );

    const weekdaySelect = type === "week" && (
      <div className="flex gap-2 items-center">
        <p>Day:</p>
        <select
          className="task-element"
          name="weekly-task"
          value={weekly}
          onChange={(e) => setWeekly(e.target.value)}
        >
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
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

  /*  Returns appropriate DatePickers based on chosen type [day, week, month] */
  function handleDeadline(type: string) {
    if (type === "day") {
      return (
        <div className="day-date-picker flex gap-2 items-center">
          <label>Date:</label>
          <DatePicker className="task-element w-full text-sm text-center focus:outline-none caret-transparent"
            wrapperClassName="w-[120px]"
            dateFormat="MMM. d, yyyy"
            showDateSelect
            selected={deadlineDate}
            onFocus={(e) => e.target.blur()}
            onChange={(date: Date | null) => setDeadlineDate(date)}
          />
          <DatePicker className="task-element w-full text-sm text-center focus:outline-none caret-transparent"
            wrapperClassName="w-[90px]"
            timeFormat="hh:mm aa"
            dateFormat="hh:mm aa"
            selected={deadlineTime}
            showTimeSelect
            showTimeSelectOnly
            onChange={(date: Date | null) => setDeadlineTime(date)}
          />
        </div>
      );
    }

    if (type === "week") {
      return (
        <div className="week-date-picker flex gap-2 items-center">
          <DatePicker
            className="task-element focus:outline-none caret-transparent"
            placeholderText="Select a week"
            showWeekPicker
            calendarStartDay={1}
            selected={weekRange?.end}
            onChange={(date: Date | null) => setSelectedWeek(date)}
          />
        </div>
      );
    }

    if (type === "month") {
      return (
        <div className="week-date-picker gap-2 items-center">
          <DatePicker
            className="task-element focus:outline-none"
            placeholderText="Select a month"
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            selected={monthRange?.end}
            onChange={(date: Date | null) => setSelectedMonth(date)}
          />
        </div>
      );
    }
  }

  async function handleSubmit() {

    // Validate
    const fields = {
      type,
      title,
      regular,
      difficulty,
      deadlineDate,
      selectedWeek,
      selectedMonth
    }
    const errors = validateForm(fields);
    
    if (errors.length > 0) {
      setErrors(errors);
      return;
    } else setErrors([]);

    // Wrap data in an object
    const dateRange = getStartAndEndDate(type);
    const newTask: newTask = {
      title: title,
      note: note,
      type: type,
      difficulty: difficulty,
      created_on: new Date(new Date()),
      start_date: new Date(dateRange!.start) ,
      deadline:
        dateRange && deadlineTime
          ? buildDeadline(dateRange.end, deadlineTime)
          : null,
      frequency: regular ? frequency : 0,
      status: "active",
      weekday: weekly,
      isPrivate: isPrivate,
    };

    // Create object in database
    try {
      const createdTask = await createTask(newTask);
      addTask(createdTask);
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
    type,
    setType,
    difficulty,
    setDifficulty,
    regular,
    setRegular,
    isPrivate,
    setIsPrivate,
    errors,
    handleFrequency,
    handleDeadline,
    handleSubmit,
  };
}