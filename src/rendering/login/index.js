'use client';
import React, { useState, useTransition, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import styles from './login.module.scss';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import LoginwithGoogle from '@/components/loginwithGoogle';
import Button from '@/components/button';
import { loginOtpAction, verifyLoginOtpAction } from '@/app/actions/auth/auth';
import { useAuth } from '@/context/AuthContext';
import { getFcmToken } from '@/utils/firebase';

const EmailIcon = '/assets/icons/email.svg';
const EyeIcon = '/assets/icons/eye.svg';
const EyeFillIcon = '/assets/icons/eye-fill.svg';
const Logo = '/assets/logo/logo.svg';

export default function Login() {
  const router = useRouter();
  const { deviceId, login: authLogin } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpApiError, setOtpApiError] = useState('');

  const inputRefs = useRef([]);

  const set = (field) => (v) => {
    setForm(f => ({ ...f, [field]: v }));
    setErrors(e => { if (!e[field]) return e; const n = { ...e }; delete n[field]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  // Countdown timer for OTP Resend
  useEffect(() => {
    if (!isOtpSent) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown, isOtpSent]);

  const handleDigitChange = (index, val) => {
    const char = val.slice(-1).toUpperCase();
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleDigitPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().toUpperCase().slice(0, 6);
    const next = [...digits];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    startTransition(async () => {
      try {
        const fcmToken = await getFcmToken();
        const res = await loginOtpAction({
          email: form.email,
          password: form.password,
          device_id: deviceId,
          user_role_name: "User",
          fcm_token: fcmToken
        });

        if (res.success) {
          const token = res.data?.data?.token || res.data?.token || '';
          setOtpToken(token);
          setIsOtpSent(true);
          setCountdown(59);
          setCanResend(false);
          setDigits(['', '', '', '', '', '']);
          setOtpError('');
          setOtpApiError('');
          setResendMsg('');
          toast.success(res.data?.message || 'OTP sent successfully');
        } else {
          toast.error(res.error || 'Login failed');
        }
      } catch {
        toast.error('An error occurred during sign in');
      }
    });
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length !== 6) { setOtpError('Enter the complete 6-digit code'); return; }
    setOtpError('');
    setOtpApiError('');
    startTransition(async () => {
      try {
        const fcmToken = await getFcmToken();
        const res = await verifyLoginOtpAction({
          token: otpToken,
          otp,
          device_id: deviceId,
          fcm_token: fcmToken
        });

        if (res.success) {
          const token = res.data?.data?.access_token || res.data?.access_token || res.data?.token || '';
          let userData = res.data?.data?.user_details || res.data?.user_details || res.data?.data?.user || res.data?.user || null;
          
          if (userData) {
            const mpinGenerated = res.data?.data?.user_mpin_generated ?? res.data?.user_mpin_generated;
            if (mpinGenerated !== undefined) {
              userData = { ...userData, user_mpin_generated: mpinGenerated };
              if (typeof window !== 'undefined') {
                localStorage.setItem('user_mpin_generated', mpinGenerated);
              }
            }
          }

          await authLogin(userData, token);
          toast.success('Signed in successfully');
          router.push('/dashboard');
        } else {
          setOtpApiError(res.error || 'Invalid code. Please try again.');
        }
      } catch (err) {
        setOtpApiError('An error occurred during verification');
      }
    });
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setResendMsg('');
    setOtpApiError('');
    setResendLoading(true);
    try {
      const fcmToken = await getFcmToken();
      const res = await loginOtpAction({
        email: form.email,
        password: form.password,
        device_id: deviceId,
        user_role_name: "User",
        fcm_token: fcmToken
      });

      if (res.success) {
        const token = res.data?.data?.token || res.data?.token || '';
        setOtpToken(token);
        setResendMsg('A new code has been sent.');
        setCountdown(59);
        setCanResend(false);
      } else {
        setOtpApiError(res.error || 'Could not resend code.');
      }
    } catch (err) {
      setOtpApiError('Could not resend code.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setIsOtpSent(false);
    setDigits(['', '', '', '', '', '']);
    setOtpError('');
    setOtpApiError('');
    setResendMsg('');
  };

  return (
    <div className={styles.flexbox}>
      <div className={styles.items}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          <img src={Logo} alt="Logo" />
        </div>
        <div className={styles.box}>
          {!isOtpSent ? (
            <>
              <div className={styles.text}>
                <h1>Sign in to your account</h1>
                <p>Empower Your Projects, Simplify Your Success!</p>
              </div>
              <form onSubmit={handleSubmit} noValidate>
                <div className={styles.spacing}>
                  <Input
                    label="Email"
                    placeholder="you@example.com"
                    icon={EmailIcon}
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Password"
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    rightIcon={showPassword ? EyeFillIcon : EyeIcon}
                    onRightIconClick={() => setShowPassword(s => !s)}
                    value={form.password}
                    onChange={set('password')}
                    error={errors.password}
                    required
                    maxLength={30}
                  />
                  <div className={styles.forgotpassword}>
                    <Link href="/email-verify">Forgot Password?</Link>
                  </div>
                </div>
                <div className={styles.signInBtn}>
                  <Button text={loading ? 'Signing in...' : 'Sign In'} disabled={loading} />
                </div>
                <div className={styles.orline}>
                  <div className={styles.line}></div>
                  <span>OR</span>
                  <div className={styles.line}></div>
                </div>
                <LoginwithGoogle />
              </form>
              <div className={styles.bottomText}>
                <p>Don't have an account?</p>
                <Link href="/signup">Sign Up</Link>
              </div>
            </>
          ) : (
            <>
              <div className={styles.text}>
                <h1>Enter your code</h1>
                <p>Enter the 6-digit code sent to {form.email}</p>
              </div>
              <form onSubmit={handleVerifyOtp} noValidate>
                <div className={styles.otp} onPaste={handleDigitPaste}>
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      inputMode="text"
                      maxLength={1}
                      value={d}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(i, e)}
                      aria-label={`Digit ${i + 1}`}
                    />
                  ))}
                </div>
                {otpError && <p className={styles.errorMsg} role="alert">{otpError}</p>}
                {otpApiError && <p className={styles.apiError} role="alert">{otpApiError}</p>}
                {resendMsg && <p className={styles.successMsg}>{resendMsg}</p>}

                <div className={styles.topAlignment}>
                  <Button text={loading ? 'Verifying...' : 'Verify'} disabled={loading} />
                </div>
              </form>
              <div className={styles.bottomText} style={{ flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p>Didn't receive code?</p>
                  <button
                    type="button"
                    className={styles.resendBtn}
                    onClick={handleResendOtp}
                    disabled={resendLoading || !canResend}
                    style={{ opacity: !canResend ? 0.5 : 1 }}
                  >
                    {resendLoading ? 'Sending...' : canResend ? 'Resend' : `Resend (${countdown}s)`}
                  </button>
                </div>
                <button
                  type="button"
                  className={styles.backToLoginBtn}
                  onClick={handleBackToLogin}
                >
                  Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className={styles.items}>
        <AuthSlider />
      </div>
    </div>
  );
}
