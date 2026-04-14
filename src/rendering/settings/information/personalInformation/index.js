'use client';
import React, { useState, useEffect } from 'react';
import styles from './personalInformation.module.scss';
import Input from '@/components/input';
import Dropdown from '@/components/dropdown';
import Button from '@/components/button';
import PhoneInput, { parsePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { COUNTRIES } from '@/utils/countries';
import toast from 'react-hot-toast';
import { updateProfileDetails } from '@/services/profile';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.667 1.667v1.666M13.333 1.667v1.666M2.5 7.5h15M3.333 3.333h13.334c.46 0 .833.373.833.834v13.333c0 .46-.373.833-.833.833H3.333c-.46 0-.833-.373-.833-.833V4.167c0-.46.373-.834.833-.834z"
      stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.667 11.667h.833M10 11.667h.833M13.333 11.667h.833M6.667 14.167h.833M10 14.167h.833M13.333 14.167h.833"
      stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function pick(obj, ...keys) {
  for (const k of keys) if (obj?.[k]) return obj[k];
  return '';
}

function toDateInput(val) {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toISOString().slice(0, 10);
}

function sanitizeName(val) {
  return val.replace(/[^a-zA-Z\s'\-]/g, '');
}

function validate(form) {
  const e = {};
  if (!form.first_name.trim()) e.first_name = 'First name is required';
  else if (form.first_name.trim().length < 2) e.first_name = 'At least 2 characters';

  if (!form.last_name.trim()) e.last_name = 'Last name is required';
  else if (form.last_name.trim().length < 2) e.last_name = 'At least 2 characters';

  if (form.phone && !isValidPhoneNumber(form.phone)) e.phone = 'Enter a valid phone number';

  return e;
}

export default function PersonalInformation({ isEditing, profile, onSaved }) {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    phone: '', dob: '', gender: '', country: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;

    const rawPhone = pick(profile, 'phone', 'phoneNumber', 'phone_number');
    const rawCode = pick(profile, 'country_code', 'countryCode');
    const phoneVal = rawCode && rawPhone
      ? (rawCode.startsWith('+') ? rawCode : `+${rawCode}`) + rawPhone
      : rawPhone || '';

    setForm({
      first_name: pick(profile, 'first_name', 'firstName'),
      last_name: pick(profile, 'last_name', 'lastName'),
      email: pick(profile, 'email'),
      phone: phoneVal,
      dob: toDateInput(pick(profile, 'birthday', 'dob', 'date_of_birth', 'dateOfBirth')),
      gender: pick(profile, 'gender'),
      country: pick(profile, 'country'),
    });
    setErrors({});
  }, [profile, isEditing]);

  const set = (field) => (v) => {
    setForm((f) => ({ ...f, [field]: v }));
    setErrors((e) => { if (!e[field]) return e; const n = { ...e }; delete n[field]; return n; });
  };

  const setName = (field) => (v) => {
    set(field)(sanitizeName(v));
  };

  const handleSave = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      let phone = form.phone;
      let country_code = '';
      if (form.phone && isValidPhoneNumber(form.phone)) {
        const parsed = parsePhoneNumber(form.phone);
        country_code = `+${parsed.countryCallingCode}`;
        phone = parsed.nationalNumber;
      }

      const payload = {
        firstName: form.first_name.trim(),
        lastName: form.last_name.trim(),
        gender: form.gender,
        country: form.country,
        ...(form.dob && { birthday: form.dob }),
        ...(phone && { phone }),
        ...(country_code && { countryCode: country_code }),
      };

      await updateProfileDetails(payload);
      toast.success('Profile updated successfully');
      onSaved?.(payload);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const selectedGender = GENDER_OPTIONS.find((o) => o.value === form.gender?.toLowerCase()) || null;
  const selectedCountry = COUNTRIES.find((o) => o.value === form.country) || null;

  if (!isEditing) {
    return (
      <div className={styles.personalInformation}>
        <div className={styles.content}>
          <h2>Personal Information</h2>
          <p>Modify Your Personal Information</p>
        </div>
        <div className={styles.twocol}>
          <Input label="First Name" labelChange value={form.first_name} placeholder="Naitik" disabled />
          <Input label="Last Name" labelChange value={form.last_name} placeholder="Kumar" disabled />
          <Input label="Email" labelChange value={form.email} placeholder="hiNaitik@gmail.com" disabled />
          <div className={styles.phoneReadonly}>
            <label>Phone Number</label>
            <PhoneInput international disabled value={form.phone || '+1'} className={styles.phoneInputDisabled} />
          </div>
          <Input label="Date of Birth" labelChange value={form.dob ? new Date(form.dob + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''} placeholder="July 12, 1998" disabled />
          <Input label="Gender" labelChange value={form.gender} placeholder="Male" disabled />
          <Input label="Country" labelChange value={selectedCountry?.label || form.country}
            placeholder="United States of America" disabled />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.personalInformation}>
      <div className={styles.spacingGrid}>
        <div className={styles.content}>
          <h2>Personal Information</h2>
          <p>Modify Your Personal Information</p>
        </div>
        <div className={styles.twocol}>
          <Input label="First Name" labelChange placeholder="Naitik" name="first_name"
            value={form.first_name} onChange={setName('first_name')}
            error={errors.first_name} maxLength={50} />

          <Input label="Last Name" labelChange placeholder="Kumar" name="last_name"
            value={form.last_name} onChange={setName('last_name')}
            error={errors.last_name} maxLength={50} />

          <div className={styles.phoneField}>
            <label className={styles.phoneLabel}>Phone Number</label>
            <PhoneInput
              international
              defaultCountry="US"
              placeholder="(555) 000-0000"
              value={form.phone || '+1'}
              onChange={(val) => {
                set('phone')(val === '+1' ? '' : (val || ''));
              }}
              className={errors.phone ? styles.phoneInputError : styles.phoneInput}
            />
            {errors.phone && <p className={styles.errorMsg} role="alert">{errors.phone}</p>}
          </div>

          <div className={styles.dateField}>
            <label className={styles.dateLabel}>Date of Birth</label>
            <div className={styles.dateInputWrap}>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => set('dob')(e.target.value)}
                className={styles.dateInput}
              />
              <span className={styles.calendarIcon}><CalendarIcon /></span>
            </div>
          </div>

          <Dropdown label="Gender" labelChange options={GENDER_OPTIONS}
            value={selectedGender} onChange={(opt) => set('gender')(opt?.value || '')}
            placeholder="Male" />

          <Dropdown label="Country" labelChange options={COUNTRIES} searchable
            value={selectedCountry} onChange={(opt) => set('country')(opt?.value || '')}
            placeholder="United States of America" />
        </div>
      </div>

      <div className={styles.actions}>
        <Button text="Cancel" lightbutton onClick={() => { setErrors({}); onSaved?.(null); }} />
        <Button text={saving ? 'Saving...' : 'Save Changes'} disabled={saving}
          onClick={handleSave} type="button" />
      </div>
    </div>
  );
}
