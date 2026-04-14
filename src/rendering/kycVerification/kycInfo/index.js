import React from 'react'
import styles from './kycInfo.module.scss';
import Input from '@/components/input';
export default function KycInfo() {
    return (
        <div className={styles.kycInfo}>
            <div className={styles.content}>
                <h3>
                    Personal Information
                </h3>
                <p>
                    Modify Your Personal Information
                </p>
            </div>
            <div className={styles.twocol}>
                <Input label='Full Name' labelChange placeholder='Juyed Ahmed' />
                <Input label='Date of Birth' labelChange placeholder='1999-01-01' />
            </div>
        </div>
    )
}
