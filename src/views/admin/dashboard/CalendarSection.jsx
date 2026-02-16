import React, { useState } from 'react';
import styles from './CalendarSection.module.css';

const CalendarSection = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const generateCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const calendar = [];
    let week = Array(firstDay).fill(null);

    for (let day = 1; day <= totalDays; day++) {
      week.push(day);
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    if (week.length) {
      while (week.length < 7) week.push(null);
      calendar.push(week);
    }

    return calendar;
  };

  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const calendarDays = generateCalendar(currentYear, currentMonth);
  const isToday = (day) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.header}>
        <div className={styles.monthYear}>
          {new Date(currentYear, currentMonth).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </div>
        <div className={styles.navButtons}>
          <button onClick={handlePrev}>&lt;</button>
          <button onClick={handleNext}>&gt;</button>
        </div>
      </div>

      <div className={styles.weekdays}>
        {daysOfWeek.map((day, index) => (
          <div
            key={day}
            className={`${styles.weekday} ${
              index === today.getDay() ? styles.currentDayName : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className={styles.calendarGrid}>
        {calendarDays.map((week, i) => (
          <div key={i} className={styles.weekRow}>
            {week.map((day, j) => (
              <div
                key={j}
                className={`${styles.dayCell} ${
                  j === 0 ? styles.sunday : ''
                } ${isToday(day) ? styles.todayDot : ''}`}
              >
                {day || ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarSection;
