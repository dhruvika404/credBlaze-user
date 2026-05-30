import React, { useState, useEffect, useRef } from 'react'
import styles from './rewardSection.module.scss';
import QuestionIcon from '@/icons/questionIcon';
import Button from '@/components/button';
import Spinner from '../spinner';
import { getSpinRewards, getSpinStatus, getSpinHistory, playSpin, claimReward } from '@/services/spin';
import { toast } from 'react-hot-toast';
import SpinResultModal from '@/components/modal/spinResultModal';
import ListviewIcon from '@/icons/listviewIcon';
import moment from 'moment';
import DataTable from '@/components/dataTable';
import SpinHistoryFilterMenu from './spinHistoryFilterMenu';
import { useAuth } from '@/context/AuthContext';

const RupeeIcon = '/assets/icons/Rupee.svg';
const HowItWorksIcon = '/assets/icons/how-it-works.svg';

export default function RewardSection() {
    const spinnerRef = useRef(null);
    const { fetchAndSetProfile } = useAuth();
    const [state, setState] = useState({
        rewards: [],
        status: null,
        history: null,
        loading: true,
        isSpinning: false,
        modalOpen: false,
        spinResult: null,
        currentPage: 1,
        pageSize: 5,
        totalCount: 0,
        appliedFilters: {},
    });

    const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }));

    const {
        rewards,
        status,
        history,
        loading,
        isSpinning,
        modalOpen,
        spinResult,
        currentPage,
        pageSize,
        totalCount,
        appliedFilters,
    } = state;

    const fetchData = async () => {
        try {
            const historyParams = {
                limit: pageSize,
                offset: (currentPage - 1) * pageSize,
                reward_type: appliedFilters.rewardTypes,
            };

            if (appliedFilters.dateRange?.from) {
                historyParams.start_date = new Date(appliedFilters.dateRange.from).toISOString();
            }
            if (appliedFilters.dateRange?.to) {
                historyParams.end_date = new Date(appliedFilters.dateRange.to).toISOString();
            }

            const [rewardsRes, statusRes, historyRes] = await Promise.all([
                getSpinRewards(),
                getSpinStatus(),
                getSpinHistory(historyParams)
            ]);

            const updates = { loading: false };
            if (rewardsRes) updates.rewards = Array.isArray(rewardsRes) ? rewardsRes : (rewardsRes.data || []);
            if (statusRes) updates.status = statusRes;
            if (historyRes) {
                updates.history = historyRes;
                updates.totalCount = historyRes.total_count || 0;
            }
            updateState(updates);
        } catch (error) {
            console.error('Error fetching spin data:', error);
            updateState({ loading: false });
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, appliedFilters]);

    const handleSpinClick = async () => {
        if (isSpinning) return;
        if (status?.remaining_spins <= 0) {
            toast.error('No spins remaining today!');
            return;
        }

        try {
            updateState({ isSpinning: true });
            if (spinnerRef.current) {
                spinnerRef.current.startSpin();
            }

            const res = await playSpin();
            if (res) {
                const winReward = res.data || res;
                const pending_spin_id = winReward.pending_spin_id;
                const actualReward = winReward.reward || winReward;
                const reward_id = actualReward?.id || actualReward?.reward_id;


                let targetIndex = rewards.findIndex(r => r.id === reward_id);

                if (targetIndex === -1) {
                    targetIndex = 0;
                }

                if (spinnerRef.current) {
                    spinnerRef.current.stopSpin(targetIndex, async () => {
                        try {
                            const claimRes = await claimReward({
                                pending_spin_id,
                                reward_id
                            });

                            if (claimRes) {
                                updateState({ spinResult: actualReward, modalOpen: true, isSpinning: false });
                                fetchData();
                            } else {
                                updateState({ isSpinning: false });
                            }
                        } catch (claimErr) {
                            toast.error(claimErr?.message || 'Error claiming reward');
                            updateState({ isSpinning: false });
                        }
                    }, false);
                }
            } else {
                toast.error(res?.message || 'Failed to play spin');
                if (spinnerRef.current) {
                    spinnerRef.current.stopSpin(0, () => {
                        updateState({ isSpinning: false });
                    }, true);
                }
            }
        } catch (error) {
            toast.error(error?.message || 'An error occurred while spinning.');
            if (spinnerRef.current) {
                spinnerRef.current.stopSpin(0, () => {
                    updateState({ isSpinning: false });
                }, true);
            }
        }
    };

    const stats = [
        { title: 'Total Won Rupee', value: `$${Number(history?.total_cash_earned || 0).toFixed(3)}` },
        { title: 'Total CB Earned', value: `${history?.total_cb_earned || 0} CB` },
        { title: 'Total Spins', value: status?.daily_limit || 0 },
        { title: "Today's Spins", value: status?.spins_performed_today || 0 },
    ];

    const historyList = history?.history || [];

    return (
        <div className={styles.rewardSection}>
            <div className={styles.grid}>
                <div className={styles.items}>
                    <div className={styles.boxheader}>
                        <h3>Daily Reward Wheel</h3>
                    </div>
                    <div className={styles.centerAlignment}>
                        {loading ? (
                            <div className={styles.loadingPlaceholder}>Loading Wheel...</div>
                        ) : (
                            <Spinner ref={spinnerRef} segments={rewards} />
                        )}
                    </div>
                    <div className={styles.icontextAlignment}>
                        <QuestionIcon />
                        <span>{status?.remaining_spins || 0} spins remaining today</span>
                    </div>
                    <div className={styles.buttonCenter}>
                        <Button
                            text={isSpinning ? "Spinning..." : "Spin Now"}
                            onClick={handleSpinClick}
                            disabled={isSpinning || loading || (status && status.remaining_spins <= 0)}
                        />
                    </div>
                </div>
                <div className={styles.items}>
                    <div className={styles.boxgrid}>
                        {stats.map((stat, index) => (
                            <div key={index} className={styles.boxItems}>
                                <div className={styles.boxheader}>
                                    <img src={RupeeIcon} alt='RupeeIcon' />
                                    <h3>{stat.title}</h3>
                                </div>
                                <h4>{stat.value}</h4>
                            </div>
                        ))}
                    </div>
                    <div className={styles.howitWorks}>
                        <div className={styles.howitWorksIcon}>
                            <img src={HowItWorksIcon} alt="HowItWorksIcon" />
                            <span>How It Works</span>
                        </div>
                        <ul>
                            <li>You get a limited number of spins daily based on your activity.</li>
                            <li>You get {status?.daily_limit || 10} spins per day.</li>
                            <li>Click on the “Spin Now” button to rotate the reward wheel.</li>
                            <li>Each spin gives you a chance to win coins or rewards instantly.</li>
                            <li>Rewards are automatically credited to your wallet after the spin.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <SpinResultModal
                isOpen={modalOpen}
                onClose={() => {
                    updateState({ modalOpen: false });
                    fetchAndSetProfile();
                }}
                result={spinResult}
                remainingSpins={status?.remaining_spins || 0}
            />

            {/* Spin History Table */}
            <div className={styles.historySection}>
                <div className={styles.historyHeader}>
                    <div className={styles.historyTitleInfo}>
                        <div className={styles.historyIcon}>
                            <ListviewIcon />
                        </div>
                        <span>Transaction History</span>
                    </div>
                    <div className={styles.rightControls}>
                        <SpinHistoryFilterMenu
                            initialFilters={appliedFilters}
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
                                label: 'Date & Time',
                                render: (val) => moment.utc(val).local().format('YYYY-MM-DD hh:mm A')
                            },
                            {
                                key: 'reward_type',
                                label: 'Type',
                                render: (val) => <span className={styles.plainType}>{val?.toLowerCase()}</span>
                            },
                            {
                                key: 'reward_value',
                                label: 'Amount',
                                render: (val, row) => (
                                    <span className={styles.amountGreen}>
                                        {row?.reward_type === 'POINT' ? `${Number(val)} pts` : `$${Number(val).toFixed(2)}`}
                                    </span>
                                )
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
        </div>
    )
}
