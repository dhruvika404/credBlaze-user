import React, { Suspense } from 'react'
import SpinEarn from '@/rendering/spinEarn'

export default function page() {
  return (
     <Suspense>
            <SpinEarn />
        </Suspense>
  )
}
