"use client"
import React, { useState, useEffect, useRef } from 'react'
import styles from './withdrawMoney.module.scss';
import CloseIcon from '@/icons/closeIcon';
import Input from '@/components/input';
import InfoIcon from '@/icons/infoIcon';
import Button from '@/components/button';
import { createCryptoPayment, getFilteredBalance, insertWithdraw } from '@/services/wallet';
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
    const [step, setStep] = useState(1);
    const [availableCoins, setAvailableCoins] = useState([]);
    const [coinAddress, setCoinAddress] = useState('');

    const popupRef = useRef(null);
    const pollRef = useRef(null);
    const expireTimerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
            if (expireTimerRef.current) clearTimeout(expireTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (isOpen && type === 'plan' && planDetails) {
            setAmount(planDetails.price.toString());
        }
    }, [isOpen, type, planDetails]);

    const stopAllTimers = (messageHandler) => {
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
        if (expireTimerRef.current) { clearTimeout(expireTimerRef.current); expireTimerRef.current = null; }
        if (messageHandler) window.removeEventListener('message', messageHandler);
    };

    const attachMessageListener = (popup) => {
        const handleMessage = (event) => {
            const { type: eventType } = event.data || {};
            if (eventType === 'PAYMENT_FAIL' || eventType === 'PAYMENT_SUCCESS') {
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
                stopAllTimers(handleMessage);
                setModalStatus('rejected');
            }
        }, 800);

        return handleMessage;
    };

    const openPaymentPopup = (url, expireMs) => {
        const w = 820, h = 700;
        const left = Math.round(window.screenX + (window.outerWidth - w) / 2);
        const top = Math.round(window.screenY + (window.outerHeight - h) / 2);
        const popup = window.open(
            url, 'CradeBlaze_Payment',
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
                stopAllTimers(handleMessage);
                if (!popup.closed) popup.close();
                setModalStatus('rejected');
            }, expireMs);
        }
    };

    const paymentMethods = [
        {
            id: 1,
            coinname: "USDT",
            networkname: "BEP20",
            title: "BEP20",
            description: "bnb chain"
        },
        {
            id: 2,
            coinname: "USDT",
            networkname: "TRC20",
            title: "TRC20",
            description: "Tron"
        }
    ];

    const handleAmountChange = (value) => {
        if (/^\d*\.?\d*$/.test(value) || value === '') {
            setAmount(value);
        }
    };

    const filteredMethods = type === 'withdraw'
        ? paymentMethods.filter(m => availableCoins.includes(m.networkname))
        : paymentMethods;

    const isNextDisabled = !amount || loading;
    const isDepositDisabled = !amount || !selectedMethod || loading;
    const isPlanDisabled = !amount || !selectedMethod || loading;
    const isWithdrawDisabled = !amount || !selectedMethod || !coinAddress || loading;

    const handleNext = async () => {
        if (isNextDisabled) return;
        setLoading(true);
        try {
            const response = await getFilteredBalance({ check_amount: Number(amount) });
            if (response?.success) {
                setAvailableCoins(response.coins || []);
                setStep(2);
            } else {
                toast.error('Balance check failed or insufficient funds.');
            }
        } catch (error) {
            console.error('Balance check error:', error);
            toast.error(error?.message || 'Error checking balance.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (type === 'deposit' || type === 'plan') {
            if (type === 'deposit' && isDepositDisabled) return;
            if (type === 'plan' && isPlanDisabled) return;
            setLoading(true);
            try {
                const payload = type === 'deposit' ? {
                    networkname: selectedMethod.networkname,
                    coinname: selectedMethod.coinname,
                    amount_usd: amount.toString(),
                    is_user_wallet_deposit: true,
                    is_user_wallet_withdraw: false
                } : {
                    networkname: selectedMethod.networkname,
                    coinname: selectedMethod.coinname,
                    amount_usd: amount.toString(),
                    is_prime_membership_payment: true,
                    plan_id: planDetails?.id
                };

                const response = await createCryptoPayment(payload);

                if (response?.success && response?.data?.invoice_payment_url) {
                    const expireMs = response.data.invoiceexpiretime || 300000;
                    const currentTime = Math.floor(Date.now() / 1000);
                    setExpiryTime(currentTime + Math.floor(expireMs / 1000));

                    openPaymentPopup(response.data.invoice_payment_url, expireMs);
                } else {
                    toast.error('Failed to generate payment invoice');
                }
            } catch (error) {
                console.error('Payment error:', error);
                toast.error(error?.message || 'Payment failed. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            if (isWithdrawDisabled) return;
            setLoading(true);
            try {
                const payload = {
                    coinname: "USDT",
                    network_name: selectedMethod.networkname,
                    amount: amount.toString(),
                    coinaddress: coinAddress
                };

                const response = await insertWithdraw(payload);

                if (response?.code === 'success' || response?.success) {
                    setModalStatus('pending');
                    setIsStatusModalOpen(true);
                } else {
                    toast.error(response?.message || 'Withdrawal request failed');
                }
            } catch (error) {
                console.error('Withdraw error:', error);
                toast.error(error?.message || 'Withdrawal failed. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleClose = () => {
        setStep(1);
        setAvailableCoins([]);
        setCoinAddress('');
        setSelectedMethod(null);
        setAmount('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.withdrawMoneyWrapper} style={{ display: isStatusModalOpen ? 'none' : 'flex' }}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h2>{type === 'deposit' ? 'Deposit Money' : type === 'plan' ? 'Upgrade Plan' : 'Withdraw Money'}</h2>
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
                                {type === 'plan' ? 'Plan price' : `Minimum ${type === 'deposit' ? 'deposit' : 'withdrawal'}`}
                            </span>
                        </div>
                        {(type === 'deposit' || type === 'plan' || (step === 2 && availableCoins.length > 0)) && (
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
                                    {filteredMethods.map((method) => (
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
                                {type === 'withdraw' && step === 2 && (
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
                        {type === 'withdraw' && step === 2 && availableCoins.length === 0 && (
                            <div className={styles.warnning}>
                                <InfoIcon />
                                <p>No payment methods available for the entered amount.</p>
                            </div>
                        )}
                        {(type === "deposit" || type === "plan") && (
                            <div className={styles.warnning}>
                                <InfoIcon />
                                <p>
                                    A QR code invoice will open in a popup window. Scan it to complete the payment.
                                </p>
                            </div>
                        )}
                        <div className={styles.buttonAlignment}>
                            <Button text="Cancel" lightbutton onClick={handleClose} />
                            {type === 'withdraw' && step === 1 ? (
                                <Button text="Next" onClick={handleNext} disabled={isNextDisabled} />
                            ) : (
                                <Button
                                    text={type === 'deposit' ? 'Deposit' : type === 'plan' ? 'Pay Now' : 'Withdraw'}
                                    onClick={handleSubmit}
                                    disabled={type === 'deposit' ? isDepositDisabled : type === 'plan' ? isPlanDisabled : isWithdrawDisabled}
                                />
                            )}
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
                onClose={() => {
                    setIsStatusModalOpen(false);
                    handleClose();
                }}
            />
        </>
    )
}
