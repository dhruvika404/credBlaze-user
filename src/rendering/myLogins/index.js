import React from 'react';
import styles from './myLogins.module.scss';
import LogoutIcon from '../../icons/logoutIcon';

const activitiesData = [
    {
        id: 1,
        browser: 'Google Chrome',
        location: 'Mumbai, India',
        ip: '212.021.01',
    },
    {
        id: 2,
        browser: 'Google Chrome',
        location: 'Mumbai, India',
        ip: '212.021.01',
    },
    {
        id: 3,
        browser: 'Google Chrome',
        location: 'Mumbai, India',
        ip: '212.021.01',
    }
];

const ChromeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C16.97 0 21.24 3.02 23.03 7.33L16.29 19.33L10.33 9H20.66C19.14 5.38 15.86 3 12 3C9.33 3 6.94 4.31 5.46 6.37L2.4 1.05C4.79 0.38 7.34 0 10 0H12ZM2.52 7.07L8.4 17.33L5.43 22.47C2.17 20 0 16.25 0 12C0 9.87 0.54 7.87 1.49 6.13L2.52 7.07ZM12 24C10.74 24 9.53 23.81 8.39 23.46L11.51 18L13.16 20.84L14.71 21.49L17.57 16.63L20.48 21.56C18.25 23.08 15.24 24 12 24Z" fill="#1C1B1F" />
        <circle cx="12" cy="12" r="3" fill="#1C1B1F" />
    </svg>
);

export default function MyLogins() {
    return (
        <div className={styles.myLoginsContainer}>
            {/* Account Activities Section */}
            <div className={styles.section}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <h2>Account Activities</h2>
                        <p>Monitor and manage all your active devices.</p>
                    </div>
                    <button className={styles.primaryBtn}>Log Out All Sessions</button>
                </div>

                <div className={styles.tableContainer}>
                    <table>
                        <thead>
                            <tr>
                                <th className={styles.checkboxColumn}>
                                    <input type="checkbox" className={styles.customCheckbox} />
                                </th>
                                <th>Browser</th>
                                <th>Location</th>
                                <th>IP Address</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {activitiesData.map((activity) => (
                                <tr key={activity.id}>
                                    <td className={styles.checkboxColumn}>
                                        <input type="checkbox" className={styles.customCheckbox} />
                                    </td>
                                    <td className={styles.browserCell}>
                                        <div className={styles.iconWrapper}>
                                            <ChromeIcon />
                                        </div>
                                        {activity.browser}
                                    </td>
                                    <td>{activity.location}</td>
                                    <td>{activity.ip}</td>
                                    <td>
                                        <button className={styles.actionBtn}>
                                            <LogoutIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
