interface FormFieldsProps {
    type: string
    title: string
    regular: boolean
    difficulty: string
    deadlineDate: Date | null
    selectedWeek: Date | null
    selectedMonth: Date | null
}

export function validateForm(form: FormFieldsProps): string[] {
    const errors: string[] = [];
    if (!form.title.trim()) errors.push("Title is required.");
    if (!form.difficulty) errors.push("Difficulty is required.");
    if (!form.regular) {
      const dateValidators: Record<string, () => string | null> = {
        day: () => (!form.deadlineDate ? "Deadline is required." : null),
        week: () =>
          !form.selectedWeek
            ? "Please select a week."
            : isNaN(form.selectedWeek.getTime())
              ? "Please select a valid week. (MM/DD/YYYY)"
              : null,
        month: () =>
          !form.selectedMonth
            ? "Please select a month."
            : isNaN(form.selectedMonth.getTime())
              ? "Please select a valid month."
              : null,
      };
      const dateError = dateValidators[form.type]?.();
      if (dateError) errors.push(dateError);
    }

    return errors;
  }