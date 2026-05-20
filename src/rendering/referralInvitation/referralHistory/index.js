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
                            render: (val, row) => val || row?.referred_user_name || '-'
                        },
                        {
                            key: 'email',
                            label: 'Email',
                            render: (val, row) => val || row?.referred_user_email || '-'
                        },
                        {
                            key: 'amount',
                            label: 'Amount',
                            render: (val, row) => {
                                const amt = val || row?.reward_amount || row?.reward_value || 0;
                                return <span className={styles.amountGreen}>${Number(amt).toFixed(2)}</span>;
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
