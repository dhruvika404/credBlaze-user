import React from 'react'
import styles from './cardStatus.module.scss';
import LinkIcon from '@/icons/linkIcon';
import Button from '@/components/button';
const ProIcon = '/assets/icons/pro.svg';
const CopyIcon = '/assets/icons/copy.svg';

export default function CardStatus() {
    return (
        <div className={styles.cardStatus}>
            <div className={styles.outlineBorder}>
                <div className={styles.subtitle}>
                    <h2>
                        Card Status
                    </h2>
                </div>
                <div className={styles.membership}>
                    <p>
                        Membership
                    </p>
                    <div className={styles.icontext}>
                        <img src={ProIcon} alt='ProIcon' />
                        <span>Pro</span>
                    </div>
                </div>
                <div className={styles.deliveryStatus}>
                    <span>Delivery Status</span>
                    <button>
                        Not Ordered
                    </button>
                </div>
            </div>
            <div className={styles.cardlink}>
                <div className={styles.icontext}>
                    <LinkIcon />
                    <p>Your Card Link</p>
                </div>
                <div className={styles.input}>
                    <input type='text' placeholder='card.app/johndoe' />
                </div>
                <div className={styles.buttonAlignment}>
                    <Button icon={CopyIcon} iconwithText text="Copy Link" />
                </div>
            </div>
        </div>
    )
}
