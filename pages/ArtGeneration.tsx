import type { NextPage } from "next";
import Head from "next/head";
import { useState, useRef } from "react";
import { useGesture } from "react-use-gesture";
import AppMenu from "../components/Header";
import ArtGenerationManager from "../components/ArtGeneration/ArtGenerationManager";
import Footer from "../components/Footer";

const ArtGenerationPage: NextPage = () => {
  const [flashlightSize, setFlashlightSize] = useState<number>(75);
  const [clickCount, setClickCount] = useState<number>(0);
  const overlayRef = useRef<HTMLDivElement | null>(null);

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

  const handleMetadataUpdated = (tokenId: number, metadataHash: string) => {
    console.log(`Metadata updated for token ${tokenId}: ${metadataHash}`);
    // Here you could trigger additional actions like updating the smart contract
  };

  return (
    <div className="container" {...bind()}>
      <Head>
        <title>🎨 Art Generation - Fright Club</title>
        <meta
          content="Manage art generation and IPFS metadata updates for Fright Club NFTs"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <div className="background-image-z">
        <AppMenu />
        
        <ArtGenerationManager onMetadataUpdated={handleMetadataUpdated} />

        <div className="overlay" ref={overlayRef}></div>
      </div>

      <div className="myfooter">
        <Footer />
      </div>
    </div>
  );
};

export default ArtGenerationPage;


