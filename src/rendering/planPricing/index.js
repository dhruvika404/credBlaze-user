'use client';
import React, { useState, useEffect } from 'react';
import styles from './planPricing.module.scss';
import CheckIcon from '@/icons/checkIcon';
import { getPrimePlans } from '@/services/plan';
import WithdrawMoney from '../wallet/withdrawMoney';
import { useAuth } from '@/context/AuthContext';
import moment from 'moment';

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
        onClose={() => setIsModalOpen(false)}
        type="plan"
        planDetails={selectedPlanDetails}
      />
    </div>
  );
}
