import Signup from '@/rendering/signup'
import React, { Suspense } from 'react'

export default function page() {
    return (
        <Suspense>
            <Signup />
        </Suspense>
    )
}
