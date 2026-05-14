import React from 'react'
import styles from './successfulWithdrawal.module.scss';
import Button from '@/components/button';
const SuccessfulImage = '/assets/images/successful.svg';

export default function SuccessfulWithdrawal() {
    return (
        <div className={styles.successfulWithdrawal}>
            <div className={styles.modal}>
                <div className={styles.centerImage}>
                    <img src={SuccessfulImage} alt='SuccessfulImage' />
                </div>
                <h2>
                    successful withdrawal
                </h2>
                <div className={styles.detailsAlignment}>
                    <div className={styles.row}>
                        <span className={styles.label}>Requested Amount</span>
                        <span className={styles.amount}>₹ 10,000</span>
                    </div>
                    <div className={styles.grid}>
                        <div className={styles.item}>
                            <span className={styles.label}>Date</span>
                            <span className={styles.text}>feb 06, 2026</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>Time</span>
                            <span className={styles.text}>11:20 AM</span>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Withdrawal Status</span>
                        <div className={styles.statusPill}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>Successful</span>
                        </div>
                    </div>
                </div>
                <div className={styles.buttonTop}>
                    <Button text="Back To Home" lightbutton />
                </div>
            </div>
        </div>
    )
}
