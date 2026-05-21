import Dashboard from '@/rendering/dashboard'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  )
}
