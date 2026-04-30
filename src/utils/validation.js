import { isValidPhoneNumber } from 'react-phone-number-input';

// ─── Sanitizers ──────────────────────────────────────────────────────────────
// Use these in onChange handlers to strip disallowed characters in real-time.

/** Names: letters, spaces, apostrophes, hyphens only */
export const sanitizeName = (v) => v.replace(/[^a-zA-Z\s'\-]/g, '');

/** Letters only (no digits, no special chars) */
export const sanitizeAlpha = (v) => v.replace(/[^a-zA-Z\s]/g, '');

/** Digits only */
export const sanitizeDigits = (v) => v.replace(/\D/g, '');

/** Letters + digits only (no special chars) */
export const sanitizeAlphanumeric = (v) => v.replace(/[^a-zA-Z0-9\s]/g, '');

/** Address: letters, digits, spaces, commas, periods, hyphens, slashes, # */
export const sanitizeAddress = (v) => v.replace(/[^a-zA-Z0-9\s,.\-/#]/g, '');

/** Zip/postal code: digits and hyphens only */
export const sanitizeZipCode = (v) => v.replace(/[^0-9\-]/g, '');

/** IFSC code: uppercase letters and digits only */
export const sanitizeIFSC = (v) => v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

/** Referral / promo code: uppercase letters and digits only */
export const sanitizeCode = (v) => v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

/** OTP: digits only, max 6 */
export const sanitizeOtp = (v) => v.replace(/\D/g, '').slice(0, 6);

/** Generic: strip leading/trailing spaces on blur (use onBlur, not onChange) */
export const trimValue = (v) => (typeof v === 'string' ? v.trim() : v);

// ─── Validators ──────────────────────────────────────────────────────────────
// Return an error string, or '' if valid.

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email)) return 'Enter a valid email address';
  if (/\.@/.test(email) || /^\./.test(email)) return 'Enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Must contain at least one number';
  return '';
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  if (!isValidPhoneNumber(phone)) return 'Enter a valid phone number';
  return '';
};

export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) return `${fieldName} is required`;
  return '';
};

export const validateConfirmPassword = (password, confirm) => {
  if (!confirm) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return '';
};

export const validateOtp = (otp) => {
  if (!otp || otp.length !== 6) return 'Enter the complete 6-digit code';
  if (!/^\d{6}$/.test(otp)) return 'Code must be 6 digits';
  return '';
};

/**
 * Validate a name field (first name, last name, account holder name, etc.)
 * Allows letters, spaces, apostrophes, hyphens.
 */
export const validateName = (value, fieldName = 'Name', { min = 2, max = 50 } = {}) => {
  if (!value || !value.trim()) return `${fieldName} is required`;
  if (value.trim().length < min) return `${fieldName} must be at least ${min} characters`;
  if (value.trim().length > max) return `${fieldName} must be at most ${max} characters`;
  if (/[^a-zA-Z\s'\-]/.test(value)) return `${fieldName} must contain letters only`;
  return '';
};

/**
 * Validate zip/postal code.
 * Allows digits and hyphens, 3–10 chars.
 */
export const validateZipCode = (value) => {
  if (!value || !value.trim()) return 'Zip code is required';
  if (!/^[0-9\-]{3,10}$/.test(value.trim())) return 'Enter a valid zip code';
  return '';
};

/**
 * Validate IFSC code: 4 letters + 0 + 6 alphanumeric chars.
 */
export const validateIFSC = (value) => {
  if (!value || !value.trim()) return 'IFSC code is required';
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.trim())) return 'Enter a valid IFSC code (e.g. HDFC0001234)';
  return '';
};

/**
 * Validate account number: digits only, 9–18 chars.
 */
export const validateAccountNumber = (value) => {
  if (!value || !value.trim()) return 'Account number is required';
  if (value.length < 9) return 'Minimum 9 digits required';
  if (value.length > 18) return 'Maximum 18 digits allowed';
  return '';
};

/**
 * Generic min/max length validator.
 */
export const validateLength = (value, fieldName = 'This field', { min = 2, max = 100 } = {}) => {
  if (!value || !value.trim()) return `${fieldName} is required`;
  if (value.trim().length < min) return `${fieldName} must be at least ${min} characters`;
  if (value.trim().length > max) return `${fieldName} must be at most ${max} characters`;
  return '';
};
