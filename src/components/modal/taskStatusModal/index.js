'use client'
import React from 'react'
import styles from './taskStatusModal.module.scss'
import RupeeIcon from '@/icons/rupeeIcon';
import InfoIcon from '@/icons/infoIcon';

export default function TaskStatusModal({ isOpen, onClose, status = 'review', reward = '50' }) {
    if (!isOpen) return null;

    const renderContent = () => {
        switch (status) {
            case 'approved':
                return (
                    <div className={styles.contentWrapper}>
                        <div className={styles.statusIcon}>
                            <img src="/assets/icons/success-green.svg" alt="approved" />
                        </div>
                        <div className={styles.textGroup}>
                            <h2>Submission Approved!</h2>
                            <p>Coins have been added to your wallet</p>
                        </div>
                        <div className={styles.rewardBadge}>
                            <div className={styles.icon}>
                                <RupeeIcon />
                            </div>
                            <span>+₹{reward}</span>
                        </div>
                    </div>
                );
            case 'rejected':
                return (
                    <div className={styles.contentWrapper}>
                        <div className={styles.statusIcon}>
                            <img src="/assets/icons/close-vec.svg" alt="rejected" />
                        </div>
                        <div className={styles.textGroup}>
                            <h2>Submission Rejected!</h2>
                            <p>Reason for rejection</p>
                        </div>
                    </div>
                );
            case 'review':
            default:
                return (
                    <div className={styles.contentWrapper}>
                        <div className={styles.statusIcon}>
                            <img src="/assets/icons/info-yellow.svg" alt="review" />
                        </div>
                        <div className={styles.textGroup}>
                            <h2>Submission Under Review</h2>
                            <p>Your submission is being reviewed by our team.</p>
                        </div>
                        <div className={styles.infoAlert}>
                            <div className={styles.icon}>
                                <InfoIcon />
                            </div>
                            <p>We'll review your submission within 24 hours and notify you once approved.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
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
