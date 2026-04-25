import React from 'react'
import styles from './kycpending.module.scss';

const BadgeIcon = '/assets/icons/badge.svg';

export default function Kycpending() {
    return (
        <div className={styles.kycpending}>
            <img src={BadgeIcon} alt='BadgeIcon' />
            <div>
                <h2>
                    KYC Pending
                </h2>
                <p>
                    Your KYC information needs to be updated to ensure continued access to
                    all features. Please provide the latest documents for verification
                </p>
            </div>
        </div>
    )
}
