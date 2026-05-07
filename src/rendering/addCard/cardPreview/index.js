import React from 'react'
import styles from './cardPreview.module.scss';
import Button from '@/components/button';
const CredblazeCard = '/assets/images/credblaze.png';
const EditIcon = '/assets/icons/edit.svg';
export default function CardPreview() {
    return (
        <div className={styles.cardPreview}>
            <div className={styles.cardheader}>
                <h2>
                    Card Preview
                </h2>
                <div className={styles.tabdesign}>
                    <button className={styles.active}>Front </button>
                    <button>Back</button>
                </div>
            </div>
            <div className={styles.cardimage}>
                <img src={CredblazeCard} alt="CredblazeCard" />
            </div>
            <div className={styles.buttonAlignment}>
                <Button icon={EditIcon} iconwithText text="Edit Card" />
            </div>
        </div>
    )
}
