'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import CountrySelectionModal from './index';

export default function CountryModalManager() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (user) {
      const countryVal = (user.country || '').trim();
      const isCountryNullOrEmpty = !countryVal ||
        countryVal.toLowerCase() === 'null'

      if (isCountryNullOrEmpty) {
        const dismissed = sessionStorage.getItem('country_modal_dismissed');
        if (dismissed !== 'true') {
          setIsOpen(true);
        }
      } else {
        setIsOpen(false);
      }
    } else {
      setIsOpen(false);
    }
  }, [user, loading]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('country_modal_dismissed', 'true');
  };

  const handleSelectCountry = () => {
    setIsOpen(false);
    sessionStorage.setItem('country_modal_dismissed', 'true');
    router.push('/settings?edit=true');
  };

  return (
    <CountrySelectionModal
      isOpen={isOpen}
      onClose={handleClose}
      onSelectCountry={handleSelectCountry}
    />
  );
}
