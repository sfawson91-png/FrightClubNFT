import React, { useState, useRef, useEffect } from "react";
import { useGesture } from "react-use-gesture";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

const FrightClubMain: React.FC = () => {
  const [flashlightSize, setFlashlightSize] = useState<number>(75);
  const [clickCount, setClickCount] = useState<number>(0);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const { width, height, ready } = useWindowDimensions();

  const bind = useGesture({
    onMove: ({ xy: [x, y] }) => {
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.style.setProperty("--x", `${x}px`);
        overlay.style.setProperty("--y", `${y}px`);
        overlay.style.setProperty("--size", `${flashlightSize}px`);
      }
    },
    onClick: (event) => {
      if (event.event.target instanceof HTMLElement) {
        const targetElement = event.event.target as HTMLElement;
        if (!targetElement.closest("a, button")) {
          if (clickCount === 3) {
            setFlashlightSize(75);
            setClickCount(0);
          } else {
            setFlashlightSize((prevSize) => prevSize * 1.5);
            setClickCount((prevCount) => prevCount + 1);
          }
        }
      }
    },
  });

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const overlay = overlayRef.current;
      if (overlay) {
        const gamma = event.gamma; // [-90, 90]
        const beta = event.beta; // [-180, 180]

        if (gamma !== null && beta !== null && ready) {
          const x = (gamma + 90) * (width / 180);
          const y = (beta + 180) * (height / 360);

          overlay.style.setProperty("--x", `${x}px`);
          overlay.style.setProperty("--y", `${y}px`);
        }
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [ready, width, height]);

  // Always render a stable container so SSR == first client paint
  return (
    <>
      {/* Background stays fixed and outside gesture container so CSS positioning works reliably */}
      <div className="background-image" />

      {/* A full-screen invisible element that captures gestures; overlay has pointer-events:none so events pass through */}
      <div
        {...bind()}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}
      />

      {/* Overlay shows the radial flashlight effect and centers the title text */}
      <div className="overlay" ref={overlayRef}>
        <div style={{ textAlign: 'center', color: 'white', fontSize: '48px', fontWeight: 'bold', paddingTop: '200px' }}>
          🧛‍♂️ Fright Club 🧟‍♂️
        </div>
        <div style={{ textAlign: 'center', color: 'white', fontSize: '24px', marginTop: '20px' }}>
          3131 animated monsters ready for fun
        </div>
        <div style={{ textAlign: 'center', color: 'white', fontSize: '18px', marginTop: '10px' }}>
          Mint Opens October 25th, 2025 at 9:00 AM PT
        </div>
      </div>

      {/* Use a plain img so the existing .logo CSS (fixed centering) controls layout cleanly */}
      <img src="/logo.svg" alt="Fright Club Logo" className="logo" />
    </>
  );
};

export default FrightClubMain;