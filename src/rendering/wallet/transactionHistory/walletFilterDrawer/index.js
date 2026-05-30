"use client"
import React, { useState, useEffect } from 'react'
import styles from './walletFilterDrawer.module.scss'
import CloseIcon from '@/icons/closeIcon'
import DateRangePicker from '@/components/dateRangePicker'

const FilterCheckbox = ({ label, checked, onChange }) => (
    <label className={styles.gridItem}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <div className={styles.box}>
            {checked && (
                <svg width="10" height="8" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </div>
        <span>{label}</span>
    </label>
);

const FilterSection = ({ title, options, selectedValues, onToggle, grid }) => {
    return (
        <div className={styles.section}>
            <h3>{title}</h3>
            <div className={grid ? styles.optionsGrid : styles.optionsList}>
                {options.map(opt => (
                    <FilterCheckbox 
                        key={opt.value}
                        label={opt.label}
                        checked={selectedValues.includes(opt.value)}
                        onChange={() => onToggle(opt.value)}
                    />
                ))}
            </div>
        </div>
    );
}

export default function WalletFilterDrawer({ isOpen, onClose, onApply, initialFilters }) {
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [walletTypes, setWalletTypes] = useState([]);
    const [transactionTypes, setTransactionTypes] = useState([]);
    const [earningTypes, setEarningTypes] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    useEffect(() => {
        if (isOpen && initialFilters) {
            setDateRange(initialFilters.dateRange || { from: '', to: '' });
            setWalletTypes(initialFilters.walletTypes || []);
            setTransactionTypes(initialFilters.transactionTypes || []);
            setEarningTypes(initialFilters.earningTypes || []);
            setStatuses(initialFilters.statuses || []);
        }
    }, [isOpen, initialFilters]);

    if (!isOpen) return null;

    const toggleArrayItem = (setter) => (value) => {
        setter(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
    }

    const walletTypeOptions = [
        { label: 'Real Wallet', value: 'REAL' },
        { label: 'CB Points Wallet', value: 'CASEBACKPOINTS' },
    ];

    const transactionTypeOptions = [
        { label: 'Deposit', value: 'DEPOSIT' },
        { label: 'Withdraw', value: 'WITHDRAW' },
    ];

    const earningTypeOptions = [
        { label: 'Referral', value: 'referral' },
        { label: 'Spin & Earn', value: 'spin_and_earn' },
        { label: 'Task Perform', value: 'task_perform' },
        { label: 'Task Commission', value: 'task_commission' },
        { label: 'Add Amount', value: 'add_amount' },
        { label: 'Withdraw Amount', value: 'withdraw_amount' },
        { label: 'Signup Bonus', value: 'SIGNUP_BONUS' },
        { label: 'Pro Referral Reward', value: 'PRIME_REFERRAL_REWARD' },
    ];

    const statusOptions = [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Success', value: 'SUCCESS' },
        { label: 'Failed', value: 'FAILED' },
        { label: 'Admin Approval Pending', value: 'ADMIN_APPROVAL_PENDING' },
        { label: 'Rejected', value: 'REJECTED' },
    ];

    const handleApply = () => {
        onApply({
            dateRange,
            walletTypes,
            transactionTypes,
            earningTypes,
            statuses
        });
        onClose();
    }

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return 'dd/mm/yyyy';
        const parts = dateStr.split('-');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };

    return (
        <>
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.drawer} onClick={e => e.stopPropagation()}>
                    <div className={styles.header}>
                        <h2>Filters</h2>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <CloseIcon />
                        </button>
                    </div>
                    <div className={styles.headerDivider} />

                    <div className={styles.scrollContent}>
                        <div className={styles.filterGroups}>
                            <div className={styles.section}>
                                <h3>Select Date Range</h3>
                                <div className={styles.dateRow} onClick={() => setIsDatePickerOpen(true)}>
                                    <div className={styles.dateInput}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.6667 2.66675H3.33333C2.59695 2.66675 2 3.2637 2 4.00008V13.3334C2 14.0698 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0698 14 13.3334V4.00008C14 3.2637 13.403 2.66675 12.6667 2.66675Z" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M10.6667 1.33325V3.99992" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M5.33325 1.33325V3.99992" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M2 6.66675H14" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span>{formatDisplayDate(dateRange.from)}</span>
                                    </div>
                                    <span className={styles.dateSeparator}>To</span>
                                    <div className={styles.dateInput}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.6667 2.66675H3.33333C2.59695 2.66675 2 3.2637 2 4.00008V13.3334C2 14.0698 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0698 14 13.3334V4.00008C14 3.2637 13.403 2.66675 12.6667 2.66675Z" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M10.6667 1.33325V3.99992" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M5.33325 1.33325V3.99992" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M2 6.66675H14" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span>{formatDisplayDate(dateRange.to)}</span>
                                    </div>
                                </div>
                            </div>

                            <FilterSection 
                                title="Wallet Type"
                                options={walletTypeOptions}
                                selectedValues={walletTypes}
                                onToggle={toggleArrayItem(setWalletTypes)}
                                grid={true}
                            />

                            <FilterSection 
                                title="Transaction Type"
                                options={transactionTypeOptions}
                                selectedValues={transactionTypes}
                                onToggle={toggleArrayItem(setTransactionTypes)}
                                grid={true}
                            />

                            <FilterSection 
                                title="Earning Type"
                                options={earningTypeOptions}
                                selectedValues={earningTypes}
                                onToggle={toggleArrayItem(setEarningTypes)}
                            />

                            <FilterSection 
                                title="Status"
                                options={statusOptions}
                                selectedValues={statuses}
                                onToggle={toggleArrayItem(setStatuses)}
                            />
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button className={styles.applyBtn} onClick={handleApply}>
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            <DateRangePicker 
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                onApply={(range) => setDateRange(range)}
                initialFrom={dateRange.from}
                initialTo={dateRange.to}
            />
        </>
    )
}
