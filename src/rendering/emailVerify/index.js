'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './emailVerify.module.scss';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import Button from '@/components/button';
import { forgotPassword } from '@/services/auth';

const EmailIcon = '/assets/icons/email.svg';
const Logo = '/assets/logo/logo.svg';

export default function EmailVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode'); // 'verify' = first-time signup, otherwise forgot-password

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  // First-time signup: just redirect to OTP page, no email input needed
  if (mode === 'verify') {
    return (
      <div className={styles.flexbox}>
        <div className={styles.items}>
          <div className={styles.logo} onClick={() => router.push('/')}>
            <img src={Logo} alt="Logo" />
          </div>
          <div className={styles.box}>
            <div className={styles.text}>
              <h1>Verify Your Email</h1>
              <p>A verification code has been sent to your email. Please check your inbox.</p>
            </div>
            <div className={styles.topAlignment}>
              <Button
                text="Enter Code"
                type="button"
                onClick={() => router.push('/enter-code?mode=verify')}
              />
            </div>
          </div>
        </div>
        <div className={styles.items}>
          <AuthSlider />
        </div>
      </div>
    );
  }

  // Forgot password: collect email and send reset code
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email'); return; }
    setError('');
    setApiError('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      router.push(`/enter-code?mode=forgot&email=${encodeURIComponent(email)}`);
    } catch (err) {
      setApiError(err?.message || 'Could not send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.flexbox}>
      <div className={styles.items}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          <img src={Logo} alt="Logo" />
        </div>
        <div className={styles.box}>
          <div className={styles.text}>
            <h1>Forgot Password</h1>
            <p>Enter your email to receive a password reset code</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Email"
              placeholder="you@example.com"
              icon={EmailIcon}
              type="email"
              name="email"
              value={email}
              onChange={setEmail}
              error={error}
              required
            />
            {apiError && <p className={styles.apiError} role="alert">{apiError}</p>}
            <div className={styles.topAlignment}>
              <Button text={loading ? 'Sending...' : 'Send'} disabled={loading} />
            </div>
          </form>
        </div>
      </div>
      <div className={styles.items}>
        <AuthSlider />
      </div>
    </div>
  );
}
