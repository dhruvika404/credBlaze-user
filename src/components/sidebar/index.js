'use client'
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import HelpIcon from '@/icons/helpIcon';
import LogoutIcon from '@/icons/logoutIcon';

const BlackLogo = '/assets/logo/black-logo.svg';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { href: '/tasks', label: 'Tasks', icon: <TasksIcon /> },
    { href: '/utilities', label: 'Utilities', icon: <UtilitiesIcon /> },
    { href: '/shop', label: 'Shop', icon: <ShopIcon /> },
    { href: '/spin-earn', label: 'Spin & Earn', icon: <SpinIcon /> },
    { href: '/referrals', label: 'Referrals', icon: <ReferralsIcon /> },
    { href: '/business-card', label: 'Business Card', icon: <CardIcon /> },
    { href: '/wallet', label: 'Wallet', icon: <WalletIcon /> },
    { href: '/settings', label: 'Settings', icon: <SettingIcon /> },
]

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <img src={BlackLogo} alt='BlackLogo' />
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
                    <div className={styles.featuresBox}>
                        <div className={styles.boxHeaderAlignment}>
                            <StarGroupIcon />
                            <h3>Unlock premium features</h3>
                        </div>
                        <p>
                            Get early access & high-paying tasks with Pro Membership
                        </p>
                        <button>Upgrade to Pro</button>
                    </div>
                    <div className={styles.asideFooter}>
                        <Link href='/help' className={styles.menu}>
                            <HelpIcon />
                            <span>Help & information</span>
                        </Link>
                        <div className={styles.menu}>
                            <LogoutIcon />
                            <span>Logout</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
