import React from 'react'
import SettingSidebar from '@/components/settingSidebar'
import SettingsHeader from './SettingsHeader'
import styles from './settings.module.scss'

export default function SettingsLayout({ children }) {
    return (
        <div className={styles.settingsWrapper}>
            <SettingsHeader />
            <div className={styles.settingsLayout}>
                <div className={styles.sidebar}>
                    <SettingSidebar />
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    )
}
