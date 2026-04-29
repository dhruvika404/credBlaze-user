import { Suspense } from 'react';
import MobileCapture from '@/rendering/kycVerification/mobileCapture';

export default function page() {
  return (
    <Suspense>
      <MobileCapture />
    </Suspense>
  );
}
