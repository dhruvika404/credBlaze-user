import React, { useState, useEffect } from 'react';
import styles from './referralHistory.module.scss';
import DataTable from '@/components/dataTable';
import moment from 'moment';
import SpinHistoryFilterMenu from '@/rendering/spinEarn/rewardSection/spinHistoryFilterMenu';
import { getReferralHistory } from '@/services/referral';
import ListviewIcon from '@/icons/listviewIcon';

export default function ReferralHistory() {
    const [state, setState] = useState({
        historyList: [],
        loading: true,
        currentPage: 1,
        pageSize: 5,
        totalCount: 0,
        appliedFilters: {},
    });

    const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }));

    const {
        historyList,
        loading,
        currentPage,
        pageSize,
        totalCount,
        appliedFilters,
    } = state;

    const fetchData = async () => {
        try {
            updateState({ loading: true });

            const historyParams = {
                limit: pageSize,
                offset: (currentPage - 1) * pageSize,
            };

            if (appliedFilters.dateRange?.from) {
                historyParams.start_date = new Date(appliedFilters.dateRange.from).toISOString();
            }
            if (appliedFilters.dateRange?.to) {
                historyParams.end_date = new Date(appliedFilters.dateRange.to).toISOString();
            }

            const res = await getReferralHistory(historyParams);

            if (res && res.data) {
                updateState({
                    historyList: res.data.transactions || [],
                    totalCount: res.data.total_transactions || 0,
                    loading: false,
                });
            } else {
                updateState({ loading: false });
            }
        } catch (error) {
            console.error('Error fetching referral history:', error);
            updateState({ loading: false });
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, appliedFilters]);

    return (
        <div className={styles.historySection}>
            <div className={styles.historyHeader}>
                <div className={styles.historyTitleInfo}>
                    <div className={styles.historyIcon}>
                        <ListviewIcon />
                    </div>
                    <span>Referral Details</span>
                </div>
                <div className={styles.rightControls}>
                    <SpinHistoryFilterMenu
                        initialFilters={appliedFilters}
                        hideRewardType={true}
                        onApply={(filters) => {
                            updateState({ appliedFilters: filters, currentPage: 1 });
                        }}
                    />
                </div>
            </div>
            <div className={styles.tableWrapper}>
                <DataTable
                    columns={[
                        {
                            key: 'created_at',
                            label: 'Date & time',
                            render: (val) => val ? moment.utc(val).local().format('YYYY-MM-DD hh:mm A') : '-'
                        },
                        {
                            key: 'name',
                            label: 'Name',
                            render: (val, row) => val || row?.referred_user_name || row?.username || '-'
                        },
                        {
                            key: 'transaction_earned_type',
                            label: 'Type',
                            render: (val, row) => {
                                const isWithdraw = row.transaction_type?.toUpperCase() === 'WITHDRAW';
                                const label = val?.replace(/_/g, ' ') || row.transaction_type || '-';
                                return (
                                    <div className={styles.typeCell}>
                                        <div className={`${styles.typeIcon} ${isWithdraw ? styles.withdraw : styles.deposit}`}>
                                            {isWithdraw ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 7L7 17M7 17H17M7 17V7" /></svg>
                                            )}
                                        </div>
                                        <span className={styles.typeName}>{label}</span>
                                    </div>
                                )
                            }
                        },
                        {
                            key: 'wallet_type',
                            label: 'Category',
                            render: (val) => {
                                const isCB = val?.toUpperCase() === 'CASEBACKPOINTS';
                                return (
                                    <div className={`${styles.categoryBadge} ${isCB ? styles.cbPoints : styles.money}`}>
                                        {isCB ? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3" />
                                                <line x1="8" y1="12" x2="16" y2="12" />
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                                                <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                                                <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                                            </svg>
                                        )}
                                        <span>{isCB ? 'CB Points' : 'Money ($)'}</span>
                                    </div>
                                )
                            }
                        },
                        {
                            key: 'amount',
                            label: 'Amount',
                            render: (val, row) => {
                                const amt = val || row?.reward_amount || row?.reward_value || 0;
                                const isWithdraw = row.transaction_type?.toUpperCase() === 'WITHDRAW';
                                const isCB = row.wallet_type?.toUpperCase() === 'CASEBACKPOINTS';
                                const prefix = isWithdraw ? '-' : '+';
                                const colorClass = isWithdraw ? styles.amountRed : styles.amountGreen;

                                return (
                                    <span className={colorClass}>
                                        {prefix}{!isCB ? '$' : ''}
                                        {isCB
                                            ? Number(amt).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
                                            : Number(amt).toFixed(2)
                                        }
                                        {isCB && <span className={styles.suffix}> pts</span>}
                                    </span>
                                )
                            }
                        },
                        {
                            key: 'transaction_status',
                            label: 'Status',
                            render: (val) => {
                                const status = val?.toLowerCase();
                                const displayStatus = val?.replace(/_/g, ' ')?.toLowerCase();
                                return (
                                    <div className={styles.statusActive}>
                                        <div className={`${styles.dot} ${status === 'success' || status === 'completed' || status === 'approved' ? styles.greenDot :
                                            status?.includes('pending') || status?.includes('review') ? styles.yellowDot :
                                                styles.redDot
                                            }`}></div>
                                        <span style={{ textTransform: 'capitalize' }}>{displayStatus}</span>
                                    </div>
                                )
                            }
                        }
                    ]}
                    data={historyList}
                    loading={loading}
                    totalItems={totalCount}
                    totalPages={Math.ceil(totalCount / pageSize)}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    pageSizeOptions={[5, 10, 25, 50]}
                    onPageChange={(p) => updateState({ currentPage: p })}
                    onPageSizeChange={(s) => {
                        updateState({ pageSize: s, currentPage: 1 });
                    }}
                />
            </div>
        </div>
    );
}
