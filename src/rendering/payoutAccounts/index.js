import React from 'react'
import styles from './payoutAccounts.module.scss';
import Button from '@/components/button';
const HomeImage = '/assets/images/home.svg';
const AddIcon = '/assets/icons/add.svg';
export default function PayoutAccounts() {
    return (
        <div className={styles.payoutAccounts}>
            <div className={styles.iconCenter}>
                <img src={HomeImage} alt='HomeImage' />
            </div>
            <h3>
                No payment method
            </h3>
            <p>
                No payment method selected" / "No available payment methods
            </p>
            <div className={styles.buttonCenter}>
                <Button text="Add New  Payout Method" iconwithText icon={AddIcon} />
            </div>
        </div>
    )
}
