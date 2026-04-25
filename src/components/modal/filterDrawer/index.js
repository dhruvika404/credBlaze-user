import React, { useState } from 'react';
import styles from './filterDrawer.module.scss';
import CloseIcon from '@/icons/closeIcon';
import SearchIcon from '@/icons/searchIcon';

const FilterCheckbox = ({ label, checked, onChange, icon }) => (
    <label className={styles.gridItem}>
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
        />
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

export default function FilterDrawer({ isOpen, onClose }) {
    const [selectedTaskTypes, setSelectedTaskTypes] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [taskTypesState, setTaskTypesState] = useState({ pro: false, nonPro: false });

    const handlePriceChange = (value, setter) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue.length <= 10) {
            setter(numericValue);
        }
    };

    if (!isOpen) return null;

    const taskTypes = [
        'Select All', 'Subscribe',
        'Add Review', 'Signup on Website', 'Share', 'Signup on app',
        'Visit a website', 'Join A Channel', 'Pro Tasks Only', 'Refer Friends',
        'React to a message', 'Upvote', 'Purchase a Product', 'Others'
    ];

    const platforms = [
        { name: 'Select All', icon: null },
        { name: 'Instagram', icon: '/assets/platforms/instagram.svg' },
        { name: 'facebook', icon: '/assets/platforms/facebook.svg' },
        { name: 'YouTube', icon: '/assets/platforms/utube.svg' },
        { name: 'X (Twitter)', icon: '/assets/platforms/twitter.svg' },
        { name: 'TikTok', icon: '/assets/platforms/tikTok.svg' },
        { name: 'LinkedIn', icon: '/assets/platforms/linkedIn.svg' },
        { name: 'Telegram', icon: '/assets/platforms/telegram.svg' },
        { name: 'Discord', icon: '/assets/platforms/discord.svg' },
        { name: 'Whatsapp', icon: '/assets/platforms/whatsapp.svg' },
        { name: 'Pinterest', icon: '/assets/platforms/pinterest.svg' },
        { name: 'Reddit', icon: '/assets/platforms/reddit.svg' },
        { name: 'Medium', icon: '/assets/platforms/medium.svg' },
        { name: 'Quora', icon: '/assets/platforms/quora.svg' },
        { name: 'Twitch', icon: '/assets/platforms/twitch.svg' },
        { name: 'Kick', icon: '/assets/platforms/kick.svg' },
        { name: 'Rumble', icon: '/assets/platforms/rumble.svg' },
        { name: 'Play Store', icon: '/assets/platforms/playStore.svg' },
        { name: 'App Store', icon: '/assets/platforms/apple.svg' },
        { name: 'Others', icon: null }
    ];

    const toggleItem = (item, selectedList, setSelectedList, allItems) => {
        if (item === 'Select All') {
            if (selectedList.length === allItems.length) {
                setSelectedList([]);
            } else {
                setSelectedList([...allItems]);
            }
            return;
        }

        if (selectedList.includes(item)) {
            setSelectedList(selectedList.filter(i => i !== item));
        } else {
            setSelectedList([...selectedList, item]);
        }
    };

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
                                <input
                                    type="checkbox"
                                    checked={taskTypesState.pro}
                                    onChange={() => setTaskTypesState(prev => ({ ...prev, pro: !prev.pro }))}
                                />
                                <div className={styles.customCheckbox}>
                                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span>Pro Tasks</span>
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={taskTypesState.nonPro}
                                    onChange={() => setTaskTypesState(prev => ({ ...prev, nonPro: !prev.nonPro }))}
                                />
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
                                    <input
                                        type="text"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => handlePriceChange(e.target.value, setMinPrice)}
                                    />
                                </div>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => handlePriceChange(e.target.value, setMaxPrice)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.divider} />

                        {/* Task Type Grid */}
                        <div className={styles.section}>
                            <h3>Task Type</h3>
                            <div className={styles.taskTypeGrid}>
                                {taskTypes.map((type, index) => (
                                    <FilterCheckbox
                                        key={index}
                                        label={type}
                                        checked={selectedTaskTypes.includes(type) || (type === 'Select All' && selectedTaskTypes.length === taskTypes.length)}
                                        onChange={() => toggleItem(type, selectedTaskTypes, setSelectedTaskTypes, taskTypes)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className={styles.divider} />

                        {/* Platform Grid */}
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h3>Filter By Platform</h3>
                                <SearchIcon />
                            </div>
                            <div className={styles.platformGrid}>
                                {platforms.map((platform, index) => (
                                    <FilterCheckbox
                                        key={index}
                                        label={platform.name}
                                        icon={platform.icon}
                                        checked={selectedPlatforms.includes(platform.name) || (platform.name === 'Select All' && selectedPlatforms.length === platforms.map(p => p.name).length)}
                                        onChange={() => toggleItem(platform.name, selectedPlatforms, setSelectedPlatforms, platforms.map(p => p.name))}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.applyBtn} onClick={onClose}>
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}
