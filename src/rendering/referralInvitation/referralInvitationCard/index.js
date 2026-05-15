import React, { useState, useEffect } from 'react'
import styles from './referralInvitationCard.module.scss';
import { getReferralHistory } from '@/services/referral';
const ReferralsIcon = '/assets/icons/Referrals.svg';

export default function ReferralInvitationCard() {
    const [summary, setSummary] = useState({
        total_referrals: 0,
        total_cb_point_earning: 0,
        total_real_cash_earning: 0
    });

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await getReferralHistory({ limit: 1, offset: 0 });
                if (res && res.data && res.data.summary) {
                    setSummary(res.data.summary);
                }
            } catch (error) {
                console.error("Error fetching referral summary", error);
            }
        };
        fetchSummary();
    }, []);

    const cards = [
        {
            title: 'Total Referrals',
            value: summary.total_referrals,
        },
        {
            title: 'Referral Earnings ($)',
            value: `$${Number(summary.total_real_cash_earning || 0).toFixed(2)}`,
        },
        {
            title: 'Referral Earnings (CB)',
            value: `${summary.total_cb_point_earning || 0} CB`,
        }
    ];

    return (
        <div className={styles.referralInvitationCard}>
            <div className={styles.grid}>
                {
                    cards.map((card, index) => (
                        <div className={styles.items} key={index}>
                            <div className={styles.iconTextAlignment}>
                                <img src={ReferralsIcon} alt='ReferralsIcon' />
                                <h3>
                                    {card.title}
                                </h3>
                            </div>
                            <h4>
                                {card.value}
                            </h4>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
