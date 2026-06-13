'use client'
import React, { useState, useEffect, useRef } from 'react'
import styles from './spinHistoryFilterMenu.module.scss'
import FilterIcon from '@/icons/filterIcon'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/button'
import DateRangePicker from '@/components/dateRangePicker'

const FilterCheckbox = ({ label, checked, onClick }) => (
    <div className={styles.option} onClick={onClick}>
        <div className={`${styles.checkbox} ${checked ? styles.checked : ''}`}>
            {checked && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </div>
        <span>{label}</span>
    </div>
);

export default function SpinHistoryFilterMenu({ onApply, initialFilters, hideRewardType }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [rewardTypes, setRewardTypes] = useState([]);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (initialFilters) {
            setDateRange(initialFilters.dateRange || { from: '', to: '' });
            setRewardTypes(initialFilters.rewardTypes || []);
        }
    }, [initialFilters]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleRewardType = (value) => {
        setRewardTypes(prev =>
            prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]
        );
    }

    const rewardTypeOptions = [
        { label: 'Voucher', value: 'VOUCHER' },
        { label: 'CB Points', value: 'POINT' },
        { label: 'Cash', value: 'CASH' },
        { label: 'Rupee Point', value: 'RUPEEPOINT' },
    ];

    const handleApply = () => {
        onApply({
            dateRange,
            rewardTypes
        });
        setIsOpen(false);
    }

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return 'dd/mm/yyyy';
        const parts = dateStr.split('-');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };

    return (
        <div className={styles.spinHistoryFilterMenu} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${styles.button} ${isOpen ? styles.active : ''}`}
            >
                <FilterIcon />
                Filter
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.dropdown}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <div className={styles.header}>
                            <h4>Filters</h4>
                            <div className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M13.4142 12.0002L18.7072 6.70725C19.0982 6.31625 19.0982 5.68425 18.7072 5.29325C18.3162 4.90225 17.6842 4.90225 17.2932 5.29325L12.0002 10.5862L6.70725 5.29325C6.31625 4.90225 5.68425 4.90225 5.29325 5.29325C4.90225 5.68425 4.90225 6.31625 5.29325 6.70725L10.5862 12.0002L5.29325 17.2933C4.90225 17.6842 4.90225 18.3162 5.29325 18.7072C5.48825 18.9022 5.74425 19.0002 6.00025 19.0002C6.25625 19.0002 6.51225 18.9022 6.70725 18.7072L12.0002 13.4143L17.2932 18.7072C17.4882 18.9022 17.7442 19.0002 18.0002 19.0002C18.2562 19.0002 18.5122 18.9022 18.7072 18.7072C19.0982 18.3162 19.0982 17.6842 18.7072 17.2933L13.4142 12.0002Z" fill="#625F6E" />
                                </svg>
                            </div>
                        </div>

                        <div className={styles.scrollArea}>
                            <div className={styles.filterSection}>
                                <h5 className={styles.sectionTitle}>Select Date Range</h5>
                                <div className={styles.dateRow} onClick={() => setIsDatePickerOpen(true)}>
                                    <div className={styles.dateInput}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.6667 2.66675H3.33333C2.59695 2.66675 2 3.2637 2 4.00008V13.3334C2 14.0698 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0698 14 13.3334V4.00008C14 3.2637 13.403 2.66675 12.6667 2.66675Z" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10.6667 1.33325V3.99992" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M5.33325 1.33325V3.99992" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2 6.66675H14" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>{formatDisplayDate(dateRange.from)}</span>
                                    </div>
                                    <span className={styles.dateSeparator}>To</span>
                                    <div className={styles.dateInput}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.6667 2.66675H3.33333C2.59695 2.66675 2 3.2637 2 4.00008V13.3334C2 14.0698 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0698 14 13.3334V4.00008C14 3.2637 13.403 2.66675 12.6667 2.66675Z" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10.6667 1.33325V3.99992" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M5.33325 1.33325V3.99992" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2 6.66675H14" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>{formatDisplayDate(dateRange.to)}</span>
                                    </div>
                                </div>
                            </div>

                            {!hideRewardType && (
                                <div className={styles.filterSection}>
                                    <h5 className={styles.sectionTitle}>Reward Type</h5>
                                    <div className={styles.checkboxRow}>
                                        {rewardTypeOptions.map(opt => (
                                            <FilterCheckbox
                                                key={opt.value}
                                                label={opt.label}
                                                checked={rewardTypes.includes(opt.value)}
                                                onClick={() => toggleRewardType(opt.value)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.applyBtnWrapper}>
                            <Button
                                text="Apply Filters"
                                onClick={handleApply}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <DateRangePicker
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                onApply={(range) => setDateRange(range)}
                initialFrom={dateRange.from}
                initialTo={dateRange.to}
            />
        </div>
    )
}
