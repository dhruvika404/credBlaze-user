import React from 'react'
import styles from './wallets.module.scss';
import Button from '@/components/button';
import RightBlackIcon from '@/icons/rightBlackIcon';
const PlusIcon = '/assets/icons/plus.svg'
const AppleIcon = '/assets/icons/apple.svg'
export default function Wallets() {
    return (
        <div className={styles.wallets}>
            <div className={styles.box}>
                <div className={styles.boxheaderAlignment}>
                    <h3>Wallets</h3>
                    <Button icon={PlusIcon} iconwithText text="Add Links" />
                </div>
                <div className={styles.grid}>
                    {
                        [...Array(4)].map(() => {
                            return (
                                <div className={styles.items}>
                                    <img src={AppleIcon} alt="AppleIcon" />
                                    <div className={styles.icontext}>
                                        <p>Apple Wallet</p>
                                        <RightBlackIcon />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
