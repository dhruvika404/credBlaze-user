import EmailVerify from '@/rendering/emailVerify'
import React, { Suspense } from 'react'

export default function page() {
    return (
        <Suspense>
            <EmailVerify />
        </Suspense>
    )
}
