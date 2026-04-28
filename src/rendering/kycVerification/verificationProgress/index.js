'use client';
import React from 'react'
import { useRouter } from 'next/navigation';
import styles from './verificationProgress.module.scss';
import Button from '@/components/button';
const ProgressIcon = '/assets/icons/Progress.svg';

export default function VerificationProgress() {
    const router = useRouter();

    const handleGoToDashboard = () => {
        router.push('/dashboard');
    };

    return (
        <div className={styles.verificationProgress}>
            <div className={styles.centerbox}>
                <div className={styles.centerAlignment}>
                    <img src={ProgressIcon} alt="ProgressIcon" />
                </div>
                <h2>
                    Verification in Progress
                </h2>
                <p>
                    Your documents have been securely submitted and are currently under review. This usually takes
                    24-48 hours.
                </p>
                <div className={styles.buttonTop}>
                    <Button text="Go to Dashboard" onClick={handleGoToDashboard} />
                </div>
            </div>
        </div>
    )
}
