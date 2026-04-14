import React from 'react'
import styles from './kycVerification.module.scss';
import DangerIcon from '@/icons/dangerIcon';
export default function KycVerification() {
    return (
        <div className={styles.kycVerification}>
            <div className={styles.kycheader}>
                <DangerIcon />
                <h3>KYC Verification Pending</h3>
            </div>
            <p>
                Please complete identify verification to enable deposits, withdrawals and conversions for a seamless user experience.
            </p>
        </div>
    )
}
