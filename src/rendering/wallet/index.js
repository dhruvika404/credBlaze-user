"use client"
import React, { useState } from 'react'
import styles from './wallet.module.scss'
import OverviewInformation from './overviewInformation';
import TransactionHistory from './transactionHistory';
import { useAuth } from '@/context/AuthContext';

export default function Wallet() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { fetchAndSetProfile } = useAuth();

    const handleTransactionSuccess = async () => {
        setRefreshTrigger(prev => prev + 1);
        try {
            if (fetchAndSetProfile) {
                await fetchAndSetProfile();
            }
        } catch (error) {
            console.error('Error refreshing profile after transaction:', error);
        }
    };

    return (
        <div className={styles.wallet}>
            <div className={styles.title}>
                <h2>My Wallet</h2>
                <p>Manage your funds, track your earnings, and monitor your wallet activity.</p>
            </div>
            <OverviewInformation onTransactionSuccess={handleTransactionSuccess} />
            <TransactionHistory refreshTrigger={refreshTrigger} />
        </div>
    )
}
