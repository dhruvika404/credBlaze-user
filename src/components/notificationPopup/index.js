'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './notificationPopup.module.scss';
import NotificationIcon from '@/icons/notificationIcon';
import { useNotification } from '@/context/NotificationContext';

const formatDateGroup = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }

        return new Intl.DateTimeFormat('en-GB', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    } catch (e) {
        return dateString;
    }
};

const formatRelativeTime = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHrs / 24);

        if (diffMins < 1) {
            return 'Just now';
        } else if (diffMins < 60) {
            return `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
        } else if (diffHrs < 24) {
            return `${diffHrs} ${diffHrs === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        } else {
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric'
            }).format(date);
        }
    } catch (e) {
        return '';
    }
};

const NotificationPopup = ({ isOpen, onClose, notifications = [], onSeenAll }) => {
    const [activeTab, setActiveTab] = useState('All Notifications');
    const { unseenCount } = useNotification();

    const tabs = ['All Notifications', 'Transactions', 'Alerts', 'Promotions'];

    useEffect(() => {
        if (isOpen && unseenCount > 0 && onSeenAll) {
            onSeenAll();
        }
    }, [isOpen, unseenCount, onSeenAll]);

    const filteredNotifications = notifications.filter(item => {
        if (activeTab === 'All Notifications') return true;

        const type = item.notification_type;
        if (activeTab === 'Transactions') {
            return ['transaction', 'transaction_cancle', 'spin_rewards', 'referral_earnings'].includes(type);
        }
        if (activeTab === 'Alerts') {
            return ['submission_alerts', 'campaign_alerts', 'tasks_alerts'].includes(type);
        }
        if (activeTab === 'Promotions') {
            return ['promotions'].includes(type);
        }
        return false;
    });

    const groupedMap = {};
    filteredNotifications.forEach(item => {
        const dateLabel = formatDateGroup(item.created_at);
        if (!groupedMap[dateLabel]) {
            groupedMap[dateLabel] = [];
        }
        groupedMap[dateLabel].push(item);
    });

    const groupsArray = Object.keys(groupedMap).map((date, idx) => ({
        id: idx,
        date: date,
        items: groupedMap[date]
    }));

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.popupOverlay}>
                    <motion.div
                        className={styles.popupContent}
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.header}>
                            <h2>Notifications</h2>
                            <button className={styles.closeButton} onClick={onClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <div className={styles.tabContainer}>
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className={styles.scrollArea}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {groupsArray.length > 0 ? (
                                        groupsArray.map((group) => (
                                            <div key={group.id} className={styles.dateGroup}>
                                                <span className={styles.dateLabel}>{group.date}</span>
                                                <div className={styles.notificationList}>
                                                    {group.items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className={`${styles.notificationItem} ${!item.is_seen ? styles.unseen : ''}`}
                                                        >
                                                            <div className={`${styles.iconBox} ${styles.iconDefault}`}>
                                                                <NotificationIcon />
                                                            </div>
                                                            <div className={styles.content}>
                                                                <div className={styles.topRow}>
                                                                    <h3>{item.title}</h3>
                                                                    <div className={styles.timeContainer}>
                                                                        <span className={styles.time}>{formatRelativeTime(item.created_at)}</span>
                                                                        {!item.is_seen && <span className={styles.unseenDot} />}
                                                                    </div>
                                                                </div>
                                                                <p>{item.body}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '60px 0', color: '#625F6E' }}>
                                            No notifications found in {activeTab}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NotificationPopup;
