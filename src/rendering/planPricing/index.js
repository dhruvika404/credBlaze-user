'use client';
import React, { useState, useEffect } from 'react';
import styles from './planPricing.module.scss';
import CheckIcon from '@/icons/checkIcon';
import { getPrimePlans } from '@/services/plan';

const billingOptions = [
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];


export default function PlanPricing() {
  const [billing, setBilling] = useState('month');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const freePlan = plans.find((p) => p.price === 0);
  const billingTypeMap = { month: 'MONTHLY', year: 'YEARLY' };
  const paidPlan = plans.find(
    (p) => p.price > 0 && p.plan_type === billingTypeMap[billing]
  );
  const currentFreeFeatures = freePlan?.benefits || [];
  const currentPaidFeatures = paidPlan?.benefits || [];

  if (loading) {
    return <div className={styles.planPricing}>Loading plans...</div>;
  }

  return (
    <div className={styles.planPricing}>

      {/* Basic Plan Card */}
      <div className={styles.planbox}>
        <div className={styles.boxheader}>
          <h2>{freePlan?.name ? freePlan.name.charAt(0).toUpperCase() + freePlan.name.slice(1) + ' Plan' : 'Basic Plan'}</h2>
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
                    <span>{f}</span>
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
                    <span>{f}</span>
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
          <button className={styles.upgradeBtn}>Upgrade</button>
        </div>
        <div className={styles.boxbody}>
          <div className={styles.titleRow}>
            <span className={styles.cost}>${paidPlan?.price || 0}</span>
            <div className={styles.billingWrapper}>
              <span className={styles.period}>/ {billing}</span>
              <div className={styles.dropdownWrap}>
                <button
                  className={styles.dropdownTrigger}
                  onClick={() => setDropdownOpen((p) => !p)}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="url(#grad)" />
                    <path
                      d="M6.5 8.5L10 12L13.5 8.5"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient id="grad" x1="-0.455" y1="10" x2="10.273" y2="10" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#0040C1" />
                        <stop offset="1" stopColor="#6475F6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </button>
                {dropdownOpen && (
                  <ul className={styles.dropdownMenu} role="listbox">
                    {billingOptions.map((opt) => (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={billing === opt.value}
                        className={billing === opt.value ? styles.selected : ''}
                        onClick={() => {
                          setBilling(opt.value);
                          setDropdownOpen(false);
                        }}
                      >
                        {opt.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.features}>
            <div className={styles.column}>
              {currentPaidFeatures.length > 0 ? (
                currentPaidFeatures.slice(0, Math.ceil(currentPaidFeatures.length / 2)).map((f, i) => (
                  <div key={i} className={styles.featureItem}>
                    <CheckIcon />
                    <span>{f}</span>
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
                    <span>{f}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
