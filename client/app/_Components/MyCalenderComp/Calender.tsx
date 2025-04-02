import React, { useState, useEffect } from "react";
import styles from "./Calender.module.css";

interface CalendarProps {
    onDateSelect: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [minSelectableDate, setMinSelectableDate] = useState(new Date());

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setMinSelectableDate(today);
        if (currentDate < today) {
            setCurrentDate(today);
            onDateSelect(today.toISOString().split("T")[0]);
        }
    }, []);

    const changeDate = (days: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + days);
        if (newDate >= minSelectableDate) {
            setCurrentDate(newDate);
            onDateSelect(newDate.toISOString().split("T")[0]);
        }
    };

    const handleDateSelection = (date: Date) => {
        if (date >= minSelectableDate) {
            setCurrentDate(date);
            onDateSelect(date.toISOString().split("T")[0]);
        }
    };

    const generateDateRange = () => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() + i - 3);
            return date;
        });
    };

    return (
        <div className={styles.calendarContainer}>
            <div className={styles.header}>
                <div className={styles.arrowWrapper}>
                    <button
                        onClick={() => changeDate(-1)}
                        className={`${styles.arrowContainer} ${currentDate <= minSelectableDate ? styles.disabled : ""}`}
                        disabled={currentDate <= minSelectableDate}
                    >
                        <span className={styles.arrow}>&lt;</span>
                    </button>
                    <span className={styles.monthYear}>
                        {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
                    </span>
                    <button onClick={() => changeDate(1)} className={styles.arrowContainer}>
                        <span className={styles.arrow}>&gt;</span>
                    </button>
                </div>
            </div>
            <div className={styles.datesContainer}>
                {generateDateRange().map((date, index) => (
                    <button
                        key={index}
                        className={`${styles.dateButton} ${date.toDateString() === currentDate.toDateString() ? styles.selectedDate : ""} ${date < minSelectableDate ? styles.disabledDate : ""}`}
                        onClick={() => handleDateSelection(date)}
                        disabled={date < minSelectableDate}
                    >
                        <div className={styles.day}>{date.toLocaleString("default", { weekday: "short" })}</div>
                        <div className={styles.date}>{date.getDate()} {date.toLocaleString("default", { month: "short" })}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Calendar;