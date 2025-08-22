'use client'
import React, { useEffect, useState } from 'react';
import Editor from '../Editor';
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { fetchEditorState } from '../FetchState';
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
    // const [payloadData, setpayloadData] = useState(null)
    const [payloadData, setpayloadData] = useState<EditorPayload>({} as EditorPayload);

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
        const fth = async () => {
            console.log('user id', user?.id)
            console.log('editor id', editorId)
            try {
                commanloader();
                const stateData = await fetchEditorState(user?.id || "guest" as string, editorId);
                console.log('state data is..', stateData)
                if (!stateData) {
                    // setactiveLoader(true);
                    // commanloader();
                    router.push("/dashboard")
                    return;
                }
                setpayloadData(stateData as EditorPayload);
                console.log('state daaata..', stateData)
            }
            catch (error) {
                console.log('error in fetching editor state', error)
                toast("Error fetching editor state. Please try again later.");
            }

        }
        fth()


    }, [])
    // =-=-=-= load editor -=-=-=-//


    //=-=-=-=-= Mouse Scroll ko disable for input type number=-=-=-=-=//
    DisableNumberScroll()
    //=-=-=-=-= Mouse Scroll ko disable for input type number=-=-=-=-=//

    // if (!isLoaded) return null;
    if (!isLoaded) {
        return commanloader();
    }

    //   return <Editor />;
    return (
        <>
            <SignedIn>
                {payloadData && 
                (
                <Editor id={user?.id || "guest"} editorId={editorId} stateData={payloadData}/>
                )
                }
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>

             <Toaster position='top-center' theme='light' />
        </>
    );
}