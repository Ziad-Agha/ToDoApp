import { useEffect, useRef, useState } from "react";

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

export function CustomSelect({ value, onChange, options }: CustomSelectProps) {

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

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
      <button
        type="button"
        className="task-element flex items-center gap-4"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedLabel}
        <span className={`transition-transform -mt-1`}>⌄</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-backdrop border-taskcard border-2 rounded shadow-md">
          {options.map((option) => (
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
