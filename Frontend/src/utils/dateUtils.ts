// Combined WeekRange and MonthRange
type DateRange = {
    start: Date; // Monday
    end: Date; // Sunday
};

// Returns the week of a specified date
export function getWeekRange(date: Date): DateRange {
    const day = date.getDay();
    const mondayOffset = (day === 0 ? -6 : 1) - day;

    const start = new Date(date);
    start.setDate(date.getDate() + mondayOffset);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    // verify UTC smh...
    return {
        start: new Date(
            Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0),
        ),
        end: new Date(
            Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 0),
        ),
    };
}

// Returns the month of a specified date
export function getMonthRange(date: Date): DateRange {
    const year = date.getFullYear();
    const month = date.getMonth();

    return {
        start: new Date(Date.UTC(year, month, 1, 0, 0, 0)),
        end: new Date(Date.UTC(year, month + 1, 0, 23, 59, 0)),
    };
}

//  Combines time and date into a Date object
export function buildDeadline(date: Date | null, time: Date | null): Date | null {
    if (!date || !time) return null;
    const deadline = new Date(date);
    deadline.setHours(time?.getHours(), time?.getMinutes(), 0, 0);
    return deadline;
}