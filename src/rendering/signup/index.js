'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import styles from './signup.module.scss';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import Button from '@/components/button';
import { signup, getRoles } from '@/services/auth';

const EyeIcon = '/assets/icons/eye.svg';
const EyeFillIcon = '/assets/icons/eye-fill.svg';
const Logo = '/assets/logo/logo.svg';

export default function Signup() {
  const router = useRouter();
  const [userRoleId, setUserRoleId] = useState('');
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    password: '', confirm_password: '',
    phone: '', referralCode: '', agreed: false,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    getRoles()
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || data.roles || [];
        const userRole = list.find(r => r.name?.toLowerCase() === 'user') || list[0];
        if (userRole) setUserRoleId(userRole.id);
      })
      .catch(() => {});
  }, []);

  const set = (field) => (v) => {
    setForm(f => ({ ...f, [field]: v }));
    setErrors(e => { if (!e[field]) return e; const n = { ...e }; delete n[field]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'First name is required';
    if (!form.last_name.trim()) e.last_name = 'Last name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(form.email) || /\.@/.test(form.email) || /^\./.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone) e.phone = 'Phone number is required';
    else if (!isValidPhoneNumber(form.phone)) e.phone = 'Enter a valid phone number';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'At least 8 characters';
    else if (!/[A-Z]/.test(form.password)) e.password = 'Must include an uppercase letter';
    else if (!/[0-9]/.test(form.password)) e.password = 'Must include a number';
    if (!form.confirm_password) e.confirm_password = 'Please confirm your password';
    else if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match';
    if (!form.agreed) e.agreed = 'You must accept the terms';
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
      const parsed = parsePhoneNumber(form.phone);
      const country_code = `+${parsed.countryCallingCode}`;
      const phone = parsed.nationalNumber;
      const country = parsed.country || '';
      const data = await signup({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        phone,
        country_code,
        country,
        roleId: userRoleId,
        ...(form.referralCode.trim() && { referralCode: form.referralCode.trim() }),
      });
      const token = data?.data?.access_token || data?.data?.token || data?.access_token || data?.token || '';
      localStorage.setItem('token', token);
      router.push('/email-verify?mode=verify');
    } catch (err) {
      setApiError(err?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.flexbox}>
      <div className={styles.items}>
        <div className={styles.logo} onClick={()=>router.push("/")}>
          <img src={Logo} alt="Logo" />
        </div>
        <div className={styles.box}>
          <div className={styles.text}>
            <h1>Create an account</h1>
            <p>Empower Your Projects, Simplify Your Success!</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.twocol}>
              <Input label="First Name" placeholder="John" name="first_name" heightChange
                value={form.first_name} onChange={set('first_name')} error={errors.first_name} />
              <Input label="Last Name" placeholder="Doe" name="last_name" heightChange
                value={form.last_name} onChange={set('last_name')} error={errors.last_name} />
            </div>
            <div className={styles.spacing}>
              <Input label="Email Address" placeholder="you@example.com" type="email" name="email" heightChange
                value={form.email} onChange={set('email')} error={errors.email} />

              <div className={styles.phoneField}>
                <label className={styles.phoneLabel}>Phone Number</label>
                <PhoneInput
                  international
                  defaultCountry="US"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={set('phone')}
                  className={errors.phone ? styles.phoneInputError : styles.phoneInput}
                />
                {errors.phone && <p className={styles.errorMsg} role="alert">{errors.phone}</p>}
              </div>


              <Input label="Password" placeholder="Password" name="password" heightChange
                type={showPassword ? 'text' : 'password'} rightIcon={showPassword ? EyeFillIcon : EyeIcon}
                onRightIconClick={() => setShowPassword(s => !s)}
                value={form.password} onChange={set('password')} error={errors.password} />
              <Input label="Confirm Password" placeholder="Confirm password" name="confirm_password" heightChange
                type={showConfirm ? 'text' : 'password'} rightIcon={showConfirm ? EyeFillIcon : EyeIcon}
                onRightIconClick={() => setShowConfirm(s => !s)}
                value={form.confirm_password} onChange={set('confirm_password')} error={errors.confirm_password} />

              <Input label="Referral Code (optional)" placeholder="Enter referral code" name="referralCode" heightChange
                value={form.referralCode} onChange={set('referralCode')} />
            </div>

            <div className={styles.checkboxText}>
              <input type="checkbox" id="terms" checked={form.agreed}
                onChange={(e) => {
                  setForm(f => ({ ...f, agreed: e.target.checked }));
                  setErrors(er => { const n = { ...er }; delete n.agreed; return n; });
                }}
                aria-invalid={!!errors.agreed} />
              <p>
                I agree to the CredBlaze <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>
              </p>
            </div>
            {errors.agreed && <p className={styles.errorMsg} role="alert">{errors.agreed}</p>}
            {apiError && <p className={styles.apiError} role="alert">{apiError}</p>}

            <Button text={loading ? 'Creating account...' : 'Sign Up'} disabled={loading} />
          </form>
          <div className={styles.bottomText}>
            <p>Already have an account?</p>
            <Link href="/">Sign in</Link>
          </div>
        </div>
      </div>
      <div className={styles.items}>
        <AuthSlider />
      </div>
    </div>
  );
}
