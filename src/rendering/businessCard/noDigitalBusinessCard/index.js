import React from 'react'
import styles from './noDigitalBusinessCard.module.scss';
import Button from '@/components/button';
const Cardpayment = '/assets/images/card-payment.png';
const PlusIcon = '/assets/icons/plus.svg';
export default function NoDigitalBusinessCard() {
    return (
        <div className={styles.noDigitalBusinessCard}>
            <div>
                <div className={styles.imageCenter}>
                    <img src={Cardpayment} alt='Cardpayment' />
                </div>
                <h2>
                    No Digital Business Card
                </h2>
                <p>
                    No Digital Business Card " / "No available Digital Business Card
                </p>
                <div className={styles.buttonCenter}>
                    <Button iconwithText icon={PlusIcon} text="Add Digital Business Card" />
                </div>
            </div>
        </div>
    )
}
