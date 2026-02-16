import React, { useState } from "react";

export default function AttendanceCalendarOpen() {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });
    const [selected, setSelected] = useState(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    });

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const changeMonth = (delta) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
    };

    const buildGrid = (m) => {
        const year = m.getFullYear();
        const month = m.getMonth();
        const firstOfMonth = new Date(year, month, 1);
        const startDay = firstOfMonth.getDay(); // 0..6
        const startDate = new Date(year, month, 1 - startDay);
        const days = [];
        for (let i = 0; i < 42; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const days = buildGrid(currentMonth);
    const isSame = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    return (
        <div className="mx-auto w-full max-w-sm">
            <h3 className="mb-3 px-2 text-base font-semibold sm:mb-4 sm:px-0 sm:text-lg">Attendance Calendar</h3>

            <div className="mx-2 rounded-lg border border-gray-200 p-4 shadow-sm sm:mx-0 sm:p-5">
                {/* header */}
                <div className="mb-4 flex items-center justify-center sm:mb-5">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => changeMonth(-1)}
                            className="grid h-8 w-8 place-items-center rounded-md border border-gray-300 bg-white text-xl text-slate-700 transition-colors hover:bg-gray-50 sm:h-9 sm:w-9"
                            aria-label="Previous month"
                        >
                            ‹
                        </button>

                        <div className="min-w-[140px] text-center text-sm font-semibold text-slate-800 sm:min-w-[160px] sm:text-base">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </div>

                        <button
                            onClick={() => changeMonth(1)}
                            className="grid h-8 w-8 place-items-center rounded-md border border-gray-300 bg-white text-xl text-slate-700 transition-colors hover:bg-gray-50 sm:h-9 sm:w-9"
                            aria-label="Next month"
                        >
                            ›
                        </button>
                    </div>
                </div>

                {/* weekdays */}
                <div className="mb-3 grid grid-cols-7 gap-1 text-[11px] font-medium text-gray-500 sm:gap-2 sm:text-xs">
                    {weekShort.map((w) => (
                        <div
                            key={w}
                            className="py-1 text-center"
                        >
                            {w}
                        </div>
                    ))}
                </div>

                {/* days grid */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {days.map((d, idx) => {
                        const isCurrentMonth = d.getMonth() === currentMonth.getMonth();
                        const isToday = isSame(d, new Date());
                        const isSelected = isSame(d, selected);

                        // classes for each day button
                        const base = "h-9 w-9 sm:h-10 sm:w-10 grid place-items-center rounded-md cursor-pointer text-xs sm:text-sm transition-all";
                        const muted = isCurrentMonth ? "text-slate-800 font-medium" : "text-gray-300";
                        const todayRing = isToday && !isSelected ? "ring-2 ring-slate-300" : "";
                        const sel = isSelected ? "bg-black text-white shadow-md" : "hover:bg-gray-100";

                        return (
                            <button
                                key={idx}
                                onClick={() => setSelected(new Date(d.getFullYear(), d.getMonth(), d.getDate()))}
                                className={`${base} ${muted} ${todayRing} ${sel}`}
                                title={d.toDateString()}
                            >
                                {d.getDate()}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
