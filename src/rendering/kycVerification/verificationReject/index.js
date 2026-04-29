'use client';
import React from 'react'
import styles from './verificationReject.module.scss';
import Button from '@/components/button';
const RejectIcon = '/assets/icons/RejectInfo.svg';

export default function VerificationReject({ rejectionReason, onReupload, onCancel }) {
    return (
        <div className={styles.verificationProgress}>
            <div className={styles.centerbox}>
                <div className={styles.centerAlignment}>
                    <img src={RejectIcon} alt="RejectIcon" />
                </div>
                <h2>
                    KYC Rejected.
                </h2>
                <p>
                    {rejectionReason || 'Your KYC verification was rejected. Please review your documents and try again with clear and valid information.'}
                </p>
                <div className={styles.buttonGrid}>
                    <Button text="Cancel" lightbutton onClick={onCancel} />
                    <Button text="Re-upload" onClick={onReupload} />
                </div>
            </div>
        </div>
    )
}
