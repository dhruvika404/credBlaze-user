'use client'
import React from 'react'
import styles from './spinResultModal.module.scss'
import WinIcon from '@/icons/winIcon';
import SadIcon from '@/icons/sadIcon';
import QuestionIcon from '@/icons/questionIcon';

export default function SpinResultModal({ isOpen, onClose, result, remainingSpins = 0 }) {
    if (!isOpen || !result) return null;

    const isBetterLuck = result.label && result.label.toLowerCase().includes('better luck');
    const isWin = !isBetterLuck;

    if (!isWin) {
        return (
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.statusIcon}>
                            <SadIcon />
                        </div>
                        <div className={styles.textGroup}>
                            <h2>Better Luck Next Time! 🍀</h2>
                            <p>Don't give up! Keep spinning to win exciting rewards.</p>
                        </div>
                    </div>

                    <div className={styles.remainingText}>
                        <QuestionIcon />
                        <span>{remainingSpins} spins remaining today</span>
                    </div>

                    <button className={styles.actionBtn} onClick={onClose}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.contentWrapper}>
                    <div className={styles.statusIcon}>
                        <WinIcon />
                    </div>
                    <div className={styles.textGroup}>
                        <h2>Congratulations! 🎉</h2>
                        <p>{result.label || 'Reward'} added to your wallet</p>
                    </div>

                    <div className={`${styles.rewardBadge} ${result.reward_type === 'POINT' ? styles.coin : ''}`}>
                        <span>
                            {result.reward_type === 'POINT'
                                ? `CB Reward: ${result.reward_value} CB`
                                : `${result.label || 'Cash Reward'}: ₹${result.reward_value}`}
                        </span>
                    </div>
                </div>

                <div className={styles.remainingText}>
                    <QuestionIcon />
                    <span>{remainingSpins} spins remaining today</span>
                </div>

                <button className={styles.actionBtn} onClick={onClose}>
                    Awesome!
                </button>
            </div>
        </div>
    );
}
