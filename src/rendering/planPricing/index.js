'use client';
import React, { useState, useEffect } from 'react';
import styles from './planPricing.module.scss';
import CheckIcon from '@/icons/checkIcon';
import CopyIcon from '@/icons/copyIcon';
import { getPrimePlans } from '@/services/plan';
import WithdrawMoney from '../wallet/withdrawMoney';
import { useAuth } from '@/context/AuthContext';
import moment from 'moment';
import toast from 'react-hot-toast';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return moment(dateString).format('DD MMM YYYY');
};

export default function PlanPricing() {
  const { user, fetchAndSetProfile } = useAuth();
  const isPrime = user?.is_prime;
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const pendingDetails = user?.pending_prime_details;
  const totalAmount = pendingDetails?.total_amount || 0;
  const paidAmount = pendingDetails?.paid_amount || 0;
  const remainingAmount = pendingDetails?.remaining_amount || 0;
  const progressPercent = totalAmount > 0 ? Math.min(100, Math.max(0, Math.round((paidAmount / totalAmount) * 100))) : 0;
  const installmentHistory = pendingDetails?.installment_history || [];

  const handlePayRemaining = () => {
    const matchedPlan = plans.find(
      (p) => p.name?.toLowerCase() === pendingDetails?.plan_name?.toLowerCase()
    );
    const planId = matchedPlan?.id || 'pro';
    setSelectedPlanDetails({
      id: planId,
      price: remainingAmount,
      isRemainingPayment: true,
    });
    setIsModalOpen(true);
  };

  const handleCopyTx = (txId) => {
    if (!txId) return;
    navigator.clipboard.writeText(txId);
    toast.success('Transaction ID copied to clipboard');
  };

  useEffect(() => {
    const fetchPlansAndProfile = async () => {
      try {
        const res = await getPrimePlans();
        if (res.success) {
          setPlans(res.data);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }

      try {
        if (fetchAndSetProfile) {
          await fetchAndSetProfile();
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchPlansAndProfile();
  }, [fetchAndSetProfile]);

  const basePlans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      plan_type: 'YEARLY',
      benefits: [
        'Basic Daily Tasks',
        'Standard Support',
        'No Hidden Fees'
      ]
    }
  ];

  let allPlans = [];
  if (isPrime && user?.prime_details?.plan) {
    const activePlan = {
      id: user.prime_details.plan_id || user.prime_details.plan.id,
      name: user.prime_details.plan.name,
      price: user.prime_details.plan.price,
      plan_type: user.prime_details.plan.plan_type,
      duration_days: user.prime_details.plan.duration_days,
      benefits: user.prime_details.plan.benefits || [],
      is_active: user.prime_details.is_active
    };
    allPlans = [...basePlans, activePlan];
  } else {
    allPlans = [...basePlans, ...plans];
  }

  if (loading) {
    return <div className={styles.planPricing}>Loading plans...</div>;
  }

  return (
    <div className={styles.planPricing}>
      {pendingDetails && (
        <div className={styles.pendingCard}>
          <div className={styles.pendingHeader}>
            <div className={styles.headerTitleSec}>
              <div className={styles.badge}>Pending Activation</div>
              <h2>{pendingDetails.plan_name || 'Pro Membership'}</h2>
              <p>Complete your payment to activate all premium benefits</p>
            </div>
            <button className={styles.payRemainingBtn} onClick={handlePayRemaining}>
              Pay Remaining Balance (${Number(remainingAmount).toFixed(2)})
            </button>
          </div>
          
          <div className={styles.pendingBody}>
            <div className={styles.progressSection}>
              <div className={styles.progressLabelRow}>
                <span>Payment Progress</span>
                <span className={styles.progressPercent}>{progressPercent}% Paid</span>
              </div>
              <div className={styles.progressBarOuter}>
                <div 
                  className={styles.progressBarInner} 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Total Plan Cost</span>
                <span className={styles.statValue}>${Number(totalAmount).toFixed(2)}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Amount Paid</span>
                <span className={styles.statValue}>${Number(paidAmount).toFixed(2)}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Remaining Balance</span>
                <span className={styles.statValue} style={{ color: '#E11D48' }}>
                  ${Number(remainingAmount).toFixed(2)}
                </span>
              </div>
            </div>

            {installmentHistory.length > 0 && (
              <div className={styles.historySection}>
                <button 
                  className={styles.historyToggle}
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                >
                  <span>Payment Installments ({installmentHistory.length})</span>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ 
                      transform: isHistoryExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                
                {isHistoryExpanded && (
                  <div className={styles.historyList}>
                    <div className={styles.historyHeaderRow}>
                      <span>Date</span>
                      <span>Amount Paid</span>
                      <span>Transaction ID</span>
                    </div>
                    {installmentHistory.map((inst, idx) => (
                      <div key={inst.id || idx} className={styles.historyItem}>
                        <span className={styles.instDate}>
                          {moment(inst.created_at).format('DD MMM YYYY, hh:mm A')}
                        </span>
                        <span className={styles.instAmount}>
                          ${Number(inst.amount_paid).toFixed(2)}
                        </span>
                        <div className={styles.txIdWrapper}>
                          <span className={styles.instTxId} title={inst.tx_id}>
                            {inst.tx_id ? `${inst.tx_id.slice(0, 8)}...${inst.tx_id.slice(-8)}` : 'N/A'}
                          </span>
                          {inst.tx_id && (
                            <button 
                              className={styles.copyBtn} 
                              onClick={() => handleCopyTx(inst.tx_id)}
                              title="Copy transaction ID"
                            >
                              <CopyIcon />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {allPlans.map((plan, index) => {
        const isFreePlan = plan.id === 'free';
        const isCurrentPlan = isFreePlan
          ? !isPrime
          : (isPrime && (plan.id === user?.prime_details?.plan_id || plan.id === user?.prime_details?.plan?.id));
        const currentFeatures = plan.benefits || [];

        return (
          <div key={plan.id || index} className={styles.planbox}>
            <div className={styles.boxheader}>
              <h2>
                {isFreePlan
                  ? plan.name ? plan.name.charAt(0).toUpperCase() + plan.name.slice(1) + ' Plan' : 'Free Plan'
                  : plan.name
                    ? plan.name
                      .split('-')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                    : 'Pro'}
              </h2>
              {isCurrentPlan ? (
                <button className={styles.currentBtn}>Current Plan</button>
              ) : (
                !isFreePlan && (
                  <button
                    className={styles.upgradeBtn}
                    onClick={() => {
                      setSelectedPlanDetails({ id: plan.id, price: plan.price });
                      setIsModalOpen(true);
                    }}
                  >
                    Upgrade
                  </button>
                )
              )}
            </div>
            <div className={styles.boxbody}>
              <div className={styles.titleRow}>
                <span className={styles.cost}>{isFreePlan && plan.price === 0 ? 'Free' : `$${plan.price || 0}`}</span>
                <div className={styles.billingWrapper}>
                  <span className={styles.period}>
                    / {plan.plan_type?.toLowerCase() === 'monthly' ? 'month' : 'year'}{!isFreePlan && plan.duration_days ? ` (${plan.duration_days} days)` : ''}
                  </span>
                </div>
              </div>
              {isCurrentPlan && !isFreePlan && user?.prime_details && (
                <div className={styles.simpleDates}>
                  <span>Start Date: {formatDate(user.prime_details.start_date)}</span>
                  <span>End Date: {formatDate(user.prime_details.end_date)}</span>
                </div>
              )}
              <div className={styles.divider} />
              <div className={styles.features}>
                <div className={styles.column}>
                  {currentFeatures.length > 0 ? (
                    currentFeatures.slice(0, Math.ceil(currentFeatures.length / 2)).map((f, i) => (
                      <div key={i} className={styles.featureItem}>
                        <CheckIcon />
                        <span>{f?.title || f}</span>
                      </div>
                    ))
                  ) : (
                    <div className={styles.featureItem}>
                      <span>No features listed</span>
                    </div>
                  )}
                </div>
                <div className={styles.column}>
                  {currentFeatures.length > 1 &&
                    currentFeatures.slice(Math.ceil(currentFeatures.length / 2)).map((f, i) => (
                      <div key={i} className={styles.featureItem}>
                        <CheckIcon />
                        <span>{f?.title || f}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <WithdrawMoney
        isOpen={isModalOpen}
        onClose={async (wasSuccess) => {
          setIsModalOpen(false);
          if (wasSuccess) {
            try {
              if (fetchAndSetProfile) {
                await fetchAndSetProfile();
              }
            } catch (error) {
              console.error('Error fetching profile after plan upgrade:', error);
            }
          }
        }}
        type="plan"
        planDetails={selectedPlanDetails}
      />
    </div>
  );
}
