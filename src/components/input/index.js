'use client';
import React from 'react';
import styles from './input.module.scss';
import classNames from 'classnames';

export default function Input({
  label,
  placeholder,
  icon,
  rightIcon,
  onRightIconClick,
  heightChange,
  type = 'text',
  value,
  onChange,
  error,
  labelChange,
  name,
  disabled,
  maxLength,
  inputMode,
  required,
  /**
   * sanitize: optional function (string) => string
   * Applied on every keystroke and paste before calling onChange.
   * Import from src/utils/validation.js, e.g. sanitizeName, sanitizeDigits, etc.
   */
  sanitize,
}) {
  const handleChange = (e) => {
    let val = e.target.value;
    if (sanitize) val = sanitize(val);
    onChange?.(val);
  };

  // Also sanitize pasted content
  const handlePaste = (e) => {
    if (!sanitize) return;
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const sanitized = sanitize(pasted);
    // Insert at cursor position
    const input = e.target;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const current = value ?? '';
    const next = current.slice(0, start) + sanitized + current.slice(end);
    const limited = maxLength ? next.slice(0, maxLength) : next;
    onChange?.(limited);
  };

  return (
    <div className={classNames(styles.input, labelChange ? styles.labelChange : '')}>
      {label && (
        <label>
          {label}
          {required && <span className={styles.requiredStar} aria-hidden="true"> *</span>}
        </label>
      )}
      <div
        className={classNames(
          styles.inputrelative,
          rightIcon ? styles.righticonSpacing : '',
          icon ? styles.leftSpacing : '',
          heightChange ? styles.heightChange : '',
          error ? styles.hasError : ''
        )}
      >
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          name={name}
          disabled={disabled}
          maxLength={maxLength}
          inputMode={inputMode}
          required={required}
          onChange={handleChange}
          onPaste={handlePaste}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        {icon && (
          <div className={styles.lefticon}>
            <img src={icon} alt="" aria-hidden="true" />
          </div>
        )}
        {rightIcon && (
          <div
            className={styles.rightIcon}
            onClick={onRightIconClick}
            role={onRightIconClick ? 'button' : undefined}
            tabIndex={onRightIconClick ? 0 : undefined}
            onKeyDown={onRightIconClick ? (e) => e.key === 'Enter' && onRightIconClick() : undefined}
            aria-label={onRightIconClick ? 'Toggle visibility' : undefined}
          >
            <img src={rightIcon} alt="" aria-hidden="true" />
          </div>
        )}
      </div>
      {error && (
        <p className={styles.errorMsg} id={`${name}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
