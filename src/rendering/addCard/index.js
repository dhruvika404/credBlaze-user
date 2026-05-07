import React from 'react'
import styles from './addCard.module.scss';
import CardPreview from './cardPreview';
import CardStatus from './cardStatus';
import Wallets from './wallets';
import ContactInformation from './contactInformation';
export default function AddCard() {
    return (
        <div>
            <div className={styles.addcardPage}>
                <div className={styles.title}>
                    <h2>
                        Your Digital Business Card
                    </h2>
                    <p>
                        Share your professional identity with a tap
                    </p>
                </div>
                <div className={styles.inforGrid}>
                    <CardPreview />
                    <CardStatus />
                </div>
                <Wallets />
                <ContactInformation />
            </div>
        </div>
    )
}
