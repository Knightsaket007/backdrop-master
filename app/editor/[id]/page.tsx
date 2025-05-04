'use client'
import React, { useEffect } from 'react';
import Editor from '../Editor';
import { SignedIn, SignedOut, RedirectToSignIn,useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation'

function DisableNumberScroll() {
    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            const activeElement = document.activeElement as HTMLInputElement;
            if (activeElement?.type === 'number') {
                event.preventDefault();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            const activeElement = document.activeElement as HTMLInputElement;
            if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && activeElement?.type === 'number') {
                event.preventDefault();
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return null;
}


export default function Editorage() {

    const params = useParams();
    const editorId = params?.id as string;
    const { isLoaded, isSignedIn, user } = useUser();
    
    console.log('Editor ID:', editorId)

    // useEffect(() => {
    //   // Disable right-click
    //   const handleContextMenu = (e: MouseEvent) => {
    //     e.preventDefault();
    //   };

    //   const handleKeyDown = (e: KeyboardEvent) => {
    //     // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, F12
    //     if (
    //       (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
    //       (e.ctrlKey && e.key === 'U') ||
    //       e.key === 'F12'
    //     ) {
    //       e.preventDefault();
    //     }
    //   };

    //   // Add event listeners
    //   window.addEventListener('contextmenu', handleContextMenu);
    //   window.addEventListener('keydown', handleKeyDown);

    //   // Cleanup event listeners on component unmount
    //   return () => {
    //     window.removeEventListener('contextmenu', handleContextMenu);
    //     window.removeEventListener('keydown', handleKeyDown);
    //   };
    // }, []);




    //=-=-=-=-= Mouse Scroll ko disable for input type number=-=-=-=-=//
    DisableNumberScroll()
    //=-=-=-=-= Mouse Scroll ko disable for input type number=-=-=-=-=//

    if (!isLoaded) return null;

    //   return <Editor />;
    return (
        <>
            <SignedIn>
                <Editor id={user?.id || "guest"} plan="free"/>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
}