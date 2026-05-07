import AddCard from '@/rendering/addCard'
import React, { Suspense } from 'react'

export default function page() {
  return (
     <Suspense>
            <AddCard />
        </Suspense>
  )
}
