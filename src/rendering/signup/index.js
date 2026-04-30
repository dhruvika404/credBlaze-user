'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import styles from './signup.module.scss';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import Button from '@/components/button';
import { getRoles } from '@/services/auth';
import { signupAction } from '@/app/actions/auth/auth';
import { sanitizeName, sanitizeCode, validateEmail, validatePassword, validateConfirmPassword, validateName } from '@/utils/validation';

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
  const [isPending, startTransition] = React.useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { deviceId, login: authLogin } = useAuth();

  useEffect(() => {
    getRoles()
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || data.roles || [];
        const userRole = list.find(r => r.name?.toLowerCase() === 'user') || list[0];
        if (userRole) setUserRoleId(userRole.id);
      })
      .catch(() => { });
  }, []);

  const set = (field) => (v) => {
    setForm(f => ({ ...f, [field]: v }));
    setErrors(e => { if (!e[field]) return e; const n = { ...e }; delete n[field]; return n; });
  };

  const validate = () => {
    const e = {};
    const fnErr = validateName(form.first_name, 'First name');
    if (fnErr) e.first_name = fnErr;
    const lnErr = validateName(form.last_name, 'Last name');
    if (lnErr) e.last_name = lnErr;
    const emailErr = validateEmail(form.email);
    if (emailErr) e.email = emailErr;
    if (form.phone && !isValidPhoneNumber(form.phone)) e.phone = 'Enter a valid phone number';
    const pwErr = validatePassword(form.password);
    if (pwErr) e.password = pwErr;
    const cpErr = validateConfirmPassword(form.password, form.confirm_password);
    if (cpErr) e.confirm_password = cpErr;
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

    startTransition(async () => {
      try {
        const parsed = form.phone ? parsePhoneNumber(form.phone) : null;
        const country_code = parsed ? `+${parsed.countryCallingCode}` : '';
        const phone = parsed ? parsed.nationalNumber : '';
        const country = parsed?.country || '';
        const res = await signupAction({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
          phone,
          country_code,
          country,
          roleId: userRoleId,
          device_id: deviceId,
          ...(form.referralCode.trim() && { referralCode: form.referralCode.trim() }),
        });

        if (res.success) {
          const token = res.data?.data?.access_token || res.data?.data?.token || res.data?.access_token || res.data?.token || '';
          const userData = res.data?.data?.user || res.data?.user || null;
          await authLogin(userData, token);
          router.push('/email-verify?mode=verify');
        } else {
          setApiError(res.error || 'Signup failed. Please try again.');
        }
      } catch (err) {
        setApiError(err?.message || 'Signup failed. Please try again.');
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className={styles.flexbox}>
      <div className={styles.items}>
        <div className={styles.logo} onClick={() => router.push("/")}>
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
                value={form.first_name} onChange={set('first_name')} error={errors.first_name} required
                sanitize={sanitizeName} maxLength={50} />
              <Input label="Last Name" placeholder="Doe" name="last_name" heightChange
                value={form.last_name} onChange={set('last_name')} error={errors.last_name} required
                sanitize={sanitizeName} maxLength={50} />
            </div>
            <div className={styles.spacing}>
              <Input label="Email Address" placeholder="you@example.com" type="email" name="email" heightChange
                value={form.email} onChange={set('email')} error={errors.email} required />

              <div className={styles.phoneField}>
                <label className={styles.phoneLabel}>
                  Phone Number
                </label>
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
                value={form.password} onChange={set('password')} error={errors.password} required maxLength={12} />
              <Input label="Confirm Password" placeholder="Confirm password" name="confirm_password" heightChange
                type={showConfirm ? 'text' : 'password'} rightIcon={showConfirm ? EyeFillIcon : EyeIcon}
                onRightIconClick={() => setShowConfirm(s => !s)}
                value={form.confirm_password} onChange={set('confirm_password')} error={errors.confirm_password} required maxLength={12} />

              <Input label="Referral Code (optional)" placeholder="Enter referral code" name="referralCode" heightChange
                value={form.referralCode} onChange={set('referralCode')} sanitize={sanitizeCode} maxLength={20} />
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

            <Button text={loading || isPending ? 'Creating account...' : 'Sign Up'} disabled={loading || isPending} />
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
