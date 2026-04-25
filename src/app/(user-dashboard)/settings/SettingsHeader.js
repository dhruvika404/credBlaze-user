'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import styles from './settings.module.scss'
import TutorialVideoModal from '@/components/modal/tutorialVideoModal'

const YoutubeIcon = '/assets/platforms/utube.svg'

const headers = {
    '/settings': { title: 'Profile Information', subtitle: 'Invite friends and earn together!' },
    '/settings/kyc-verification': { title: 'KYC & Verification', subtitle: 'Complete KYC to enable withdrawals and survey participation.' },
    '/settings/change-password': { title: 'Change Password', subtitle: 'Modify your current password.' },
    '/settings/address': { title: 'Address', subtitle: 'Manage your address details.' },
    '/settings/delivery-addresses': { title: 'Address', subtitle: 'Complete KYC to enable withdrawals and survey participation.' },
    '/settings/payout-accounts': { title: 'Payout Accounts', subtitle: 'Manage your payout accounts.' },
    '/settings/plan-pricing': { title: 'Plan & Pricing', subtitle: 'View and manage your plan.' },
    '/settings/billing': { title: 'Billing', subtitle: 'Manage your billing information.' },
    '/settings/notifications': { title: 'Notification Preferences', subtitle: 'Control how you receive notifications.' },
    '/settings/my-logins': { title: 'My Logins', subtitle: 'View your active login sessions.' },
    '/settings/legal-support': { title: 'Legal & Support', subtitle: 'Legal information and support resources.' },
}

export default function SettingsHeader() {
    const pathname = usePathname()
    const { title, subtitle } = headers[pathname] || { title: 'Settings', subtitle: '' }
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={styles.pageHeader}>
            <div className={styles.headerTitle}>
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>
            <div className={styles.watch}>
                <button onClick={() => setIsModalOpen(true)}>
                    <img src={YoutubeIcon} alt="Watch tutorial" />
                    Watch Tutorial video
                </button>
            </div>
            <TutorialVideoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}
