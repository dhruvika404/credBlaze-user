import React from 'react'
import styles from './kycpending.module.scss';
const BadgePending = '/assets/icons/badge-pending.svg';

export default function KycPending() {
    return (
        <div className={styles.kycpending}>
            <div className={styles.icon}>
                <img src={BadgePending} alt='BadgePending' />
            </div>
            <div>
                <h3>
                    KYC Pending
                </h3>
                <p>
                    Your KYC information needs to be updated to ensure continued access to all features. Please provide the latest documents for verification
                </p>
            </div>
        </div>
    )
}
