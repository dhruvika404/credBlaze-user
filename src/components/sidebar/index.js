import React from 'react'
import Link from 'next/link';
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
export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <img src={BlackLogo} alt='BlackLogo' />
            </div>
            <div className={styles.allMenubody}>
                <Link href='/dashboard' className={styles.menu}>
                    <DashboardIcon />
                    <span>Dashboard</span>
                </Link>
                <Link href='/tasks' className={styles.menu}>
                    <TasksIcon />
                    <span>Tasks</span>
                </Link>
                <Link href='/utilities' className={styles.menu}>
                    <UtilitiesIcon />
                    <span>Utilities</span>
                </Link>
                <Link href='/shop' className={styles.menu}>
                    <ShopIcon />
                    <span>Shop</span>
                </Link>
                <Link href='/spin-earn' className={styles.menu}>
                    <SpinIcon />
                    <span>Spin & Earn</span>
                </Link>
                <Link href='/referrals' className={styles.menu}>
                    <ReferralsIcon />
                    <span>Referrals</span>
                </Link>
                <Link href='/business-card' className={styles.menu}>
                    <CardIcon />
                    <span>Business Card</span>
                </Link>
                <Link href='/wallet' className={styles.menu}>
                    <WalletIcon />
                    <span>Wallet</span>
                </Link>
                <Link href='/settings' className={styles.menu}>
                    <SettingIcon />
                    <span>Settings</span>
                </Link>
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
