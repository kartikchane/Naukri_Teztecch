import { useState, useEffect, useRef } from 'react';

export const useCountUp = (end, duration = 2000, startCounting = false) => {
  const [count, setCount] = useState(0);
  const countingRef = useRef(false);

  useEffect(() => {
    if (!startCounting || countingRef.current) return;
    
    countingRef.current = true;
    let startTime = null;
    const startValue = 0;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * (end - startValue) + startValue);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, startCounting]);

  return count;
};
