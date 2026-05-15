'use client';
import React, { useState, useEffect } from 'react';
import styles from './planPricing.module.scss';
import CheckIcon from '@/icons/checkIcon';
import { getPrimePlans } from '@/services/plan';
import WithdrawMoney from '../wallet/withdrawMoney';

export default function PlanPricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
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
    };
    fetchPlans();
  }, []);

  const freePlan = {
    name: 'Free',
    price: 0,
    plan_type: 'YEARLY',
    benefits: [
      'Basic Daily Tasks',
      'Standard Support',
      'No Hidden Fees'
    ]
  };

  const paidPlan = plans[0] || null;

  const currentFreeFeatures = freePlan.benefits;
  const currentPaidFeatures = paidPlan?.benefits || [];

  if (loading) {
    return <div className={styles.planPricing}>Loading plans...</div>;
  }

  return (
    <div className={styles.planPricing}>

      {/* Basic Plan Card */}
      <div className={styles.planbox}>
        <div className={styles.boxheader}>
          <h2>{freePlan?.name ? freePlan.name.charAt(0).toUpperCase() + freePlan.name.slice(1) + ' Plan' : 'Free Plan'}</h2>
          <button className={styles.currentBtn}>Current Plan</button>
        </div>
        <div className={styles.boxbody}>
          <div className={styles.titleRow}>
            <span className={styles.cost}>{freePlan?.price === 0 ? 'Free' : `$${freePlan?.price || 0}`}</span>
            <span className={styles.period}>/ {freePlan?.plan_type?.toLowerCase() === 'monthly' ? 'month' : 'year'}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.features}>
            <div className={styles.column}>
              {currentFreeFeatures.length > 0 ? (
                currentFreeFeatures.slice(0, Math.ceil(currentFreeFeatures.length / 2)).map((f, i) => (
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
              {currentFreeFeatures.length > 1 &&
                currentFreeFeatures.slice(Math.ceil(currentFreeFeatures.length / 2)).map((f, i) => (
                  <div key={i} className={styles.featureItem}>
                    <CheckIcon />
                    <span>{f?.title || f}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prime Plan Card */}
      <div className={styles.planbox}>
        <div className={styles.boxheader}>
          <h2>
            {paidPlan?.name
              ? paidPlan.name
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
              : 'Prime'}
          </h2>
          <button
            className={styles.upgradeBtn}
            onClick={() => {
              if (paidPlan) {
                setSelectedPlanDetails({ id: paidPlan.id, price: paidPlan.price });
                setIsModalOpen(true);
              }
            }}
          >
            Upgrade
          </button>
        </div>
        <div className={styles.boxbody}>
          <div className={styles.titleRow}>
            <span className={styles.cost}>${paidPlan?.price || 0}</span>
            <div className={styles.billingWrapper}>
              <span className={styles.period}>/ year</span>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.features}>
            <div className={styles.column}>
              {currentPaidFeatures.length > 0 ? (
                currentPaidFeatures.slice(0, Math.ceil(currentPaidFeatures.length / 2)).map((f, i) => (
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
              {currentPaidFeatures.length > 1 &&
                currentPaidFeatures.slice(Math.ceil(currentPaidFeatures.length / 2)).map((f, i) => (
                  <div key={i} className={styles.featureItem}>
                    <CheckIcon />
                    <span>{f?.title || f}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <WithdrawMoney
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="plan"
        planDetails={selectedPlanDetails}
      />
    </div>
  );
}
