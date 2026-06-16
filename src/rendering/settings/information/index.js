'use client';
import React, { useState, useEffect } from 'react';
import styles from './information.module.scss';
import EditIcon from '@/icons/editIcon';
import PersonalInformation from './personalInformation';
import { getProfileDetails } from '@/services/profile';
import { useAuth } from '@/context/AuthContext';
import UserIcon from '@/icons/userIcon';
import InfoIcon from '@/icons/infoIcon';
import { Country } from 'country-state-city';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = React.useRef(null);
  const { setUser } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('edit') === 'true') {
        setIsEditing(true);
      }
    }
  }, []);

  useEffect(() => {
    getProfileDetails()
      .then((res) => {
        const p = normaliseProfile(res);
        setProfile(p);
        if (p) {
          setUser(p);
          localStorage.setItem('user', JSON.stringify(p));
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const firstName = profile?.first_name || profile?.firstName || '';
  const lastName = profile?.last_name || profile?.lastName || '';
  const fullName = loading ? 'Loading...' : (`${capitalise(firstName)} ${capitalise(lastName)}`.trim());
  const userId = profile?.user_id || profile?.userId || profile?.id || 'CB-2025-00847';
  const countryVal = profile?.country || 'IN';
  let countryCode = '';
  if (countryVal.length === 2) {
    countryCode = countryVal;
  } else if (countryVal) {
    const matchedCountry = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === countryVal.toLowerCase()
    );
    if (matchedCountry) {
      countryCode = matchedCountry.isoCode;
    }
  }
  const flagUrl = getFlagUrl(countryCode);
  const pendingDetails = profile?.pending_prime_details;
  const remainingAmount = pendingDetails?.remaining_amount || 0;
  const avatarSrc = previewUrl || profile?.profile_image || profile?.profileImage;

  return (
    <div className={styles.information}>
      <div className={styles.right}>
        <div className={styles.informationBox}>
          {pendingDetails && (
            <div className={styles.pendingAlertBanner}>
              <div className={styles.alertContent}>
                <InfoIcon />
                <p>
                  You have a pending balance of <strong>${Number(remainingAmount).toFixed(2)}</strong> for <strong>{pendingDetails.plan_name || 'Pro Membership'}</strong>. Complete payment to activate your plan.
                </p>
              </div>
              <button 
                className={styles.alertBtn} 
                onClick={() => router.push('/settings/plan-pricing')}
              >
                Pay Now
              </button>
            </div>
          )}
          <div className={styles.informationHeader}>
            <div className={styles.leftAlignment}>
              <div className={styles.profileImageWrap}>
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Profile" />
                ) : (
                  <UserIcon width={34} height={34} />
                )}
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
              {isEditing && (
                <div className={styles.imageActions}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <button
                    className={styles.changeBtn}
                    onClick={() => {
                      if (selectedFile) {
                        handleRemoveImage();
                      } else {
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    {selectedFile ? 'Remove' : 'Change'}
                  </button>
                </div>
              )}
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
            {/* {!isEditing && <KycVerification />} */}
            <PersonalInformation
              isEditing={isEditing}
              profile={profile}
              selectedFile={selectedFile}
              onSaved={(updated) => {
                if (updated) {
                  getProfileDetails()
                    .then((res) => {
                      const p = normaliseProfile(res);
                      setProfile(p);
                      if (p) {
                        setUser(p);
                        localStorage.setItem('user', JSON.stringify(p));
                      }
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    })
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
