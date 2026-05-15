"use client"
import React from 'react'
import styles from './referralInvitation.module.scss'
import ReferralInvitationCard from './referralInvitationCard'
import BenefitsSection from './benefitsSection'
import ReferralHistory from './referralHistory'

export default function ReferralInvitation() {

    return (
        <div className={styles.referralInvitation}>
            <div className={styles.title}>
                <h2>Referral Invitation</h2>
                <p>Invite friends and earn together</p>
            </div>
            <ReferralInvitationCard />
            <BenefitsSection />
            <ReferralHistory />
        </div>
    )
}
