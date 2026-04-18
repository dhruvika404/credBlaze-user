'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import styles from './login.module.scss';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import LoginwithGoogle from '@/components/loginwithGoogle';
import Button from '@/components/button';
import { login } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';

const EmailIcon = '/assets/icons/email.svg';
const EyeIcon = '/assets/icons/eye.svg';
const EyeFillIcon = '/assets/icons/eye-fill.svg';
const Logo = '/assets/logo/logo.svg';

export default function Login() {
  const router = useRouter();
  const { deviceId, login: authLogin } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const data = await login({ email: form.email, password: form.password, device_id: deviceId });
      const token = data?.data?.access_token || data?.access_token || data?.token || '';
      const userData = data?.data?.user || data?.user || null;

      authLogin(userData, token);
      toast.success('Signed in successfully');
      router.push('/dashboard');
    } catch {
      // error toast already fired by auth service
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
                maxLength={12}
              />
              <div className={styles.forgotpassword}>
                <Link href="/email-verify">Forgot Password?</Link>
              </div>
            </div>
            <div className={styles.orline}>
              <div className={styles.line}></div>
              <span>OR</span>
              <div className={styles.line}></div>
            </div>
            <LoginwithGoogle />
            <Button text={loading ? 'Signing in...' : 'Sign In'} disabled={loading} />
          </form>
          <div className={styles.bottomText}>
            <p>Don't have an account?</p>
            <Link href="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
      <div className={styles.items}>
        <AuthSlider />
      </div>
    </div>
  );
}
