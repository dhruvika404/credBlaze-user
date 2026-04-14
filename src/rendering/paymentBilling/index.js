import React from 'react'
import styles from './paymentBilling.module.scss';
import EditIcon from '@/icons/editIcon';
import Input from '@/components/input';
import Dropdown from '@/components/dropdown';
import Button from '@/components/button';
export default function PaymentBilling() {
    return (
        <div className={styles.paymentBilling}>
            <div className={styles.spacingGrid}>
                <div className={styles.content}>
                    <h2>
                        Add new bank account
                    </h2>
                    <div className={styles.edit}>
                        <button>
                            <EditIcon />
                            Edit
                        </button>
                    </div>
                </div>
                <div className={styles.outlineBox}>
                    <Input label='Account holder Name' placeholder='Naitik Kumar' labelChange />
                    <Input label='Bank Name' placeholder='Account Number' labelChange />
                    <Input label='Account Number' placeholder='245445555' labelChange />
                    <Dropdown label='Account Type' labelChange />
                    <Input label='IFSC Code' placeholder='IFSC Code' labelChange />
                    <Input label='Branch Name' placeholder='Branch Name' labelChange />
                </div>
            </div>
            <div className={styles.boxFooter}>
                <Button text="Cancel" lightbutton />
                <Button text="Submit" />
            </div>
        </div>
    )
}
