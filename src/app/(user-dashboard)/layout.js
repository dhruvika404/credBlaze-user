import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import CountryModalManager from '@/components/modal/countrySelectionModal/CountryModalManager'
import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function layout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    redirect('/');
  }

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
