import React, { useMemo } from 'react'
import styles from './benefitsSection.module.scss';
import Button from '@/components/button';
import CopyIcon from '@/icons/copyIcon';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const WhatsApp = '/assets/icons/WhatsApp.svg';

export default function BenefitsSection() {
    const { user } = useAuth();

    const referralLink = useMemo(() => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const code = user?.referralCode ?? '';
        if (!code) return `${origin}/signup`;
        return `${origin}/signup?referral_code=${code}`;
    }, [user]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink);
        toast.success('Referral link opied to clipboard!');
    };

    const handleShare = () => {

    };

    return (
        <div className={styles.benefitsSection}>
            <div className={styles.grid}>
                <div className={styles.items}>
                    <div className={styles.referEarn}>
                        <h3>
                            Refer & Earn
                        </h3>
                        <p>
                            Invite your friends win assured money
                        </p>
                    </div>
                    <div className={styles.referralLink}>
                        <span>Your Referral Link</span>
                        <div className={styles.inputButton}>
                            <div className={styles.inputRelative}>
                                <input
                                    type='text'
                                    readOnly
                                    value={referralLink}
                                    placeholder='Loading referral link...'
                                />
                                <div className={styles.iconAlign} onClick={handleCopyLink} style={{ cursor: 'pointer' }}>
                                    <CopyIcon />
                                </div>
                            </div>
                            <Button text="Share Link" onClick={handleShare} />
                        </div>
                    </div>
                    <div className={styles.shareViaText}>
                        <p>
                            Share via:
                        </p>
                        <div className={styles.iconAlignment}>
                            {
                                [...Array(5)].map(() => {
                                    return (
                                        <div className={styles.iconText}>
                                            <div className={styles.iconCenter}>
                                                <img src={WhatsApp} alt='WhatsApp' />
                                            </div>
                                            <p>
                                                WhatsApp
                                            </p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.items}>
                    <div className={styles.referEarn}>
                        <h3>
                            Invite & Earn Benefits
                        </h3>
                        <p>
                            Share your referral link and earn when friends join and participate.
                        </p>
                    </div>
                    <div className={styles.benefits}>
                        <h3>
                            🎁 Benefits
                        </h3>
                        <ul>
                            <li>Earn instant rewards through daily spins and simple activities.</li>
                            <li>Redeem your points for real value like recharges, vouchers, and offers.</li>
                            <li>Increase your earnings with referrals and consistent engagement.</li>
                            <li>Enjoy a fun, interactive experience while maximizing your rewards.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
