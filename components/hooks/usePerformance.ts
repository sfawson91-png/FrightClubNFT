import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

export const usePerformance = () => {
  const sent = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || sent.current) return;
    if (!("performance" in window)) return;

    const measurePerformance = () => {
      const startTime = performance.now();
      
      // Measure page load time
      const loadTime = performance.timing?.loadEventEnd 
        ? performance.timing.loadEventEnd - performance.timing.navigationStart 
        : 0;

      // Measure render time
      const renderTime = performance.now() - startTime;

      // Get memory usage if available
      const memoryUsage = (performance as any).memory?.usedJSHeapSize;

      // Log metrics instead of setting state to avoid hydration issues
      console.log('Performance Metrics:', {
        loadTime,
        renderTime,
        memoryUsage,
      });

      sent.current = true;
    };

    // Wait for page to fully load
    const timeoutId = setTimeout(() => {
      if (document.readyState === 'complete') {
        measurePerformance();
      } else {
        window.addEventListener('load', measurePerformance);
      }
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  // Return stable values to avoid hydration issues
  return { metrics: null, isLoading: false };
};

// Hook for lazy loading components
export const useLazyLoad = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, threshold]);

  return { ref: setRef, isVisible };
};

// Hook for debouncing values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
