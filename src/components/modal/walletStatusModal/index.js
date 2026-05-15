'use client'
import React, { useState, useEffect } from 'react'
import styles from './walletStatusModal.module.scss'
import InfoIcon from '@/icons/infoIcon';

export default function WalletStatusModal({ isOpen, onClose, status = 'pending', type = 'deposit', amount, expiryTime }) {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (status === 'pending' && expiryTime) {
            const interval = setInterval(() => {
                const now = Math.floor(Date.now() / 1000);
                const remaining = expiryTime - now;

                if (remaining <= 0) {
                    setTimeLeft('0:00');
                    clearInterval(interval);
                } else {
                    const minutes = Math.floor(remaining / 60);
                    const seconds = remaining % 60;
                    setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [status, expiryTime]);

    if (!isOpen) return null;

    const renderContent = () => {
        switch (status) {
            case 'pending':
                return (
                    <div className={styles.contentWrapper}>
                        <div className={styles.statusIcon}>
                            <img src="/assets/icons/info-yellow.svg" alt="pending" />
                        </div>
                        <div className={styles.textGroup}>
                            <h2>Pending {type === 'deposit' ? 'Deposit' : type === 'plan' ? 'Payment' : 'Withdrawal'} Request</h2>
                            <p>Once it's complete, the {type === 'deposit' ? 'Deposit' : type === 'plan' ? 'Plan Upgrade' : 'Withdrawal'} will be processed.</p>
                        </div>
                        {(type === 'deposit' || type === 'plan') ? (
                            <div className={styles.infoAlert}>
                                <div className={styles.icon}>
                                    <InfoIcon />
                                </div>
                                <p>Payment window is open. QR code expires in {timeLeft || '5:00'} — scan the QR code to complete payment.</p>
                            </div>
                        ) : <div className={styles.infoAlert}>
                            <div className={styles.icon}>
                                <InfoIcon />
                            </div>
                            <p>We'll review your submission within 24 hours and notify you once approved.</p>
                        </div>}
                    </div>
                );
            case 'approved':
                return (
                    <div className={styles.contentWrapper}>
                        <div className={styles.statusIcon}>
                            <img src="/assets/icons/success-green.svg" alt="approved" />
                        </div>
                        <div className={styles.textGroup}>
                            <h2>{type === 'deposit' ? 'Deposit successfully' : type === 'plan' ? 'Plan upgraded successfully' : 'Withdrawal successfully'}</h2>
                            <p>{type === 'deposit' ? 'Deposit' : type === 'plan' ? 'Payment' : 'Withdrawal'} of ${amount || 0} initiated successfully!</p>
                        </div>
                        {amount && type !== 'plan' && (
                            <div className={styles.rewardBadge}>
                                <span>{type === 'deposit' ? '+' : '-'}${amount}</span>
                            </div>
                        )}
                    </div>
                );
            case 'rejected':
                return (
                    <div className={styles.contentWrapper}>
                        <div className={styles.statusIcon}>
                            <img src="/assets/icons/close-vec.svg" alt="rejected" />
                        </div>
                        <div className={styles.textGroup}>
                            <h2>Rejected {type === 'deposit' ? 'Deposit' : type === 'plan' ? 'Payment' : 'Withdrawal'} Request</h2>
                            <p>{'Please try again.'}</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={styles.overlay}>
            <div
                className={`${styles.modal} ${styles[status]}`}
                onClick={(e) => e.stopPropagation()}
            >
                {renderContent()}

                <button className={styles.actionBtn} onClick={onClose}>
                    <div className={styles.arrowIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    Back To Dashboard
                </button>
            </div>
        </div>
    );
}
