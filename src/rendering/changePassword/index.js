'use client';
import React, { useState } from 'react';
import styles from './changePassword.module.scss';
import Button from '@/components/button';
import Input from '@/components/input';
import toast from 'react-hot-toast';
import { changePassword } from '@/services/auth';

const EyeIcon = '/assets/icons/eye.svg';
const EyeFillIcon = '/assets/icons/eye-fill.svg';
const LockIcon = '/assets/icons/lock.svg';

function validate(form) {
  const e = {};
  if (!form.currentPassword) e.currentPassword = 'Current password is required';
  if (!form.newPassword) e.newPassword = 'New password is required';
  else if (form.newPassword.length < 8) e.newPassword = 'Password must be at least 8 characters';
  else if (form.currentPassword && form.newPassword === form.currentPassword) e.newPassword = 'New password must be different from current password';
  if (!form.confirmPassword) e.confirmPassword = 'Confirm password is required';
  else if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
  return e;
}

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (field) => (v) => {
    setForm((f) => ({ ...f, [field]: typeof v === 'object' ? v.target.value : v }));
    setErrors((e) => { if (!e[field]) return e; const n = { ...e }; delete n[field]; return n; });
  };

  const handleSave = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      await changePassword(
        { old_password: form.currentPassword, new_password: form.newPassword, confirm_password: form.confirmPassword },
        token
      );
      toast.success('Password changed successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    } catch {
      // error toast handled in service
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
  };

  return (
    <div className={styles.outlinebox}>
      <div className={styles.spacingGrid}>
        <div className={styles.passwordDetails}>
          <div className={styles.content}>
            <h3>Password</h3>
            <p>Modify Your Current Password</p>
          </div>
          <div className={styles.threeCol}>
            <Input
              labelChange
              required
              label="Current Password"
              placeholder="• • • • • • • • • • "
              rightIcon={showCurrent ? EyeFillIcon : EyeIcon}
              onRightIconClick={() => setShowCurrent(s => !s)}
              icon={LockIcon}
              type={showCurrent ? 'text' : 'password'}
              value={form.currentPassword}
              onChange={set('currentPassword')}
              error={errors.currentPassword}
              maxLength={12}
            />
            <Input
              labelChange
              required
              label="New Password"
              placeholder="• • • • • • • • • • "
              rightIcon={showNew ? EyeFillIcon : EyeIcon}
              onRightIconClick={() => setShowNew(s => !s)}
              icon={LockIcon}
              type={showNew ? 'text' : 'password'}
              value={form.newPassword}
              onChange={set('newPassword')}
              error={errors.newPassword}
              maxLength={12}
            />
            <Input
              labelChange
              required
              label="Confirm New Password"
              placeholder="• • • • • • • • • • "
              rightIcon={showConfirm ? EyeFillIcon : EyeIcon}
              onRightIconClick={() => setShowConfirm(s => !s)}
              icon={LockIcon}
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              error={errors.confirmPassword}
              maxLength={12}
            />
          </div>
        </div>
      </div>
      <div className={styles.boxFooter}>
        <Button text="Cancel" lightbutton onClick={handleCancel} />
        <Button text={saving ? 'Saving...' : 'Save'} onClick={handleSave} disabled={saving} />
      </div>
    </div>
  );
}
