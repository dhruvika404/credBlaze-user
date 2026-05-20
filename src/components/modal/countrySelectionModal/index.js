'use client';
import React from 'react';
import styles from './countrySelectionModal.module.scss';
import Button from '@/components/button';
import LocationTargetIcon from '@/icons/locationTargetIcon';
import CloseIcon from '@/icons/closeIcon';
import FileIcon from '@/icons/fileIcon';
import NotificationIcon from '@/icons/notificationIcon';
import ProIcon from '@/icons/proIcon';

export default function CountrySelectionModal({
  isOpen,
  onClose,
  onSelectCountry,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Close Button at top-right */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        {/* Location Pin Icon */}
        <div className={styles.illustrationWrapper}>
          <LocationTargetIcon />
        </div>

        <h2>Unlock Personalized Rewards</h2>
        <p className={styles.description}>
          Complete your profile by choosing your country to access location-specific content, premium campaigns, and earn personalized rewards.
        </p>

        {/* Feature List Rows */}
        <div className={styles.featureList}>
          <div className={styles.featureRow}>
            <div className={styles.iconCircle}>
              <FileIcon />
            </div>
            <div className={styles.featureText}>
              <h3>Regional Stories & Narratives</h3>
              <p>Get stories, newsletters, and articles specifically curated for your country's readers.</p>
            </div>
          </div>

          <div className={styles.featureRow}>
            <div className={styles.iconCircle}>
              <NotificationIcon />
            </div>
            <div className={styles.featureText}>
              <h3>Personalized Advertisements</h3>
              <p>Enjoy relevant and highly tailored advertisements suited to your local currency and needs.</p>
            </div>
          </div>

          <div className={styles.featureRow}>
            <div className={styles.iconCircle}>
              <ProIcon />
            </div>
            <div className={styles.featureText}>
              <h3>Geo-Targeted Banner Campaigns</h3>
              <p>Participate in exclusive promotional banners and events designed for your specific region.</p>
            </div>
          </div>
        </div>

        {/* Vertical Actions */}
        <div className={styles.actionWrapper}>
          <Button
            text="Select Country"
            onClick={onSelectCountry}
          />
          <button className={styles.maybeLaterLink} onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
