import React from 'react'
import styles from './billing.module.scss';
import DownloadIcon from '@/icons/downloadIcon';
export default function Billing() {
    return (
        <div className={styles.billingpage}>
            <div className={styles.title}>
                <h2>
                    Billing
                </h2>
                <p>
                    Review and update your billing information to ensure accurate and timely payments.
                </p>
            </div>
            <div className={styles.planbox}>
                <div className={styles.boxheader}>
                    <h2>
                        Pro Plan
                    </h2>
                    <button>
                        Downgrade
                    </button>
                </div>
                <h3>
                    $150 <sub>/ month</sub>
                </h3>
                <p>
                    All the  Pro for
                    starting a new business
                </p>
            </div>
            <div className={styles.tableResponsive}>
                <table>
                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>Date</th>
                            <th>Plan</th>
                            <th>Amount</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>#015274</span>
                            </td>
                            <td>
                                <span>Feb 20, 2026</span>
                            </td>
                            <td>
                                <span> Pro Plan</span>
                            </td>
                            <td>
                                <span>$29</span>
                            </td>
                            <td>
                                <div className={styles.icon}>
                                    <DownloadIcon />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={5}>
                                <div className={styles.alignment}>
                                    <p>
                                        Page 1 of 10
                                    </p>
                                    <button>
                                        Next
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
