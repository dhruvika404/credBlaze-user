'use client';
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './earning.module.scss';
import { useAuth } from '@/context/AuthContext';
import FileIcon from '@/icons/fileIcon';
import CopyIcon from '@/icons/copyIcon';
import ShareIcon from '@/icons/shareIcon';

export default function Earning({ overviewData, loading }) {
    const router = useRouter();
    const { user } = useAuth();
    const remainingSpins = overviewData?.spin_and_earn?.available_spins ?? 0;

    const handleSpinClick = () => {
        router.push('/spin-earn');
    };

    const referralLink = useMemo(() => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const code = user?.referralCode ?? '';
        if (!code) return `${origin}/signup`;
        return `${origin}/signup?referral_code=${code}`;
    }, [user]);

    const rewardText = overviewData?.refer_and_earn?.reward_text || "CB points per successful referral";

    const handleCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(referralLink);
        if (typeof window !== 'undefined') {
            import('react-hot-toast').then(({ toast }) => {
                toast.success('Referral link copied to clipboard!');
            });
        }
    };

    const handleShare = (e) => {
        e.stopPropagation();
        router.push('/referral-invitation');
    };

    return (
        <div className={styles.taskActivityContainer}>
            <div className={styles.flexRow}>
                {/* 1. Spin & Earn Card */}
                <div className={styles.innerCard}>
                    <div className={styles.leftContent}>
                        <div className={styles.header}>
                            <div className={styles.iconBox}>
                                <FileIcon />
                            </div>
                            <span className={styles.title}>Spin & Earn</span>
                        </div>

                        <div className={styles.infoArea}>
                            <h2 className={styles.spinCount}>
                                {loading ? '...' : String(remainingSpins).padStart(2, '0')}
                            </h2>
                            <span className={styles.spinLabel}>available spin</span>
                        </div>

                        <button
                            className={styles.spinBtn}
                            onClick={handleSpinClick}
                        >
                            Spin Now
                        </button>
                    </div>

                    <div className={styles.wheelArea} >
                        <div className={styles.wheelWrapper}>
                            <img
                                src="/assets/images/half-wheel.svg"
                                alt="Spin Wheel"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Refer & Earn Card */}
                <div className={styles.innerCard}>
                    <div className={styles.leftContent}>
                        <div className={styles.header}>
                            <div className={styles.iconBox}>
                                <FileIcon />
                            </div>
                            <span className={styles.title}>Refer & Earn</span>
                        </div>

                        <div className={styles.linkContainer}>
                            <div className={styles.inputWrapper}>
                                <div className={styles.linkInput}>
                                    {referralLink}
                                </div>
                                <button className={styles.actionBtn} onClick={handleCopy} title="Copy Link">
                                    <CopyIcon />
                                </button>
                                <button className={styles.actionBtn} onClick={handleShare} title="Share Link">
                                    <ShareIcon />
                                </button>
                            </div>
                        </div>

                        <div className={styles.pointsBadge}>
                            <div className={styles.starIconBox}>
                                <img src="/assets/icons/star.svg" alt="star" />
                            </div>
                            <span className={styles.badgeText}>{rewardText}</span>
                        </div>
                    </div>

                    {/* SVG/Coin Image Area on the right */}
                    <div className={styles.coinsArea}>
                        <div className={styles.coinGlow} />
                        <img
                            src="/assets/images/coin.svg"
                            alt="Coins"
                            className={styles.coinImg}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
