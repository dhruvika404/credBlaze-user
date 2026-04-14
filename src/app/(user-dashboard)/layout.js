import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import React from 'react'

export default function layout({ children }) {
  return (
    <div className='bg-light'>
      <div className='user-layout'>
        <div className='user-sidebar'>
          <Sidebar />
        </div>
        <div className='user-children'>
          <Header />
          {children}
        </div>
      </div>
    </div>
  )
}
