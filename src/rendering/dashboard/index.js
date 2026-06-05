'use client';
import React, { useState, useEffect } from 'react'
import styles from './dashboard.module.scss';
import UserStories from './userStories';
import CardList from './cardList';
import TutorialVideoModal from '@/components/modal/tutorialVideoModal';
import { getPopupAd } from '@/services/ads';
import { getDashboardOverview } from '@/services/dashboard';

let hasShownPopUp = false;

export default function Dashboard() {
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [popUpData, setPopUpData] = useState(null);
    const [overviewData, setOverviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOverview = async () => {
        try {
            setLoading(true);
            const response = await getDashboardOverview();
            if (response.success && response.data) {
                setOverviewData(response.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard overview data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasShownPopUp) {
            const fetchPopUpAd = async () => {
                try {
                    const response = await getPopupAd();
                    if (response.success && response.data) {
                        setPopUpData(response.data);
                        setIsPopUpOpen(true);
                        hasShownPopUp = true;
                    }
                } catch (error) {
                    console.error('Error fetching pop-up ad:', error);
                }
            };
            fetchPopUpAd();
        }

        fetchOverview();
    }, []);

    return (
        <div className={styles.dashboardPage}>
            <UserStories />
            <CardList overviewData={overviewData} loading={loading} refreshOverview={fetchOverview} />
            <TutorialVideoModal
                isOpen={isPopUpOpen}
                onClose={() => setIsPopUpOpen(false)}
                adData={popUpData}
            />
        </div>
    )
}
