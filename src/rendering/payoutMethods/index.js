'use client'
import React, { useState } from 'react'
import styles from './payoutMethods.module.scss';
import Button from '@/components/button';
import MoreIcon from '@/icons/moreIcon';
import EditOutline from '@/icons/editOutline';
import RemoveIcon from '@/icons/removeIcon';
import classNames from 'classnames';

const AddIcon = '/assets/icons/add.svg'

const BANK_ACCOUNTS = [
    {
        id: 1,
        name: 'HDFC Bank',
        number: '****1234',
        selected: true
    },
    {
        id: 2,
        name: 'Axis Bank',
        number: '****1234',
        selected: false
    }
]

export default function PayoutMethods() {
    const [selectedBank, setSelectedBank] = useState(1);
    const [openMenuId, setOpenMenuId] = useState(null);

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    return (
        <div className={styles.payoutMethods}>
            <div className={styles.outlinebox}>
                <div className={styles.content}>
                    <div>
                        <h2>
                            Payout Methods
                        </h2>
                        <p>
                            Add Bank Accounts for withdrawals.
                        </p>
                    </div>
                    <div>
                        <Button text="Add New Payout Method" iconwithText icon={AddIcon} />
                    </div>
                </div>
                <div className={styles.bankList}>
                    {BANK_ACCOUNTS.map((bank) => (
                        <div
                            key={bank.id}
                            className={classNames(styles.bankCard, selectedBank === bank.id ? styles.active : '')}
                            onClick={() => setSelectedBank(bank.id)}
                        >
                            <div className={styles.left}>
                                <div className={classNames(styles.checkbox, selectedBank === bank.id ? styles.checked : '')}>
                                    {selectedBank === bank.id && (
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                                <div className={styles.info}>
                                    <h3>{bank.name}</h3>
                                    <p>{bank.number}</p>
                                </div>
                            </div>
                            <div className={styles.right} onClick={(e) => { e.stopPropagation(); toggleMenu(bank.id); }}>
                                <MoreIcon />
                                {openMenuId === bank.id && (
                                    <div className={styles.dropdownMenu}>
                                        <div className={styles.menuItem}>
                                            <EditOutline />
                                            <span>Edit Account</span>
                                        </div>
                                        <div className={classNames(styles.menuItem, styles.delete)}>
                                            <RemoveIcon />
                                            <span>Delete Account</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    )
}

