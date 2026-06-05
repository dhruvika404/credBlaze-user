import React from 'react'
import styles from './cardList.module.scss';
import AdsCard from '../adsCard';
import InformationCard from '../informationCard';
import WeeklyEarnings from '../weeklyEarnings';
import TotalBalance from '../totalBalance';
import Earning from '../earning';
import RecentTasks from '../recentTasks';

export default function CardList({ overviewData, loading, refreshOverview }) {
    return (
        <div className={styles.cardListAlignment}>
            <div className={styles.grid}>
                <div className={styles.column}>
                    <div className={styles.whiteFillBox}>
                        <InformationCard overviewData={overviewData} />
                        <WeeklyEarnings overviewData={overviewData} />
                    </div>
                </div>
                <div className={styles.column}>
                    <AdsCard />
                    <div className={styles.balanceWrapper}>
                        <TotalBalance overviewData={overviewData} refreshOverview={refreshOverview} />
                    </div>
                </div>
            </div>
            <Earning overviewData={overviewData} loading={loading} />
            <RecentTasks overviewData={overviewData} loading={loading} />
        </div>
    )
}
