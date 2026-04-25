'use client';
import Kycpending from '@/rendering/kycVerification/kycpending';
import { useAuth } from '@/context/AuthContext';

export default function KycVerification() {
  const { user } = useAuth();
  const kycStatus = user && user?.kyc_status;

  return kycStatus === 'pending' && <Kycpending />
}

