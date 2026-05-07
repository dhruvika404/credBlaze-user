import React from 'react'
import styles from './cardList.module.scss';
import AdsCard from '../adsCard';
import InformationCard from '../informationCard';
export default function CardList() {
    return (
        <div className={styles.cardListAlignment}>
            <div className={styles.grid}>
                <div>
                    <div className={styles.whiteFillBox}>
                        <InformationCard />
                    </div>
                </div>
                <div>
                    <AdsCard />
                </div>
            </div>
        </div>
    )
}
