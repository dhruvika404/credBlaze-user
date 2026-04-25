'use client';
import React, { useState, useEffect } from 'react'
import styles from './kycVerification.module.scss';
import Kycpending from './kycpending';
import Button from '@/components/button';

const MobileIcon = '/assets/images/mobile.svg';

export default function KycVerification() {

    return (
        <div className={styles.outlinebox}>
            <div className={styles.spacingGrid}>
                <Kycpending />
            </div>
            
            <div className={styles.verificationContent}>
                <img src={MobileIcon} alt="Mobile Verification" className={styles.mobileIcon} />
                <p className={styles.infoText}>
                    You have not submitted your necessary documents to verify your identity. In order to purchase our tokens, please verify your identity.
                </p>
                <div className={styles.buttonWrapper}>
                    <Button text="Back to home" onClick={() => {}} />
                </div>
            </div>
        </div>
    )
}
