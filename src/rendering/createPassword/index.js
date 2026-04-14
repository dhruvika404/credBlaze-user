'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './createPassword.module.scss';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import Button from '@/components/button';
import { resetPassword } from '@/services/auth';

const LockIcon = '/assets/icons/lock.svg';
const EyeIcon = '/assets/icons/eye.svg';
const Logo = '/assets/logo/logo.svg';

export default function CreatePassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [form, setForm] = useState({ new_password: '', confirm_password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.new_password) e.new_password = 'Password is required';
    else if (form.new_password.length < 8) e.new_password = 'At least 8 characters';
    else if (!/[A-Z]/.test(form.new_password)) e.new_password = 'Must include an uppercase letter';
    else if (!/[0-9]/.test(form.new_password)) e.new_password = 'Must include a number';
    if (!form.confirm_password) e.confirm_password = 'Please confirm your password';
    else if (form.new_password !== form.confirm_password) e.confirm_password = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError('');
    setLoading(true);
    try {
      await resetPassword({ email, new_password: form.new_password, confirm_password: form.confirm_password });
      router.push('/successfully-message');
    } catch (err) {
      setApiError(err?.message || 'Failed to reset password. Please try again.');
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
            <h1>Create a new password</h1>
            <p>Must be at least 8 characters with a number and uppercase letter.</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.inputAlignment}>
              <Input
                label="New Password"
                placeholder="New password"
                name="new_password"
                type={showNew ? 'text' : 'password'}
                rightIcon={EyeIcon}
                onRightIconClick={() => setShowNew(s => !s)}
                icon={LockIcon}
                value={form.new_password}
                onChange={(v) => setForm(f => ({ ...f, new_password: v }))}
                error={errors.new_password}
              />
            </div>
            <Input
              label="Confirm Password"
              placeholder="Confirm password"
              name="confirm_password"
              type={showConfirm ? 'text' : 'password'}
              rightIcon={EyeIcon}
              onRightIconClick={() => setShowConfirm(s => !s)}
              icon={LockIcon}
              value={form.confirm_password}
              onChange={(v) => setForm(f => ({ ...f, confirm_password: v }))}
              error={errors.confirm_password}
            />
            {apiError && <p className={styles.apiError} role="alert">{apiError}</p>}
            <div className={styles.topAlignment}>
              <Button text={loading ? 'Saving...' : 'Save Password'} disabled={loading} />
            </div>
          </form>
          <div className={styles.bottomText}>
            <p>Need Help?</p>
            <a href="mailto:support@credblaze.com">Contact us</a>
          </div>
        </div>
      </div>
      <div className={styles.items}>
        <AuthSlider />
      </div>
    </div>
  );
}
