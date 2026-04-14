import React from 'react'
import styles from './planPricing.module.scss';
import CheckIcon from '@/icons/checkIcon';
export default function PlanPricing() {
    return (
        <div className={styles.planPricing}>
            <div className={styles.planbox}>
                <div className={styles.boxheader}>
                    <h2>
                        Basic Plan
                    </h2>
                    <button>
                        Current Plan
                    </button>
                </div>
                <div className={styles.boxbody}>
                    <div className={styles.title}>
                        <h2>
                            Free <sub>/ month</sub>
                        </h2>
                    </div>
                    <div className={styles.content}>
                        {
                            [...Array(4)].map(() => {
                                return (
                                    <div className={styles.list}>
                                        <CheckIcon />
                                        <span>
                                            Professional reports
                                        </span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className={styles.planbox}>
                <div className={styles.boxheader}>
                    <h2>
                        Basic Plan
                    </h2>
                    <button>
                        Current Plan
                    </button>
                </div>
                <div className={styles.boxbody}>
                    <div className={styles.title}>
                        <h2>
                            Free <sub>/ month</sub>
                        </h2>
                    </div>
                    <div className={styles.content}>
                        {
                            [...Array(4)].map(() => {
                                return (
                                    <div className={styles.list}>
                                        <CheckIcon />
                                        <span>
                                            Professional reports
                                        </span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
