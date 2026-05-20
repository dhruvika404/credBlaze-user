'use client';
import React, { useState, useEffect } from 'react'
import styles from './dashboard.module.scss';
import UserStories from './userStories';
import CardList from './cardList';
import TutorialVideoModal from '@/components/modal/tutorialVideoModal';
import { getPopupAd } from '@/services/ads';
import { getDashboardOverview } from '@/services/dashboard';
import { useAuth } from '@/context/AuthContext';

let hasShownPopUp = false;

export default function Dashboard() {
    const { user } = useAuth();
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [popUpData, setPopUpData] = useState(null);
    const [overviewData, setOverviewData] = useState(null);
    const [loading, setLoading] = useState(true);

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
        fetchOverview();
    }, []);

    return (
        <div className={styles.dashboardPage}>
            <div className={styles.titleInfo}>
                <h1>Dashboard</h1>
                {!user?.is_prime && (
                    <p>Get early access & high-paying tasks with Pro Membership</p>
                )}
            </div>
            <UserStories />
            <CardList overviewData={overviewData} loading={loading} />
            <TutorialVideoModal
                isOpen={isPopUpOpen}
                onClose={() => setIsPopUpOpen(false)}
                adData={popUpData}
            />
        </div>
    )
}
