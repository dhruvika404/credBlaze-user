'use client'
import React, { useState, useEffect } from 'react';
import styles from './myLogins.module.scss';
import LogoutIcon from '../../icons/logoutIcon';
import { getUserActivity, logout, deleteAccount } from '@/services/auth';
import LogoutModal from '@/components/modal/logoutModal';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';


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
    const { logout: clearLocalAuth, token, deviceId } = useAuth();
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: '',
        loading: false,
        data: null
    });

    const fetchActivities = async () => {
        try {
            const res = await getUserActivity({}, token || '');
            const activityList = res?.data?.activities
            if (Array.isArray(activityList)) {
                setActivities(activityList.filter(activity => activity.device_id !== deviceId));
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
        if (deviceId) {
            fetchActivities();
        }
    }, [deviceId]);

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

    const openConfirmModal = (type, data = null) => {
        setModalConfig({
            isOpen: true,
            type,
            loading: false,
            data
        });
    };

    const closeConfirmModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const handleConfirmAction = async () => {
        setModalConfig(prev => ({ ...prev, loading: true }));
        try {
            if (modalConfig.type === 'delete') {
                await deleteAccount();
                toast.success('Account deleted successfully');
                clearLocalAuth();
            } else if (modalConfig.type === 'single' || modalConfig.type === 'multi') {
                let tokensToLogout = [];
                let idsToRemove = [];
                if (modalConfig.type === 'single') {
                    tokensToLogout = [modalConfig.data];
                } else if (modalConfig.data && modalConfig.data.length > 0) {
                    tokensToLogout = modalConfig.data.map(id => {
                        const activity = activities.find(a => (a.id || activities.indexOf(a)) === id);
                        return activity?.access_token || activity?.token;
                    }).filter(Boolean);
                    idsToRemove = modalConfig.data;
                } else {
                    tokensToLogout = activities.map(a => a.access_token || a.token).filter(Boolean);
                }

                const payload = { access_tokens: tokensToLogout };
                await logout(payload);
                toast.success('Logged out successfully');
                fetchActivities();
                if (modalConfig.type === 'multi') {
                    setSelectedActivities(prev => prev.filter(id => !idsToRemove.includes(id)));
                }
            }
            closeConfirmModal();
        } catch (error) {
            toast.error(error?.message || `Failed to ${modalConfig.type}`);
        } finally {
            setModalConfig(prev => ({ ...prev, loading: false }));
        }
    };

    const getModalProps = () => {
        switch (modalConfig.type) {
            case 'delete':
                return {
                    title: 'Delete Account',
                    description: 'Are you sure want to Delete Account ?',
                    confirmText: 'Yes, Delete Account',
                    isDanger: true
                };
            case 'single':
                return {
                    title: 'Logout Session',
                    description: 'Are you sure you want to logout from this session?',
                    confirmText: 'Yes, Logout',
                    isDanger: true
                };
            case 'multi':
                return {
                    title: modalConfig.data && modalConfig.data.length > 0 ? 'Logout Selected Sessions' : 'Logout All Sessions',
                    description: modalConfig.data && modalConfig.data.length > 0
                        ? `Are you sure you want to logout from ${modalConfig.data.length} selected session${modalConfig.data.length > 1 ? 's' : ''}?`
                        : `Are you sure you want to logout from all other sessions?`,
                    confirmText: 'Yes, Logout',
                    isDanger: true
                };
            default:
                return {};
        }
    };

    return (
        <div className={styles.myLoginsContainer}>
            {/* Account Activities Section */}
            <div className={styles.section}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <h2>Account Activities</h2>
                        <p>Monitor and manage all your active devices.</p>
                    </div>
                    <button
                        className={`${styles.primaryBtn} ${activities.length === 0 ? styles.primaryBtnDisabled : ''}`}
                        onClick={() => openConfirmModal('multi', selectedActivities.length > 0 ? [...selectedActivities] : null)}
                        disabled={activities.length === 0}
                    >
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
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => {
                                                    const token = activity.access_token || activity.token;
                                                    openConfirmModal('single', token);
                                                }}
                                            >
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
                    <button
                        className={styles.primaryBtn}
                        onClick={() => openConfirmModal('delete')}
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            <LogoutModal
                {...getModalProps()}
                isOpen={modalConfig.isOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirmAction}
                loading={modalConfig.loading}
            />
        </div>
    );
}
