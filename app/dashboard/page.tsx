'use client'

import React from 'react'
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/nextjs';
import Dashboard from './dashboard';

const DashboardPage = () => {

  const { isLoaded, isSignedIn, user } = useUser();
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
        {/* <Editor id={user?.id || "guest"} editorId={editorId} /> */}
        <Dashboard userid={user?.id} />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

export default DashboardPage;