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
}) {
  return (
    <div className={classNames(styles.input, labelChange ? styles.labelChange : '')} >
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
          onChange={(e) => onChange?.(e.target.value)}
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
      {
        error && (
          <p className={styles.errorMsg} id={`${name}-error`} role="alert">
            {error}
          </p>
        )
      }
    </div >
  );
}
