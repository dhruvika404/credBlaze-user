"use client"
import React, { useState, useMemo } from 'react';
import styles from './dateRangePicker.module.scss';

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    const day = new Date(year, month, 1).getDay();
    // Convert Sunday=0 to Monday-first (Mo=0, Su=6)
    return day === 0 ? 6 : day - 1;
}

function formatDate(date) {
    if (!date) return 'dd / mm / yyyy';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d} / ${m} / ${y}`;
}

function toYMD(date) {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function isSameDay(a, b) {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

function isInRange(date, start, end) {
    if (!start || !end || !date) return false;
    const t = date.getTime();
    return t > start.getTime() && t < end.getTime();
}

export default function DateRangePicker({ isOpen, onClose, onApply, initialFrom, initialTo }) {
    const today = new Date();

    const [leftMonth, setLeftMonth] = useState(() => {
        if (initialFrom) {
            const d = new Date(initialFrom);
            return { year: d.getFullYear(), month: d.getMonth() };
        }
        return { year: today.getFullYear(), month: today.getMonth() };
    });

    const rightMonth = useMemo(() => {
        let m = leftMonth.month + 1;
        let y = leftMonth.year;
        if (m > 11) { m = 0; y++; }
        return { year: y, month: m };
    }, [leftMonth]);

    const [startDate, setStartDate] = useState(() => initialFrom ? new Date(initialFrom) : null);
    const [endDate, setEndDate] = useState(() => initialTo ? new Date(initialTo) : null);
    const [selecting, setSelecting] = useState('start'); // 'start' or 'end'

    const handlePrevMonth = () => {
        setLeftMonth(prev => {
            let m = prev.month - 1;
            let y = prev.year;
            if (m < 0) { m = 11; y--; }
            return { year: y, month: m };
        });
    };

    const handleNextMonth = () => {
        setLeftMonth(prev => {
            let m = prev.month + 1;
            let y = prev.year;
            if (m > 11) { m = 0; y++; }
            return { year: y, month: m };
        });
    };

    const handleDayClick = (year, month, day) => {
        const clicked = new Date(year, month, day);

        if (selecting === 'start') {
            setStartDate(clicked);
            setEndDate(null);
            setSelecting('end');
        } else {
            if (clicked < startDate) {
                // Clicked before start, reset
                setStartDate(clicked);
                setEndDate(null);
                setSelecting('end');
            } else {
                setEndDate(clicked);
                setSelecting('start');
            }
        }
    };

    const handleSetDate = () => {
        onApply({
            from: toYMD(startDate),
            to: toYMD(endDate)
        });
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    const renderMonth = (year, month, navType) => {
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const cells = [];

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            cells.push(<div key={`empty-${i}`} className={styles.emptyCell} />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isStart = isSameDay(date, startDate);
            const isEnd = isSameDay(date, endDate);
            const inRange = isInRange(date, startDate, endDate);

            let cellClass = styles.dayCell;
            if (isStart || isEnd) cellClass += ` ${styles.selectedDay}`;
            if (inRange) cellClass += ` ${styles.inRange}`;
            if (isStart && endDate) cellClass += ` ${styles.rangeStart}`;
            if (isEnd) cellClass += ` ${styles.rangeEnd}`;

            cells.push(
                <div
                    key={day}
                    className={cellClass}
                    onClick={() => handleDayClick(year, month, day)}
                >
                    <span>{day}</span>
                </div>
            );
        }

        return (
            <div className={styles.monthPanel}>
                <div className={styles.monthHeader}>
                    {navType === 'left' ? (
                        <button className={styles.navBtn} onClick={handlePrevMonth}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M12.5 15L7.5 10L12.5 5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    ) : <div className={styles.navSpacer} />}

                    <span className={styles.monthLabel}>{MONTHS[month]}</span>

                    {navType === 'right' ? (
                        <button className={styles.navBtn} onClick={handleNextMonth}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    ) : <div className={styles.navSpacer} />}
                </div>

                <div className={styles.dayNames}>
                    {DAYS.map(d => <div key={d} className={styles.dayName}>{d}</div>)}
                </div>

                <div className={styles.daysGrid}>
                    {cells}
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={styles.pickerContainer}>
                <div className={styles.calendars}>
                    {renderMonth(leftMonth.year, leftMonth.month, 'left')}
                    {renderMonth(rightMonth.year, rightMonth.month, 'right')}
                </div>

                <div className={styles.footer}>
                    <div className={styles.dateDisplay}>
                        <div className={`${styles.dateBox} ${selecting === 'start' ? styles.activeDate : ''}`}>
                            {formatDate(startDate)}
                        </div>
                        <span className={styles.toLabel}>To</span>
                        <div className={`${styles.dateBox} ${selecting === 'end' ? styles.activeDate : ''}`}>
                            {formatDate(endDate)}
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                        <button
                            className={styles.setDateBtn}
                            onClick={handleSetDate}
                            disabled={!startDate || !endDate}
                        >
                            Set Date
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
