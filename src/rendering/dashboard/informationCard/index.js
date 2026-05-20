'use client';
import React from 'react';
import styles from './informationCard.module.scss';
import TotalReferralsIcon from '../../../icons/totalReferralsIcon';
import TotalEarnedIcon from '../../../icons/totalEarnedIcon';
import TasksCompletedIcon from '../../../icons/tasksCompletedIcon';
import TotalReferralEarningsIcon from '@/icons/totalReferralEarningsIcon';

export default function InformationCard({ overviewData }) {

    const formatGrowth = (growthStr) => {
        if (!growthStr) return '0%';
        return growthStr.replace('↗ ', '').replace('↘ ', '');
    };

    const statsData = [
        {
            id: 1,
            title: 'Total Referrals',
            value: overviewData?.stats?.total_referrals || 0,
            growth: formatGrowth(overviewData?.stats?.referrals_growth),
            bottomText: 'Tasks finished last month',
            icon: <TotalReferralsIcon />
        },
        {
            id: 2,
            title: 'Total Earned',
            value: overviewData?.stats?.total_earned_cash || 0,
            growth: formatGrowth(overviewData?.stats?.earned_growth),
            bottomText: 'Total Earned last month',
            icon: <TotalEarnedIcon />
        },
        {
            id: 3,
            title: 'Total Referral Earnings',
            value: overviewData?.stats?.total_referral_earnings || 0,
            growth: formatGrowth(overviewData?.stats?.referral_earnings_growth),
            bottomText: 'Referral Earning from last month',
            icon: <TotalReferralEarningsIcon />
        },
        {
            id: 4,
            title: 'Tasks Completed',
            value: overviewData?.stats?.tasks_completed || 0,
            growth: formatGrowth(overviewData?.stats?.tasks_growth),
            bottomText: 'Tasks finished last month',
            icon: <TasksCompletedIcon />
        }
    ];

    return (
        <div className={styles.informationCard}>
            {
                statsData.map((stat) => {
                    return (
                        <div key={stat.id} className={styles.items}>
                            <div className={styles.icongrid}>
                                <div className={styles.icon}>
                                    {stat.icon}
                                </div>
                                <h3>{stat.title}</h3>
                            </div>
                            <div className={styles.dissAlignment}>
                                <h4>{stat.value.toLocaleString()}</h4>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M3.45976 13.7225L13.1237 4.05852L11.9452 2.88001L2.28125 12.5439L3.45976 13.7225Z" fill="#0000EE" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M4.35068 4.55478L11.4624 4.54006L11.4471 11.6512L13.1138 11.6548L13.1327 2.86993L4.34723 2.88812L4.35068 4.55478Z" fill="#0000EE" />
                                    </svg>
                                    {stat.growth}
                                </button>
                            </div>
                            <div className={styles.bottomText}>
                                <span>{stat.bottomText}</span>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
