import React from 'react'
import styles from './informationCard.module.scss';
import ReferralsFillIcon from '@/icons/referralsFillIcon';
export default function InformationCard() {
    return (
        <div className={styles.informationCard}>
            {
                [...Array(4)].map(() => {
                    return (
                        <div className={styles.items}>
                            <div className={styles.icongrid}>
                                <div className={styles.icon}>
                                    <ReferralsFillIcon />
                                </div>
                                <h3>Total Referrals</h3>
                            </div>
                            <div className={styles.dissAlignment}>
                                <h4>20</h4>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.45976 13.7225L13.1237 4.05852L11.9452 2.88001L2.28125 12.5439L3.45976 13.7225Z" fill="#0000EE" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.35068 4.55478L11.4624 4.54006L11.4471 11.6512L13.1138 11.6548L13.1327 2.86993L4.34723 2.88812L4.35068 4.55478Z" fill="#0000EE" />
                                    </svg>
                                    20%
                                </button>
                            </div>
                            <div className={styles.bottomText}>
                                <span>Tasks finished last month</span>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
