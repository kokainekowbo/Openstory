import { useState, useEffect } from 'react';

interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
}

const useMobileDetection = (): MobileDetection => {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1200,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
    orientation: 'landscape'
  });

  useEffect(() => {
    const updateDetection = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Breakpoints
      const isMobile = width <= 768;
      const isTablet = width > 768 && width <= 1024;
      const isDesktop = width > 1024;
      
      // Touch device detection
      const isTouchDevice = 'ontouchstart' in window || 
                           navigator.maxTouchPoints > 0 || 
                           (navigator as any).msMaxTouchPoints > 0;
      
      // Orientation
      const orientation = height > width ? 'portrait' : 'landscape';

      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        screenWidth: width,
        screenHeight: height,
        orientation
      });
    };

    // Initial detection
    updateDetection();

    // Listen for resize events
    window.addEventListener('resize', updateDetection);
    window.addEventListener('orientationchange', updateDetection);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDetection);
      window.removeEventListener('orientationchange', updateDetection);
    };
  }, []);

  return detection;
};

export default useMobileDetection; 