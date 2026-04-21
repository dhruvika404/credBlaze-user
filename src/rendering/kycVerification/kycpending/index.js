import React from 'react'
import styles from './kycpending.module.scss';
const BadgeIcon = '/assets/icons/badge.svg';

export default function Kycpending({ status }) {
    const getStatusContent = () => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return {
                    title: 'KYC Submitted',
                    description: 'Your KYC documents have been submitted and are currently under review. This usually takes 24-48 hours.'
                };
            case 'approved':
                return {
                    title: 'KYC Verified',
                    description: 'Your KYC has been successfully verified. You now have full access to all features.'
                };
            case 'pending':
                return {
                    title: 'KYC Pending',
                    description: 'Your KYC information needs to be updated to ensure continued access to all features. Please provide the latest documents for verification'
                };
            case 'rejected':
                return {
                    title: 'KYC Rejected',
                    description: 'Your KYC documents were rejected. Please check the requirements and resubmit the correct documents.'
                };
            default:
                return {
                    title: 'KYC Pending',
                    description: 'Your KYC information needs to be updated to ensure continued access to all features. Please provide the latest documents for verification.'
                };
        }
    };

    const content = getStatusContent();

    return (
        <div className={styles.kycpending}>
            <img src={BadgeIcon} alt='BadgeIcon' />
            <div>
                <h2>
                    {content.title}
                </h2>
                <p>
                    {content.description}
                </p>
            </div>
        </div>
    )
}
