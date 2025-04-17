import React, { useState, useEffect } from 'react';
import { RingLoader } from 'react-spinners';

const LoaderComp = () => {
  const [showText, setShowText] = useState(false);
  const [showAdditionalText, setShowAdditionalText] = useState(false);

  useEffect(() => {
    // Set a timeout for 5 seconds
    const timer1 = setTimeout(() => {
      setShowText(true); // Show text after 5 seconds
    }, 5000);

    

    // Set a timeout for 1 minutes (120 seconds)
    const timer2 = setTimeout(() => {
      setShowAdditionalText(true); // Show additional text after 2 minutes
    }, 30000);

    // Cleanup the timers when the component unmounts
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <>
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-75" style={{ zIndex: '10000' }}></div>

      {/* RingLoader Centered */}
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-opacity-0" style={{ zIndex: '10010' }}>
        <RingLoader color="rgb(79 70 229)" size={150} />

        {/* Show text after 5 seconds */}
        {showText && (
          <p className="mt-4 text-xl text-indigo-600 font-semibold">
            Please wait, we are coming for you...
          </p>
        )}
      
        {/* Show additional text after 2 minutes */}
        {showAdditionalText && (
          <p className="mt-2 text-lg text-indigo-400 font-medium">
            We're almost there! Thanks for your patience.
          </p>
        )}
      </div>
    </>
  );
};

export default LoaderComp;