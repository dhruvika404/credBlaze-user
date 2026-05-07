'use client';
import React, { useState, useEffect } from 'react'
import styles from './dashboard.module.scss';
import UserStories from './userStories';
import CardList from './cardList';
import TutorialVideoModal from '@/components/modal/tutorialVideoModal';
import { getAd, AD_TYPES } from '@/services/ads';

export default function Dashboard() {
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [popUpData, setPopUpData] = useState(null);

    useEffect(() => {
        const fetchPopUpAd = async () => {
            try {
                const response = await getAd(AD_TYPES.POP_UP);
                if (response.success && response.data) {
                    setPopUpData(response.data);
                    setIsPopUpOpen(true);
                }
            } catch (error) {
                console.error('Error fetching pop-up ad:', error);
            }
        };
        fetchPopUpAd();
    }, []);

    return (
        <div className={styles.dashboardPage}>
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
