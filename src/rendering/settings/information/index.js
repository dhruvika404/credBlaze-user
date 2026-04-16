'use client';
import React, { useState, useEffect } from 'react';
import styles from './information.module.scss';
import EditIcon from '@/icons/editIcon';
import KycVerification from './kycVerification';
import PersonalInformation from './personalInformation';
import { getProfileDetails } from '@/services/profile';

const ProfileImage = '/assets/icons/profile.svg';

function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getFlagUrl(countryCode) {
  if (!countryCode || countryCode.length !== 2) return null;
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

function normaliseProfile(raw) {
  if (!raw) return null;
  return raw?.data?.[0] ?? raw?.data ?? raw?.payload?.data?.[0] ?? raw?.payload ?? raw;
}

export default function Information() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfileDetails()
      .then((res) => setProfile(normaliseProfile(res)))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const firstName = profile?.first_name || profile?.firstName || '';
  const lastName = profile?.last_name || profile?.lastName || '';
  const fullName = loading ? 'Loading...' : (`${capitalise(firstName)} ${capitalise(lastName)}`.trim() || 'Naitik Kumar');
  const userId = profile?.user_id || profile?.userId || profile?.id || 'CB-2025-00847';
  const countryCode = profile?.country || '';
  const flagUrl = getFlagUrl(countryCode);
  const avatarSrc = profile?.profile_image || profile?.profileImage || ProfileImage;

  return (
    <div className={styles.information}>
      <div className={styles.right}>
        <div className={styles.informationBox}>
          <div className={styles.informationHeader}>
            <div className={styles.leftAlignment}>
              <div className={styles.profileImageWrap}>
                <img src={avatarSrc} alt="Profile" />
              </div>
              <div className={styles.userInfo}>
                <div className={styles.namecountry}>
                  <h3>{fullName}</h3>
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={countryCode}
                      className={styles.flagImg}
                    />
                  )}
                </div>
                <div className={styles.idnumber}>
                  <button>ID:{userId}</button>
                </div>
              </div>
            </div>
            <div className={styles.edit}>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)}>
                  <EditIcon />
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className={styles.spacingGrid}>
            {!isEditing && <KycVerification />}
            <PersonalInformation
              isEditing={isEditing}
              profile={profile}
              onSaved={(updated) => {
                if (updated) {
                  getProfileDetails()
                    .then((res) => setProfile(normaliseProfile(res)))
                    .catch(() => { });
                }
                setIsEditing(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
