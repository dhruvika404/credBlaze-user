import BusinessCard from '@/rendering/businessCard'
import React, { Suspense } from 'react'

export default function page() {
    return (
         <Suspense>
            <BusinessCard />
        </Suspense>
    )
}
