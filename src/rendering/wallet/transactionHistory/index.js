"use client"
import React, { useState, useEffect, useCallback } from 'react'
import styles from './transactionHistory.module.scss'
import DataTable from '@/components/dataTable'
import moment from 'moment'
import FilterIcon from '@/icons/filterIcon'
import ListviewIcon from '@/icons/listviewIcon'
import { getWalletTransactions } from '@/services/wallet'
import WalletFilterDrawer from './walletFilterDrawer'

export default function TransactionHistory() {
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({});

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);

            const payload = {
                limit: pageSize,
                offset: (currentPage - 1) * pageSize,
                wallet_type: appliedFilters.walletTypes,
                transaction_type: appliedFilters.transactionTypes,
                earning_type: appliedFilters.earningTypes,
                transaction_status: appliedFilters.statuses,
            };

            if (appliedFilters.dateRange?.from) {
                payload.start_date = new Date(appliedFilters.dateRange.from).toISOString();
            }
            if (appliedFilters.dateRange?.to) {
                payload.end_date = new Date(appliedFilters.dateRange.to).toISOString();
            }

            const response = await getWalletTransactions(payload);
            if (response.success) {
                setTransactions(response.data.transactions || []);
                setTotalCount(response.data.total_count || 0);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, appliedFilters]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const columns = [
        {
            key: 'transaction_id',
            label: 'Txn ID',
            render: (val) => (
                <div className={styles.txnIdCell} title={val}>
                    {val}
                </div>
            )
        },
        {
            key: 'created_at',
            label: 'Date & time',
            render: (val) => moment(val).format('YYYY-MM-DD hh:mm A')
        },
        {
            key: 'transaction_earned_type',
            label: 'Type',
            render: (val, row) => {
                const isWithdraw = row.transaction_type === 'WITHDRAW';
                const label = val?.replace(/_/g, ' ') || row.transaction_type;
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
                const isCB = val === 'CASEBACKPOINTS';
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
                const isWithdraw = row.transaction_type === 'WITHDRAW';
                const isCB = row.wallet_type === 'CASEBACKPOINTS';
                const prefix = isWithdraw ? '-' : '+';
                const colorClass = isWithdraw ? styles.amountRed : styles.amountGreen;

                return (
                    <span className={colorClass}>
                        {prefix}{!isCB ? '$' : ''}{Number(val).toLocaleString()}
                        <span className={styles.suffix}>{isCB ? ' pts' : ''}</span>
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
    ];

    return (
        <div className={styles.transactionHistory}>
            <div className={styles.tableHeader}>
                <div className={styles.titleInfo}>
                    <div className={styles.icon}>
                        <ListviewIcon />
                    </div>
                    <span>Transaction History</span>
                </div>
                <div className={styles.rightControls}>
                    <button className={styles.filterBtn} onClick={() => setIsFilterOpen(true)}>
                        <FilterIcon />
                        Filter
                    </button>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <DataTable
                    columns={columns}
                    data={transactions}
                    loading={loading}
                    totalItems={totalCount}
                    totalPages={Math.ceil(totalCount / pageSize)}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                    onPageChange={(p) => setCurrentPage(p)}
                    onPageSizeChange={(s) => {
                        setPageSize(s);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <WalletFilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                initialFilters={appliedFilters}
                onApply={(filters) => {
                    setAppliedFilters(filters);
                    setCurrentPage(1);
                }}
            />
        </div>
    )
}
