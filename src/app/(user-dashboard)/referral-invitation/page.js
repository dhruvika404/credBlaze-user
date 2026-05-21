import React, { Suspense } from 'react'
import ReferralInvitation from '@/rendering/referralInvitation'

export default function page() {
  return (
    <Suspense>
      <ReferralInvitation />
    </Suspense>
  )
}
