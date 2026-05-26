import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import CountryModalManager from '@/components/modal/countrySelectionModal/CountryModalManager'
import React from 'react'

export default function layout({ children }) {
  return (
    <div className='bg-light'>
      <div className='user-layout'>
        <aside className='user-sidebar'>
          <Sidebar />
        </aside>
        <main className='user-children'>
          <Header />
          {children}
        </main>
      </div>
      <CountryModalManager />
    </div>
  )
}
