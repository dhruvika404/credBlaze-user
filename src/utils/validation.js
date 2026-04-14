import { isValidPhoneNumber } from 'react-phone-number-input';

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
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
  if (!value || !value.trim()) return `${fieldName} is required`;
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
