'use client'

import React from 'react'
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/nextjs';
import Dashboard from './dashboard';

const DashboardPage = () => {

  const { isLoaded} = useUser();
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="animate-pulse text-xl">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <>

      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

export default DashboardPage;