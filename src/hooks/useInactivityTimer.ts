import { useEffect, useRef, useState } from 'react';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

export const useInactivityTimer = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setShowDialog(true);
    }, INACTIVITY_TIMEOUT);
  };

  const handleStayHere = () => {
    setShowDialog(false);
    resetTimer();
  };

  const handleGoToSelector = () => {
    window.location.href = 'https://redbullswitch.harrymarah.uk';
  };

  useEffect(() => {
    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Reset timer on any activity (but not when dialog is shown)
    const handleActivity = () => {
      if (!showDialog) {
        resetTimer();
      }
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start the timer initially
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [showDialog]);

  return {
    showDialog,
    handleStayHere,
    handleGoToSelector
  };
};