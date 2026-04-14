'use client'
import React, { useState } from 'react';
import styles from './notifications.module.scss';

const notificationData = [
    {
        id: 'taskAlerts',
        title: 'Task Alerts',
        description: 'Get notified about new and completed tasks',
        initialValue: true
    },
    {
        id: 'spinRewards',
        title: 'Spin Rewards',
        description: 'Notifications for spin wins and bonuses',
        initialValue: false
    },
    {
        id: 'referralEarnings',
        title: 'Referral Earnings',
        description: 'When someone joins via your referral',
        initialValue: true
    },
    {
        id: 'transactionCancelled',
        title: 'Transaction Cancelled',
        description: 'Sent automatically to the customer if their order is cancelled (if you select this option).',
        initialValue: true
    },
    {
        id: 'transactions',
        title: 'Transactions',
        description: 'Deposits, withdrawals and transfers',
        initialValue: true
    },
    {
        id: 'promotions',
        title: 'Promotions',
        description: 'Special offers and campaigns',
        initialValue: false
    }
];

export default function Notifications() {
    const [settings, setSettings] = useState(
        notificationData.reduce((acc, item) => ({ ...acc, [item.id]: item.initialValue }), {})
    );

    const handleToggle = (id) => {
        setSettings(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className={styles.notifications}>
            {notificationData.map((item) => (
                <div key={item.id} className={styles.notificationItem}>
                    <div className={styles.content}>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>
                    <label className={styles.toggleSwitch}>
                        <input
                            type="checkbox"
                            checked={settings[item.id]}
                            onChange={() => handleToggle(item.id)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            ))}
        </div>
    );
}
