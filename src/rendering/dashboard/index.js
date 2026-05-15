'use client';
import React, { useState, useEffect } from 'react'
import styles from './dashboard.module.scss';
import UserStories from './userStories';
import CardList from './cardList';
import TutorialVideoModal from '@/components/modal/tutorialVideoModal';
import { getPopupAd } from '@/services/ads';
import { useAuth } from '@/context/AuthContext';

let hasShownPopUp = false;

export default function Dashboard() {
    const { user } = useAuth();
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [popUpData, setPopUpData] = useState(null);

    useEffect(() => {
        if (hasShownPopUp) return;
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
    }, []);

    return (
        <div className={styles.dashboardPage}>
            {user?.is_prime && (
                <div className={styles.titleInfo}>
                    <h1>Dashboard</h1>
                    <p>Get early access & high-paying tasks with Pro Membership</p>
                </div>
            )}
            <UserStories />
            <CardList />
            <TutorialVideoModal
                isOpen={isPopUpOpen}
                onClose={() => setIsPopUpOpen(false)}
                adData={popUpData}
            />
        </div>
    )
}
