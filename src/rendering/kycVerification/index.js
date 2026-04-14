import React from 'react'
import styles from './kycVerification.module.scss';
import Kycpending from './kycpending';
import KycInfo from './kycInfo';
import UploadDocumnentList from './uploadDocumnentList';
import Button from '@/components/button';
export default function KycVerification() {
    return (
        <div className={styles.outlinebox}>
            <div className={styles.spacingGrid}>
                <Kycpending />
                <KycInfo />
                <UploadDocumnentList />
            </div>
            <div className={styles.boxFooter}>
                <Button text="Cancel" lightbutton />
                <Button text="Submit KYC" />
            </div>
        </div>
    )
}
