"use client"
import React, { useState, useEffect, useRef } from 'react'
import styles from './withdrawMoney.module.scss';
import CloseIcon from '@/icons/closeIcon';
import Input from '@/components/input';
import InfoIcon from '@/icons/infoIcon';
import Button from '@/components/button';
import { createCregisPayment, insertWithdraw } from '@/services/wallet';
import toast from 'react-hot-toast';
import WalletStatusModal from '@/components/modal/walletStatusModal';
import { useAuth } from '@/context/AuthContext';

export default function WithdrawMoney({ isOpen, onClose, type = 'withdraw', planDetails }) {
    const { user } = useAuth();
    const cashWallet = user?.wallets?.find(w => w.wallet_type === 'REAL');
    const cashBalance = cashWallet ? Number(cashWallet.balance).toLocaleString('en-IN') : '0';
    const [amount, setAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState('pending');
    const [expiryTime, setExpiryTime] = useState(null);
    const [coinAddress, setCoinAddress] = useState('');

    const popupRef = useRef(null);
    const pollRef = useRef(null);
    const expireTimerRef = useRef(null);
    const paymentResultReceived = useRef(false);

    useEffect(() => {
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
            if (expireTimerRef.current) clearTimeout(expireTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            setSelectedMethod(null);
            setCoinAddress('');
            if (type === 'plan' && planDetails) {
                setAmount(planDetails.price.toString());
            } else {
                setAmount('');
            }
        }
    }, [type, isOpen, planDetails]);

    const stopAllTimers = (messageHandler) => {
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
        if (expireTimerRef.current) { clearTimeout(expireTimerRef.current); expireTimerRef.current = null; }
        if (messageHandler) window.removeEventListener('message', messageHandler);
    };

    const attachMessageListener = (popup) => {
        paymentResultReceived.current = false;
        const handleMessage = (event) => {
            const { type: eventType } = event.data || {};
            if (eventType === 'PAYMENT_FAIL' || eventType === 'PAYMENT_SUCCESS') {
                paymentResultReceived.current = true;
                stopAllTimers(handleMessage);
                if (!popup.closed) popup.close();

                if (eventType === 'PAYMENT_FAIL') {
                    setModalStatus('rejected');
                } else {
                    setModalStatus('approved');
                }
            }
        };
        window.addEventListener('message', handleMessage);

        pollRef.current = setInterval(() => {
            if (popup.closed) {
                if (!paymentResultReceived.current) {
                    stopAllTimers(handleMessage);
                    setModalStatus('rejected');
                } else {
                    stopAllTimers(handleMessage);
                }
            }
        }, 800);

        return handleMessage;
    };

    const openPaymentPopup = (url, expireMs) => {
        const w = 820, h = 700;
        const left = Math.round(window.screenX + (window.outerWidth - w) / 2);
        const top = Math.round(window.screenY + (window.outerHeight - h) / 2);
        const popup = window.open(
            url, 'CradeBlaze_Cregis_Payment',
            `width=${w},height=${h},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );
        if (!popup) {
            toast.error('Popup was blocked by your browser. Please allow popups and try again.');
            return;
        }
        popupRef.current = popup;
        setModalStatus('pending');
        setIsStatusModalOpen(true);

        const handleMessage = attachMessageListener(popup);

        if (expireMs && expireMs > 0) {
            expireTimerRef.current = setTimeout(() => {
                if (!paymentResultReceived.current) {
                    stopAllTimers(handleMessage);
                    if (!popup.closed) popup.close();
                    setModalStatus('rejected');
                } else {
                    stopAllTimers(handleMessage);
                }
            }, expireMs);
        }
    };

    const paymentMethods = [
        {
            id: 1,
            coin_name: "USD",
            network_name: "TRON",
            currency_id: "198@198",
            title: "TRON",
            description: "Tron"
        }
    ];

    const handleAmountChange = (value) => {
        if (/^\d*\.?\d*$/.test(value) || value === '') {
            setAmount(value);
        }
    };

    const isDepositDisabled = !amount || loading;
    const isPlanDisabled = !amount || loading;
    const isWithdrawDisabled = !amount || !selectedMethod || !coinAddress || loading;

    const handleSubmit = async () => {
        if (type === 'deposit' || type === 'plan') {
            if (type === 'deposit' && isDepositDisabled) return;
            if (type === 'plan' && isPlanDisabled) return;
            setLoading(true);
            try {
                const payload = type === 'deposit' ? {
                    coinname: 'USD',
                    amount_usd: amount.toString(),
                    is_user_wallet_deposit: true,
                    is_user_wallet_withdraw: false
                } : {
                    coinname: 'USD',
                    amount_usd: amount.toString(),
                    is_prime_membership_payment: true,
                    plan_id: planDetails?.id
                };

                const response = await createCregisPayment(payload);

                if ((response?.success || response?.code === "00000") && response?.data?.checkout_url) {
                    const expireMs = response.data.expire_time
                        ? Math.max(0, response.data.expire_time - Date.now())
                        : 300000;

                    const currentTime = Math.floor(Date.now() / 1000);
                    setExpiryTime(currentTime + Math.floor(expireMs / 1000));

                    openPaymentPopup(response.data.checkout_url, expireMs);
                } else {
                    toast.error(response?.message || response?.error || 'Failed to generate payment invoice');
                }
            } catch (error) {
                toast.error(error?.message || 'Payment failed. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            if (isWithdrawDisabled) return;
            setLoading(true);
            try {
                const payload = {
                    coin_name: selectedMethod.coin_name,
                    network_name: selectedMethod.network_name,
                    amount: amount.toString(),
                    coin_address: coinAddress,
                    currency_id: selectedMethod.currency_id
                };

                const response = await insertWithdraw(payload);

                if (response?.code === 'success' || response?.success) {
                    setModalStatus('pending');
                    setIsStatusModalOpen(true);
                } else {
                    toast.error(response?.error || response?.message || 'Withdrawal request failed');
                }
            } catch (error) {
                toast.error(error?.message || 'Withdrawal failed. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleClose = () => {
        const wasSuccess = modalStatus === 'approved';
        setCoinAddress('');
        setSelectedMethod(null);
        setAmount('');
        setIsStatusModalOpen(false);
        setModalStatus('pending');
        if (onClose) {
            onClose(wasSuccess);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.withdrawMoneyWrapper} style={{ display: isStatusModalOpen ? 'none' : 'flex' }}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h2>{type === 'deposit' ? 'Deposit Money' : type === 'plan' ? (planDetails?.isRemainingPayment ? 'Pay Remaining Balance' : 'Upgrade Plan') : 'Withdraw Money'}</h2>
                        <div onClick={handleClose}>
                            <CloseIcon />
                        </div>
                    </div>
                    <div className={styles.modalBody}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#3DB042', marginBottom: '8px', textAlign: 'right' }}>
                            Available Balance: ${cashBalance}
                        </div>
                        <div className={styles.amount}>
                            <Input
                                label='Amount'
                                placeholder='Enter amount'
                                heightChange
                                value={amount}
                                onChange={handleAmountChange}
                                type="text"
                                maxLength={8}
                                disabled={type === 'plan'}
                            />
                            <span>
                                {type === 'plan' ? (planDetails?.isRemainingPayment ? 'Remaining balance' : 'Plan price') : `Minimum ${type === 'deposit' ? 'deposit' : 'withdrawal'}`}
                            </span>
                        </div>
                        {type === 'withdraw' && (
                            <div className={styles.withdrawal}>
                                <div className={styles.withdrawalTitle}>
                                    <div className={styles.iconBox}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                                            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                                            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                                        </svg>
                                    </div>
                                    <span>Payment Method</span>
                                </div>

                                <div className={styles.methodsList}>
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className={`${styles.methodItem} ${selectedMethod?.id === method.id ? styles.active : ''}`}
                                            onClick={() => setSelectedMethod(method)}
                                        >
                                            <div className={styles.checkbox}>
                                                {selectedMethod?.id === method.id ? (
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect width="24" height="24" rx="6" fill="#0000FF" />
                                                        <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                ) : (
                                                    <div className={styles.emptyCircle}></div>
                                                )}
                                            </div>
                                            <div className={styles.methodInfo}>
                                                <h3>{method.title}</h3>
                                                <p>{method.description.toUpperCase()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {type === 'withdraw' && (
                                    <div className={styles.amount} style={{ marginTop: '20px' }}>
                                        <Input
                                            label='Token Address'
                                            placeholder='Enter your token address'
                                            heightChange
                                            value={coinAddress}
                                            onChange={(val) => setCoinAddress(val)}
                                            type="text"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        {(type === "deposit" || type === "plan") && (
                            <div className={styles.warnning}>
                                <InfoIcon />
                                <p>
                                    A checkout window will open in a new popup to complete the payment via Cregis.
                                </p>
                            </div>
                        )}
                        <div className={styles.buttonAlignment}>
                            <Button text="Cancel" lightbutton onClick={handleClose} />
                            <Button
                                text={type === 'deposit' ? 'Deposit' : type === 'plan' ? (planDetails?.isRemainingPayment ? 'Pay Remaining' : 'Pay Now') : 'Withdraw'}
                                onClick={handleSubmit}
                                disabled={type === 'deposit' ? isDepositDisabled : type === 'plan' ? isPlanDisabled : isWithdrawDisabled}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <WalletStatusModal
                isOpen={isStatusModalOpen}
                status={modalStatus}
                type={type}
                amount={amount}
                expiryTime={expiryTime}
                onClose={handleClose}
            />
        </>
    )
}
