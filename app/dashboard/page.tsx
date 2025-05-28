'use client'

import React from 'react'
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/nextjs';
import Dashboard from './dashboard';

const page = () => {
const { isLoaded, isSignedIn, user } = useUser();
if (!isLoaded) return null;

    return (
        <>

            <SignedIn>
                {/* <Editor id={user?.id || "guest"} editorId={editorId} /> */}
                <Dashboard/>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    )
}

export default page