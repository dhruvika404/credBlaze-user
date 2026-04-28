import React from 'react'
import styles from './kycComplete.module.scss';
import Button from '@/components/button';
const KycVec = '/assets/images/kyc-vec.png';

export default function KycComplete({ onStart }) {
    return (
        <div className={styles.kycComplete}>
            <div className={styles.imageCenter}>
                <img src={KycVec} alt='KycVec' />
            </div>
            <p>
                You have not submitted your necessary documents to verify your identity. In order to purchase our tokens, please verify
                your identity.
            </p>
            <div className={styles.buttonAlignment}>
                <Button text="Click here to Complete KYC" onClick={onStart} />
            </div>
        </div>
    )
}
