'use client';

import { useEffect, useState } from 'react';

interface WindowDimensions {
  width: number;
  height: number;
  ready: boolean;
}

export function useWindowDimensions() {
  const [state, setState] = useState<WindowDimensions>({ 
    width: 0, 
    height: 0, 
    ready: false 
  });

  useEffect(() => {
    const update = () => setState({ 
      width: window.innerWidth, 
      height: window.innerHeight, 
      ready: true 
    });

    // Initial update
    update();

    // Listen for resize events
    window.addEventListener('resize', update);

    // Cleanup
    return () => window.removeEventListener('resize', update);
  }, []);

  return state;
}