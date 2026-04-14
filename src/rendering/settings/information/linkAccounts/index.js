import React from 'react'
import styles from './linkAccounts.module.scss';
import Input from '@/components/input';
import Dropdown from '@/components/dropdown';
export default function LinkAccounts() {
    return (
        <div className={styles.linkAccounts}>
            <div className={styles.content}>
                <h2>
                    Link Accounts (Optional)
                </h2>
                <p>
                    Your customers will use this information to contact you.
                </p>
            </div>
            <div className={styles.twocol}>
                <Input label='Instagram' labelChange placeholder='https://www.facebook.com/Credblaze' />
                <Input label='Facebook' labelChange placeholder='https://www.facebook.com/Credblaze' />
                <Input label='Twitter' labelChange placeholder='https://www.twitter.com/Credblaze' />
                <Input label='YouTube' labelChange placeholder='https://www.youtube.com/Credblaze' />
                <Input label='Website' labelChange placeholder='https://www.twitter.com/Credblaze' />
                <Input label='Wallet Address Crypto (TRC20) (BEP20)' labelChange placeholder='https://www.youtube.com/Credblaze' />
                <Input label='Samsung Wallet' labelChange placeholder='https://www.twitter.com/Credblaze' />
                <Input label='Google Wallet' labelChange placeholder='https://www.youtube.com/Credblaze' />
                <Input label='Apple Wallet' labelChange placeholder='https://www.twitter.com/Credblaze' />
            </div>

        </div>
    )
}
