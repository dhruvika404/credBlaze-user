"use client"
import React from 'react'
import styles from './wallet.module.scss'
import OverviewInformation from './overviewInformation';
import TransactionHistory from './transactionHistory';

export default function Wallet() {

    return (
        <div className={styles.wallet}>
            <div className={styles.title}>
                <h2>My Wallet</h2>
                <p>Manage your funds, track your earnings, and monitor your wallet activity.</p>
            </div>
            <OverviewInformation />
            <TransactionHistory />
        </div>
    )
}
