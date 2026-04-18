'use client'
import React, { useState, useEffect } from 'react';
import styles from './myLogins.module.scss';
import LogoutIcon from '../../icons/logoutIcon';
import { getUserActivity } from '@/services/auth';


const ChromeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C16.97 0 21.24 3.02 23.03 7.33L16.29 19.33L10.33 9H20.66C19.14 5.38 15.86 3 12 3C9.33 3 6.94 4.31 5.46 6.37L2.4 1.05C4.79 0.38 7.34 0 10 0H12ZM2.52 7.07L8.4 17.33L5.43 22.47C2.17 20 0 16.25 0 12C0 9.87 0.54 7.87 1.49 6.13L2.52 7.07ZM12 24C10.74 24 9.53 23.81 8.39 23.46L11.51 18L13.16 20.84L14.71 21.49L17.57 16.63L20.48 21.56C18.25 23.08 15.24 24 12 24Z" fill="#1C1B1F" />
        <circle cx="12" cy="12" r="3" fill="#1C1B1F" />
    </svg>
);

export default function MyLogins() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedActivities, setSelectedActivities] = useState([]);

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem('token') || '';
            const currentDeviceId = localStorage.getItem('device_id');
            const res = await getUserActivity({}, token);
            const activityList = res?.data || res?.payload || res || [];
            if (Array.isArray(activityList)) {
                setActivities(activityList.filter(activity => activity.device_id !== currentDeviceId));
            } else {
                setActivities([]);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleHeaderCheckboxChange = (e) => {
        if (e.target.checked) {
            setSelectedActivities(activities.map((a, i) => a.id || i));
        } else {
            setSelectedActivities([]);
        }
    };

    const handleRowCheckboxChange = (id) => {
        setSelectedActivities(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const isAllSelected = activities.length > 0 && selectedActivities.length === activities.length;

    return (
        <div className={styles.myLoginsContainer}>
            {/* Account Activities Section */}
            <div className={styles.section}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <h2>Account Activities</h2>
                        <p>Monitor and manage all your active devices.</p>
                    </div>
                    <button className={styles.primaryBtn}>
                        {selectedActivities.length > 0
                            ? `Log Out ${selectedActivities.length} Session${selectedActivities.length > 1 ? 's' : ''}`
                            : 'Log Out All Sessions'}
                    </button>
                </div>

                <div className={styles.tableContainer}>
                    <table>
                        <thead>
                            <tr>
                                <th className={styles.checkboxColumn}>
                                    <input
                                        type="checkbox"
                                        className={styles.customCheckbox}
                                        checked={isAllSelected}
                                        onChange={handleHeaderCheckboxChange}
                                    />
                                </th>
                                <th>Browser</th>
                                <th>Location</th>
                                <th>IP Address</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading activities...</td>
                                </tr>
                            ) : activities.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No active sessions.</td>
                                </tr>
                            ) : (
                                activities.map((activity, index) => (
                                    <tr key={activity.id || index}>
                                        <td className={styles.checkboxColumn}>
                                            <input
                                                type="checkbox"
                                                className={styles.customCheckbox}
                                                checked={selectedActivities.includes(activity.id || index)}
                                                onChange={() => handleRowCheckboxChange(activity.id || index)}
                                            />
                                        </td>
                                        <td className={styles.browserCell}>
                                            <div className={styles.iconWrapper}>
                                                <ChromeIcon />
                                            </div>
                                            {activity.browser || activity.device || '-'}
                                        </td>
                                        <td>{activity.location || activity.city || '-'}</td>
                                        <td>{activity.ip_address || activity.ip || '-'}</td>
                                        <td>
                                            <button className={styles.actionBtn}>
                                                <LogoutIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Account Section */}
            <div className={styles.section}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <h2>Delete Account</h2>
                        <p>Permanently delete your account and data</p>
                    </div>
                    <button className={styles.primaryBtn}>Delete Account</button>
                </div>
            </div>
        </div>
    );
}
