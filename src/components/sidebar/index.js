'use client'
import React, { useEffect } from 'react'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './sidebar.module.scss';
import DashboardIcon from '@/icons/dashboardIcon';
import TasksIcon from '@/icons/tasksIcon';
import UtilitiesIcon from '@/icons/utilitiesIcon';
import ShopIcon from '@/icons/shopIcon';
import SpinIcon from '@/icons/spinIcon';
import ReferralsIcon from '@/icons/referralsIcon';
import CardIcon from '@/icons/cardIcon';
import WalletIcon from '@/icons/walletIcon';
import SettingIcon from '@/icons/settingIcon';
import StarGroupIcon from '@/icons/starGroupIcon';
import SupportIcon from '@/icons/supportIcon';
import LogoutIcon from '@/icons/logoutIcon';
import LogoutModal from '@/components/modal/logoutModal';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { logout as logoutApi } from '@/services/auth';
import { toast } from 'react-hot-toast';

const BlackLogo = '/assets/logo/black-logo.svg';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { href: '/tasks', label: 'Tasks', icon: <TasksIcon /> },
    // { href: '/utilities', label: 'Utilities', icon: <UtilitiesIcon /> },
    // { href: '/shop', label: 'Shop', icon: <ShopIcon /> },
    { href: '/spin-earn', label: 'Spin & Earn', icon: <SpinIcon /> },
    { href: '/referral-invitation', label: 'Referrals', icon: <ReferralsIcon /> },
    // { href: '/business-card', label: 'Business Card', icon: <CardIcon /> },
    { href: '/wallet', label: 'Wallet', icon: <WalletIcon /> },
    { href: '/settings', label: 'Settings', icon: <SettingIcon /> },
]

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { logout: clearLocalAuth, token, user } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
        const handleToggle = () => setIsOpen(prev => !prev);
        const handleClose = () => setIsOpen(false);

        window.addEventListener('toggle-sidebar', handleToggle);
        window.addEventListener('close-sidebar', handleClose);

        return () => {
            window.removeEventListener('toggle-sidebar', handleToggle);
            window.removeEventListener('close-sidebar', handleClose);
        };
    }, []);

  useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        setLoading(true);
        try {
            const payload = { access_tokens: token ? [token] : [] };
            await logoutApi(payload);
            toast.success('Logged out successfully');
            clearLocalAuth();
        } catch (error) {
            toast.error(error?.message || 'Failed to logout');
            clearLocalAuth();
        } finally {
            setLoading(false);
            setIsLogoutModalOpen(false);
        }
    };

    return (
        <>
            {isOpen && <div className={styles.mobileOverlay} onClick={() => setIsOpen(false)} />}
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.mobileCloseBtn} onClick={() => setIsOpen(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.1798 9.99952L15.5907 5.58872C15.9165 5.26289 15.9165 4.73622 15.5907 4.41039C15.2648 4.08456 14.7382 4.08456 14.4123 4.41039L10.0015 8.82118L5.59068 4.41039C5.26484 4.08456 4.73818 4.08456 4.41234 4.41039C4.08651 4.73622 4.08651 5.26289 4.41234 5.58872L8.82317 9.99952L4.41234 14.4104C4.08651 14.7362 4.08651 15.2628 4.41234 15.5887C4.57484 15.7512 4.78818 15.8328 5.00151 15.8328C5.21484 15.8328 5.42818 15.7512 5.59068 15.5887L10.0015 11.1779L14.4123 15.5887C14.5748 15.7512 14.7882 15.8328 15.0015 15.8328C15.2148 15.8328 15.4282 15.7512 15.5907 15.5887C15.9165 15.2628 15.9165 14.7362 15.5907 14.4104L11.1798 9.99952Z" fill="#3D3D3D" />
                    </svg>
                </div>
                <div className={styles.logo}>
                    <Link href='/dashboard'>
                        <img src={BlackLogo} alt='BlackLogo' />
                    </Link>
                </div>
                <div className={styles.allMenubody}>
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`${styles.menu} ${isActive ? styles.active : ''}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
                <div>
                    <div className={styles.sidebarFooter}>
                        {!user?.is_prime && (
                            <div className={styles.featuresBox}>
                                <div className={styles.boxHeaderAlignment}>
                                    <StarGroupIcon />
                                    <h3>Unlock premium features</h3>
                                </div>
                                <p>
                                    Get early access & high-paying tasks with Pro Membership
                                </p>
                                <button onClick={() => router.push('/settings/plan-pricing')}>Upgrade to Pro</button>
                            </div>
                        )}
                        <div className={styles.asideFooter}>
                            <Link
                                href='/support-tickets'
                                className={`${styles.menu} ${pathname === '/support-tickets' || pathname.startsWith('/support-tickets') ? styles.active : ''}`}
                            >
                                <SupportIcon />
                                <span>Support Ticket</span>
                            </Link>
                            <div className={styles.menu} onClick={() => setIsLogoutModalOpen(true)}>
                                <LogoutIcon />
                                <span>Logout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                loading={loading}
            />
        </>
    )
}
