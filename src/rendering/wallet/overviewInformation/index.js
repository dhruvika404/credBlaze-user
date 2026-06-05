"use client"
import React, { useState, useEffect, useRef, useMemo } from 'react'
import styles from './overviewInformation.module.scss';
import Button from '@/components/button';
import WithdrawMoney from '../withdrawMoney';
import { useAuth } from '@/context/AuthContext';
import { convertCurrency } from '@/services/wallet';
import { Country } from 'country-state-city';
const PlusIcon = '/assets/icons/plus.svg';
const DownloadIcon = '/assets/images/download.svg';
const PointsWalletIcon = '/assets/images/earning.svg';
const RealWalletIcon = '/assets/images/earning.svg';

const countryList = Country.getAllCountries().map(c => ({
    id: c.isoCode,
    name: c.name,
    currencyCode: c.currency || c.isoCode
}));

function getFlagUrl(countryCode) {
    if (!countryCode || countryCode.length !== 2) return null;
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

export default function OverviewInformation({ onTransactionSuccess }) {
    const { user } = useAuth();
    const dropdownRef = useRef(null);

    const [state, setState] = useState({
        isModalOpen: false,
        modalType: 'withdraw',
        isDropdownOpen: false,
        selectedCurrency: countryList.find(c => c.id === 'IN') || countryList[0],
        convertedAmount: 0,
        searchQuery: '',
        isConverting: false
    });
    const set = (fields) => setState(prev => ({ ...prev, ...fields }));

    const { cashBalance, pointsBalance, isBalanceZero } = useMemo(() => {
        const cashW = user?.wallets?.find(w => w.wallet_type === 'REAL');
        const pointsW = user?.wallets?.find(w => w.wallet_type === 'CASEBACKPOINTS');
        const cash = cashW ? Number(cashW.balance).toFixed(2) : '0.00';
        return {
            cashBalance: cash,
            pointsBalance: pointsW ? Number(pointsW.balance).toLocaleString('en-IN') : '0',
            isBalanceZero: Number(cash) === 0
        };
    }, [user?.wallets]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                set({ isDropdownOpen: false });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchConversion = async () => {
            set({ isConverting: true });
            try {
                const res = await convertCurrency(state.selectedCurrency.id, cashBalance);
                if (res && res.success === false) {
                    throw new Error(res.error || 'Unsupported country');
                }
                if (res && res.converted_amount !== undefined) {
                    set({ convertedAmount: res.converted_amount });
                }
            } catch (error) {
                console.error('Error converting currency:', error);
                if (state.selectedCurrency.id !== 'IN') {
                    const defaultCurrency = countryList.find(c => c.id === 'IN') || countryList[0];
                    set({ selectedCurrency: defaultCurrency });
                } else {
                    set({ convertedAmount: 0 });
                }
            } finally {
                set({ isConverting: false });
            }
        };

        fetchConversion();
    }, [cashBalance, state.selectedCurrency]);

    return (
        <div className={styles.overviewInformation}>
            <div className={styles.grid}>
                <div className={styles.items}>
                    <div className={styles.totalBalance}>
                        <div className={styles.header}>
                            <span className={styles.title}>Total Balance</span>
                            <div className={`${styles.currencySelector} ${isBalanceZero ? styles.disabled : ''}`} ref={dropdownRef} onClick={() => { if (!isBalanceZero) { set({ isDropdownOpen: !state.isDropdownOpen, searchQuery: '' }); } }}>
                                <div className={styles.flag}>
                                    <img src={getFlagUrl(state.selectedCurrency.id)} alt={state.selectedCurrency.name} />
                                </div>
                                <span>{state.selectedCurrency.id}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>

                                {state.isDropdownOpen && (
                                    <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                                        <div className={styles.searchContainer}>
                                            <input
                                                type="text"
                                                placeholder="Search country..."
                                                value={state.searchQuery}
                                                onChange={(e) => set({ searchQuery: e.target.value })}
                                                autoFocus
                                            />
                                        </div>
                                        <div className={styles.countryList}>
                                            {countryList
                                                .filter(curr => curr.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || curr.id.toLowerCase().includes(state.searchQuery.toLowerCase()))
                                                .map((curr) => (
                                                    <div
                                                        key={curr.id}
                                                        className={styles.dropdownItem}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            set({ selectedCurrency: curr, isDropdownOpen: false });
                                                        }}
                                                    >
                                                        <span className={styles.itemText}>{curr.name}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.balanceInfo}>
                            <div className={styles.amount}>
                                <span className={styles.symbol}>$</span>
                                <span className={styles.value}>{cashBalance}</span>
                            </div>
                            <div className={styles.trend}>
                                <span className={styles.text}>
                                    {state.isConverting ? 'Converting...' : (`${state.selectedCurrency.id} ${Number(state.convertedAmount).toLocaleString()}`)}
                                </span>
                            </div>
                        </div>

                        <div className={styles.buttonAlignment}>
                            <Button text="Deposit" iconwithText icon={PlusIcon} onClick={() => set({ modalType: 'deposit', isModalOpen: true })} />
                            <Button text="Withdrawal" lightbutton iconwithText icon={DownloadIcon} onClick={() => set({ modalType: 'withdraw', isModalOpen: true })} disabled={isBalanceZero} />
                        </div>
                    </div>
                </div>
                <div className={styles.items}>
                    <div className={styles.cardBox}>
                        <div className={styles.cardDesign}>
                            <div className={styles.iconText}>
                                <img src={PointsWalletIcon} alt='Points Wallet' />
                                <h3>Points Wallet</h3>
                            </div>
                            <h4>
                                {pointsBalance} pts
                            </h4>
                            <p>
                                Used to unlock tasks
                            </p>
                        </div>
                        <div className={styles.cardDesign}>
                            <div className={styles.iconText}>
                                <img src={RealWalletIcon} alt='Real Wallet' />
                                <h3>Real Wallet</h3>
                            </div>
                            <h4>
                                ${cashBalance}
                            </h4>
                            <p>
                                Available for withdrawal
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <WithdrawMoney
                isOpen={state.isModalOpen}
                onClose={(wasSuccess) => {
                    set({ isModalOpen: false });
                    if (wasSuccess && onTransactionSuccess) {
                        onTransactionSuccess();
                    }
                }}
                type={state.modalType}
            />
        </div>
    )
}
