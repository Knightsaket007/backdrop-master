'use client'
import React, { useEffect } from 'react';
import Editor from './Editor';

export default function Editorage() {
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

  return <Editor />;
}