'use client'
import React, { useState, useEffect } from 'react';
import styles from './notifications.module.scss';
import { updateNotificationPreference } from '@/services/notification';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const notificationData = [
    {
        id: 'tasks_alerts',
        title: 'Task Alerts',
        description: 'Get notified about new and completed tasks'
    },
    {
        id: 'spin_rewards',
        title: 'Spin Rewards',
        description: 'Notifications for spin wins and bonuses'
    },
    {
        id: 'referral_earnings',
        title: 'Referral Earnings',
        description: 'When someone joins via your referral'
    },
    {
        id: 'transaction_cancle',
        title: 'Transaction Cancelled',
        description: 'Sent automatically to the customer if their order is cancelled (if you select this option).'
    },
    {
        id: 'transaction',
        title: 'Transactions',
        description: 'Deposits, withdrawals and transfers'
    },
    {
        id: 'promotions',
        title: 'Promotions',
        description: 'Special offers and campaigns'
    }
];

export default function Notifications() {
    const { user } = useAuth();
    const [loading, setLoading] = useState({});
    const [settings, setSettings] = useState(
        notificationData.reduce((acc, item) => ({ ...acc, [item.id]: false }), {})
    );

    useEffect(() => {
        if (user?.notification_preferences) {
            setSettings(prev => {
                const newSettings = { ...prev };
                Object.keys(user.notification_preferences).forEach(key => {
                    if (newSettings.hasOwnProperty(key)) {
                        newSettings[key] = user.notification_preferences[key];
                    }
                });
                return newSettings;
            });
        }
    }, [user]);

    const handleToggle = async (id) => {
        const newStatus = !settings[id];
        setSettings(prev => ({
            ...prev,
            [id]: newStatus
        }));

        setLoading(prev => ({ ...prev, [id]: true }));

        try {
            await updateNotificationPreference(id, newStatus);
        } catch (error) {
            setSettings(prev => ({
                ...prev,
                [id]: !newStatus
            }));
            toast.error(error?.message || 'Failed to update preference');
        } finally {
            setLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className={styles.notifications}>
            {notificationData.map((item) => (
                <div key={item.id} className={styles.notificationItem}>
                    <div className={styles.content}>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>
                    <label className={`${styles.toggleSwitch} ${loading[item.id] ? styles.disabled : ''}`}>
                        <input
                            type="checkbox"
                            checked={settings[item.id]}
                            onChange={() => !loading[item.id] && handleToggle(item.id)}
                            disabled={loading[item.id]}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            ))}
        </div>
    );
}
