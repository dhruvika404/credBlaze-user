import React, { useState, useEffect } from 'react';
import styles from './filterDrawer.module.scss';
import CloseIcon from '@/icons/closeIcon';
import SearchIcon from '@/icons/searchIcon';
import { getCategories, getPlatforms } from '@/services/task';

const FilterCheckbox = ({ label, checked, onChange, icon }) => (
    <label className={styles.gridItem}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <div className={styles.box}>
            {checked && (
                <svg width="10" height="8" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </div>
        {icon && (
            <div className={styles.platformIcon}>
                <img src={icon} alt={label} />
            </div>
        )}
        <span>{label}</span>
    </label>
);

export default function FilterDrawer({ isOpen, onClose, initialFilters, onApplyFilters }) {
    const [selectedTaskTypes, setSelectedTaskTypes] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [taskTypesState, setTaskTypesState] = useState({ pro: false, nonPro: false });
    const [categories, setCategories] = useState([]);
    const [platforms, setPlatforms] = useState([]);

    useEffect(() => {
        if (!isOpen) return;
        setSelectedTaskTypes(initialFilters?.taskTypes || []);
        setSelectedPlatforms(initialFilters?.platforms || []);
        setMinPrice(initialFilters?.minPrice || '');
        setMaxPrice(initialFilters?.maxPrice || '');
        setTaskTypesState({ pro: initialFilters?.pro || false, nonPro: initialFilters?.nonPro || false });
        getCategories().then(res => {
            if (res.success) setCategories(res.data?.categories || []);
        });
        getPlatforms().then(res => {
            if (res.success) setPlatforms(res.data?.platforms || []);
        });
    }, [isOpen]);

    const handlePriceChange = (value, setter) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue.length <= 10) setter(numericValue);
    };

    const toggleItem = (id, selectedList, setSelectedList) => {
        if (selectedList.includes(id)) {
            setSelectedList(selectedList.filter(i => i !== id));
        } else {
            setSelectedList([...selectedList, id]);
        }
    };

    const handleApply = () => {
        onApplyFilters?.({
            taskTypes: selectedTaskTypes,
            platforms: selectedPlatforms,
            minPrice,
            maxPrice,
            pro: taskTypesState.pro,
            nonPro: taskTypesState.nonPro,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Filters</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>

                <div className={styles.headerDivider} />

                <div className={styles.scrollContent}>
                    <div className={styles.filterGroups}>
                        {/* Membership Filters */}
                        <div className={styles.topFilters}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" checked={taskTypesState.pro} onChange={() => setTaskTypesState(prev => ({ ...prev, pro: !prev.pro }))} />
                                <div className={styles.customCheckbox}>
                                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span>Pro Tasks</span>
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" checked={taskTypesState.nonPro} onChange={() => setTaskTypesState(prev => ({ ...prev, nonPro: !prev.nonPro }))} />
                                <div className={styles.customCheckbox}>
                                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span>Non Pro Tasks</span>
                            </label>
                        </div>

                        <div className={styles.divider} />

                        {/* Price Range */}
                        <div className={styles.section}>
                            <h3>Price, ₹</h3>
                            <div className={styles.priceInputs}>
                                <div className={styles.inputWrapper}>
                                    <input type="text" placeholder="Min" value={minPrice} onChange={(e) => handlePriceChange(e.target.value, setMinPrice)} />
                                </div>
                                <div className={styles.inputWrapper}>
                                    <input type="text" placeholder="Max" value={maxPrice} onChange={(e) => handlePriceChange(e.target.value, setMaxPrice)} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.divider} />

                        {/* Task Type Grid — from API */}
                        <div className={styles.section}>
                            <h3>Task Type</h3>
                            <div className={styles.taskTypeGrid}>
                                {categories.map((cat) => (
                                    <FilterCheckbox
                                        key={cat.id}
                                        label={cat.category_name}
                                        checked={selectedTaskTypes.includes(cat.id)}
                                        onChange={() => toggleItem(cat.id, selectedTaskTypes, setSelectedTaskTypes)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className={styles.divider} />

                        {/* Platform Grid — from API */}
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h3>Filter By Platform</h3>
                                <SearchIcon />
                            </div>
                            <div className={styles.platformGrid}>
                                {platforms.map((platform) => (
                                    <FilterCheckbox
                                        key={platform.id}
                                        label={platform.platform_name}
                                        icon={platform.platform_logo_url}
                                        checked={selectedPlatforms.includes(platform.id)}
                                        onChange={() => toggleItem(platform.id, selectedPlatforms, setSelectedPlatforms)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.applyBtn} onClick={handleApply}>
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}
