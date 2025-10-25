import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import Footer from '../components/Footer';
import { useAccount } from 'wagmi';

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const [flashlightSize, setFlashlightSize] = useState<number>(220);
  const [clickCount, setClickCount] = useState<number>(0);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const bind = useGesture({
    onMove: ({ xy: [x, y] }) => {
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.style.setProperty('--x', `${x}px`);
        overlay.style.setProperty('--y', `${y}px`);
        overlay.style.setProperty('--size', `${flashlightSize}px`);
      }
    },
    onClick: (event) => {
      if (event.event.target instanceof HTMLElement) {
        if (!event.event.target.closest('a, button')) {
          if (clickCount === 3) {
            setFlashlightSize(220);
            setClickCount(0);
          } else {
            setFlashlightSize((p) => p * 1.5);
            setClickCount((p) => p + 1);
          }
        }
      }
    },
  });

  useEffect(() => {
    const onOrient = (e: DeviceOrientationEvent) => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const { gamma, beta } = e;
      if (gamma != null && beta != null) {
        const x = (gamma + 90) * (window.innerWidth / 180);
        const y = (beta + 180) * (window.innerHeight / 360);
        overlay.style.setProperty('--x', `${x}px`);
        overlay.style.setProperty('--y', `${y}px`);
      }
    };
    window.addEventListener('deviceorientation', onOrient);
    return () => window.removeEventListener('deviceorientation', onOrient);
  }, []);

  return (
    <main className="container" {...bind()}>
      <Head>
        <title>🧛‍♂️ Fright Club 🧟‍♂️</title>
        <meta name="description" content="3131 animated monsters ready for fun at the Fright Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`background-image-x ${isConnected ? 'loggedin' : 'loggedout'}`} />
      <div className="overlay" ref={overlayRef} />

      <Image src="/logo.svg" alt="Logo" width={500} height={200} className="logo" priority />

      <div className="myfooter">
        <Footer />
      </div>
    </main>
  );
};

export default Home;