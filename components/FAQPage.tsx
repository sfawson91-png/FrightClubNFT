import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGesture } from "react-use-gesture";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import FAQ from "./FAQComponent";

const FAQPath: React.FC = () => {
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
    <div {...bind()}>
      <div className="treat-background">
        <div className="centered-faq">
          <FAQ />
        </div>
      </div>

      <div className="overlay" ref={overlayRef}></div>

      <Link href="/">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={500}
          height={200}
          className="logo"
        />
      </Link>
      <Link href="/Treat"></Link>
      <style jsx>{`
        .centered-faq {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default FAQPath;