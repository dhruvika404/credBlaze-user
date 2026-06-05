'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './totalBalance.module.scss';
import { useAuth } from '@/context/AuthContext';
import { convertCurrency } from '@/services/wallet';
import { Country } from 'country-state-city';
import WithdrawMoney from '@/rendering/wallet/withdrawMoney';
import FileIcon from '@/icons/fileIcon';

const PlusIcon = '/assets/icons/plus.svg';
const DownloadIcon = '/assets/images/download.svg';

const countryList = Country.getAllCountries().map(c => ({
    id: c.isoCode,
    name: c.name,
    currencyCode: c.currency || c.isoCode
}));

function getFlagUrl(countryCode) {
    if (!countryCode || countryCode.length !== 2) return null;
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}


export default function TotalBalance({ overviewData, refreshOverview }) {
    const { user, fetchAndSetProfile } = useAuth();
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

    const cashBalance = useMemo(() => {
        if (overviewData?.balance?.cash !== undefined) {
            return Number(overviewData.balance.cash).toFixed(2);
        }
        const cashW = user?.wallets?.find(w => w.wallet_type === 'REAL');
        return cashW ? Number(cashW.balance).toFixed(2) : '0.00';
    }, [user?.wallets, overviewData?.balance?.cash]);

    // Handle outside click for country select dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                set({ isDropdownOpen: false });
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Live Currency conversion
    useEffect(() => {
        const fetchConversion = async () => {
            set({ isConverting: true });
            try {
                const res = await convertCurrency(state.selectedCurrency.id, cashBalance);
                if (res && res.success !== false && res.converted_amount !== undefined) {
                    set({ convertedAmount: res.converted_amount });
                }
            } catch (error) {
                console.error('Error converting currency:', error);
                if (state.selectedCurrency.id !== 'IN') {
                    const defaultCurrency = countryList.find(c => c.id === 'IN') || countryList[0];
                    set({ selectedCurrency: defaultCurrency });
                }
            } finally {
                set({ isConverting: false });
            }
        };
        fetchConversion();
    }, [cashBalance, state.selectedCurrency]);


    const displayTransactions = useMemo(() => {
        if (overviewData?.recent_transactions && overviewData.recent_transactions.length > 0) {
            return overviewData.recent_transactions.slice(0, 2).map(tx => ({
                title: tx.title,
                time: tx.date,
                amount: tx.is_credit ? Number(tx.amount) : -Number(tx.amount),
                type: tx.is_credit ? 'deposit' : 'withdraw',
                tag: tx.is_credit ? 'Earning' : 'Payment',
                color: tx.is_credit ? '#3DB042' : '#EC221F'
            }));
        }
        return [];
    }, [overviewData?.recent_transactions]);

    const formattedConverted = useMemo(() => {
        if (state.isConverting) return 'Converting...';
        const symbol = state.selectedCurrency.id === 'IN' ? '₹' : state.selectedCurrency.id;
        return `${symbol} ${Number(state.convertedAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }, [state.isConverting, state.convertedAmount, state.selectedCurrency]);

    return (
        <div className={styles.parentContainer}>
            {/* Task Statistics (Balance section) */}
            <div className={styles.taskStatistics}>
                <div className={styles.statsFrame}>
                    <div className={styles.balanceHeader}>
                        <div className={styles.statusRow}>
                            <span className={styles.balanceTitle}>Total Balance</span>

                            <div className={styles.dropdownContainer} ref={dropdownRef}>
                                <div
                                    className={`${styles.currencyFilter} ${Number(cashBalance) === 0 ? styles.disabled : ''}`}
                                    onClick={() => {
                                        if (Number(cashBalance) > 0) {
                                            set({ isDropdownOpen: !state.isDropdownOpen, searchQuery: '' });
                                        }
                                    }}
                                >
                                    <div className={styles.flag}>
                                        <img src={getFlagUrl(state.selectedCurrency.id)} alt={state.selectedCurrency.name} />
                                    </div>
                                    <span>{state.selectedCurrency.id}</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>

                                {state.isDropdownOpen && (
                                    <div className={styles.currencyDropdown} onClick={(e) => e.stopPropagation()}>
                                        <div className={styles.searchBox}>
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
                                                        onClick={() => {
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
                                    {state.isConverting ? 'Converting...' : (`${state.selectedCurrency.id} ${Number(state.convertedAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.depositBtn}
                            onClick={() => set({ modalType: 'deposit', isModalOpen: true })}
                        >
                            <img src={PlusIcon} alt="Deposit" style={{ width: 16, height: 16 }} />
                            <span>Deposit</span>
                        </button>
                        <button
                            className={styles.withdrawalBtn}
                            onClick={() => set({ modalType: 'withdraw', isModalOpen: true })}
                            disabled={Number(cashBalance) === 0}
                        >
                            <img src={DownloadIcon} alt="Withdrawal" style={{ width: 16, height: 16 }} />
                            <span>Withdrawal</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Task Activity (Recent Transactions list) */}
            <div className={styles.taskActivity}>
                <div className={styles.activityHeader}>
                    <div className={styles.activityTitle}>
                        <div className={styles.activityIcon}>
                            <FileIcon />
                        </div>
                        <h3>Recent Transaction</h3>
                    </div>
                    <a href="/wallet" className={styles.viewAllBtn}>
                        <span>View All</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.arrowIcon}>
                            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>

                <div className={styles.activityList}>
                    {displayTransactions.length === 0 ? (
                        <div style={{ width: '100%', textAlign: 'center', padding: '20px', fontFamily: 'Manrope, sans-serif', color: '#6B7280', fontSize: '14px', background: '#F9FAFB', borderRadius: '12px', border: '1px dashed #E5E7EB' }}>
                            No recent transactions found
                        </div>
                    ) : (
                        displayTransactions.map((tx, idx) => (
                            <div key={idx} className={styles.activityItem}>
                                <div className={styles.itemLeft}>
                                    <div className={`${styles.itemIconBox} ${tx.type === 'withdraw' ? styles.withdraw : styles.deposit}`}>
                                        {tx.type === 'withdraw' ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 7L7 17M7 17H17M7 17V7" /></svg>
                                        )}
                                    </div>
                                    <div className={styles.itemTextInfo}>
                                        <h4>{tx.title}</h4>
                                        <span>{tx.time}</span>
                                    </div>
                                </div>
                                <div className={styles.itemRight}>
                                    <span className={styles.amount} style={{ color: tx.color }}>
                                        {tx.amount > 0 ? `+ ${tx.amount.toFixed(2)}` : `- ${Math.abs(tx.amount).toFixed(2)}`}
                                    </span>
                                    <span className={styles.earningLabel}>{tx.tag}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <WithdrawMoney
                isOpen={state.isModalOpen}
                onClose={async (wasSuccess) => {
                    set({ isModalOpen: false });
                    if (wasSuccess) {
                        try {
                            if (fetchAndSetProfile) {
                                await fetchAndSetProfile();
                            }
                        } catch (error) {
                            console.error('Error refreshing profile after transaction:', error);
                        }
                        if (refreshOverview) {
                            await refreshOverview();
                        }
                    }
                }}
                type={state.modalType}
            />
        </div>
    );
}
