'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './successfullyMessage.module.scss';
import AuthSlider from '@/components/authSlider';
import Button from '@/components/button';

const Logo = '/assets/logo/logo.svg';
const ScreenLock = '/assets/images/screen-lock.png';

export default function SuccessfullyMessage() {
  const router = useRouter();

  return (
    <div className={styles.flexbox}>
      <div className={styles.items}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          <img src={Logo} alt="Logo" />
        </div>
        <div className={styles.box}>
          <div className={styles.centerImage}>
            <img src={ScreenLock} alt="Password changed successfully" />
          </div>
          <h2>Your password has been changed successfully</h2>
          <div className={styles.topAlignment}>
            <Button text="Back to home" type="button" onClick={() => router.push('/')} />
          </div>
        </div>
      </div>
      <div className={styles.items}>
        <AuthSlider />
      </div>
    </div>
  );
}
