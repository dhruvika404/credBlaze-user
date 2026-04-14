'use client';
import React, { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './enterCode.module.scss';
import AuthSlider from '@/components/authSlider';
import Button from '@/components/button';
import { verifyOtp, verifyForgotOtp, resendOtp } from '@/services/auth';

const Logo = '/assets/logo/logo.svg';

export default function EnterCode() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode'); // 'forgot' or 'verify'
  const email = searchParams.get('email') || '';

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const inputRefs = useRef([]);

  const handleChange = (index, val) => {
    const char = val.slice(-1).toUpperCase();
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().toUpperCase().slice(0, 6);
    const next = [...digits];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length !== 6) { setError('Enter the complete 6-digit code'); return; }
    setError('');
    setApiError('');
    setLoading(true);
    try {
      if (mode === 'forgot') {
        await verifyForgotOtp({ otp, email });
        router.push(`/create-password?email=${encodeURIComponent(email)}`);
      } else {
        // mode === 'verify' (first-time signup email verification)
        const token = localStorage.getItem('token') || '';
        await verifyOtp({ otp }, token);
        router.push('/dashboard');
      }
    } catch (err) {
      setApiError(err?.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg('');
    setApiError('');
    setResendLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      console.log(token,"tokennn");
      
      await resendOtp(token);
      setResendMsg('A new code has been sent.');
    } catch (err) {
      setApiError(err?.message || 'Could not resend code.');
    } finally {
      setResendLoading(false);
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
            <h1>Enter your code</h1>
            <p>
              {email
                ? `Enter the 6-digit code sent to ${email}`
                : 'Enter the 6-digit code sent to your email'}
            </p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.otp} onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="text"
                  maxLength={1}
                  value={d}

                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>
            {error && <p className={styles.errorMsg} role="alert">{error}</p>}
            {apiError && <p className={styles.apiError} role="alert">{apiError}</p>}
            {resendMsg && <p className={styles.successMsg}>{resendMsg}</p>}
            <div className={styles.topAlignment}>
              <Button text={loading ? 'Verifying...' : 'Verify'} disabled={loading} />
            </div>
          </form>
          <div className={styles.bottomText}>
            <p>Didn't receive code?</p>
            <button
              type="button"
              className={styles.resendBtn}
              onClick={handleResend}
              disabled={resendLoading}
            >
              {resendLoading ? 'Sending...' : 'Resend'}
            </button>
          </div>
        </div>
      </div>
      <div className={styles.items}>
        <AuthSlider />
      </div>
    </div>
  );
}
