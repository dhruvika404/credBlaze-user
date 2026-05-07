import React from 'react'
import styles from './businessCard.module.scss';
import NoDigitalBusinessCard from './noDigitalBusinessCard';
export default function BusinessCard() {
    return (
        <div className={styles.businessCard}>
            <div className={styles.title}>
                <h2>Your Digital Business Card</h2>
                <p>
                    Share your professional identity with a tap
                </p>
            </div>
            {/* <NoDigitalBusinessCard /> */}
        </div>
    )
}
