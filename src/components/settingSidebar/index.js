'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './settingSidebar.module.scss'
import SettingIcon from '@/icons/settingIcon'
import KycIcon from '@/icons/kycIcon'
import KeyIcon from '@/icons/keyIcon'
import LocationIcon from '@/icons/locationIcon'
import PayoutIcon from '@/icons/payoutIcon'
import PlanIcon from '@/icons/planIcon'
import BillingIcon from '@/icons/billingIcon'
import NotificationIcon from '@/icons/notificationIcon'
import LoginsIcon from '@/icons/loginsIcon'
import SupportIcon from '@/icons/supportIcon'

const menuItems = [
    { icon: <SettingIcon />, label: 'Profile Info', href: '/settings' },
    { icon: <KycIcon />, label: 'KYC & Verification', href: '/settings/kyc-verification' },
    { icon: <KeyIcon />, label: 'Change Password', href: '/settings/change-password' },
    { icon: <LocationIcon />, label: 'Address', href: '/settings/address' },
    { icon: <PayoutIcon />, label: 'Payout Accounts', href: '/settings/payout-accounts' },
    { icon: <PlanIcon />, label: 'Plan & Pricing', href: '/settings/plan-pricing' },
    { icon: <BillingIcon />, label: 'Billing', href: '/settings/billing' },
    { icon: <NotificationIcon />, label: 'Notification Preferences', href: '/settings/notifications' },
    { icon: <LoginsIcon />, label: 'My Logins', href: '/settings/my-logins' },
    { icon: <SupportIcon />, label: 'Legal & Support', href: '/settings/legal-support' },
]

export default function SettingSidebar() {
    const pathname = usePathname()

    return (
        <div className={styles.settingSidebar}>
            {menuItems.map((item, index) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={index}
                        href={item.href}
                        className={`${styles.menu} ${isActive ? styles.active : styles.inactive}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                )
            })}
        </div>
    )
}
