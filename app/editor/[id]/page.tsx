'use client'
import React, { useEffect, useState } from 'react';
import Editor from '../Editor';
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { fetchEditorState } from '../FetchState';
import { loadGuestEditorState } from '../HandleState';
import { toast, Toaster } from 'sonner';


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
    const { isLoaded, user } = useUser();
    const [payloadData, setpayloadData] = useState<EditorPayload | null>(null);
    const isGuest = editorId === 'guest';

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



    // =-=-=-=-=-Loader-=-=-=-=-//
    const commanloader=()=>{
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
                <div className="animate-pulse text-xl">Loading Editor...</div>
            </div>
        );
    }
    // =-=-=-=-=-Loader-=-=-=-=-//


    // =-=-=-= load editor -=-=-=-//
    // =-=-= fetch states =-=-=-=//
    const router = useRouter();
    useEffect(() => {
        if (isGuest) {
            const emptyProject: EditorPayload = {
                userId: 'guest',
                plan: 'guest',
                editorId: 'guest',
                backgroundImage: null,
                imgWidth: 0,
                imgHeight: 0,
                brushColor: '#000000',
                brushSize: 3,
                showFilters: 'none',
                colorArray: [],
                texts: [],
                stickers: [],
            };
            void loadGuestEditorState()
                .then((savedProject) => {
                    setpayloadData(savedProject ? { ...emptyProject, ...savedProject } as EditorPayload : emptyProject);
                })
                .catch((error) => {
                    console.warn('Could not restore the guest project from this browser.', error);
                    setpayloadData(emptyProject);
                });
            return;
        }

        if (!isLoaded || !user || !editorId) return;

        const loadProject = async () => {
            try {
                const stateData = await fetchEditorState(user.id, editorId);
                if (!stateData) {
                    router.push('/dashboard');
                    return;
                }
                setpayloadData(stateData as EditorPayload);
            } catch (error) {
                console.error('Error fetching editor state', error);
                toast('Error fetching editor state. Please try again later.');
            }
        };

        void loadProject();
    }, [editorId, isGuest, isLoaded, router, user]);
    // =-=-=-= load editor -=-=-=-//


    //=-=-=-=-= Mouse Scroll ko disable for input type number=-=-=-=-=//
    DisableNumberScroll()
    //=-=-=-=-= Mouse Scroll ko disable for input type number=-=-=-=-=//

    // if (!isLoaded) return null;
    if (!isGuest && !isLoaded) {
        return commanloader();
    }

    //   return <Editor />;
    if (isGuest) {
        return <>
            {payloadData ? <Editor id="guest" editorId="guest" stateData={payloadData} /> : commanloader()}
            <Toaster position='top-center' theme='light' />
        </>;
    }

    return <>
        <SignedIn>
            {payloadData && <Editor id={user?.id || ''} editorId={editorId} stateData={payloadData} />}
        </SignedIn>
        <SignedOut><RedirectToSignIn /></SignedOut>
        <Toaster position='top-center' theme='light' />
    </>;
}
