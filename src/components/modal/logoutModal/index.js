import React from 'react'
import styles from './logoutModal.module.scss';
import Button from '@/components/button';

const CloseIcon = '/assets/icons/close-vec.svg';

export default function LogoutModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Logout',
    description = 'Are you sure want to Logout to CredBlaze ?',
    confirmText = 'Yes, Logout',
    cancelText = 'Cancel',
    loading = false,
    icon = CloseIcon,
    isDanger = true
}) {
    if (!isOpen) return null;

    return (
        <div className={styles.logoutModalWrapper}>
            <div className={styles.modal}>
                <div className={styles.iconCenter}>
                    {isDanger && (
                        <div className={styles.dangerIcon}>
                            {typeof icon === 'string' ? <img src={icon} alt='DangerIcon' /> : icon}
                        </div>
                    )}
                </div>
                <h2>
                    {title}
                </h2>
                <p>
                    {description}
                </p>
                <div className={styles.buttongrid}>
                    <Button
                        text={cancelText}
                        lightbutton
                        onClick={onClose}
                        disabled={loading}
                    />
                    <Button
                        text={loading ? 'Processing...' : confirmText}
                        danger={isDanger}
                        onClick={onConfirm}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    )
}
