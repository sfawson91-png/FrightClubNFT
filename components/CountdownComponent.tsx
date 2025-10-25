
// components/Home/CountdownComponent.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function formatRemaining(ms: number) {
  if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return { d, h, m, s };
}

const CountdownComponent: React.FC<{ targetMs: number }> = ({ targetMs }) => {
  // 🚫 No Date.now() in render: start as null; only set on client
  const [now, setNow] = useState<number | null>(null);
  const doneRef = useRef(false);

  // Start ticking after mount
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = useMemo(() => {
    if (now == null) return null;
    return formatRemaining(Math.max(0, targetMs - now));
  }, [targetMs, now]);

  const isLive = now != null && now >= targetMs;

  // Optional: fire once when it hits zero (kept pattern-friendly)
  useEffect(() => {
    if (!remaining) return;
    if (!doneRef.current && remaining.d === 0 && remaining.h === 0 && remaining.m === 0 && remaining.s === 0) {
      doneRef.current = true;
      // onComplete?.(); // hook here if you need it
    }
  }, [remaining]);

  // SSR/first paint: render a stable, deterministic placeholder (no time)
  if (now == null || !remaining) {
    return (
      <div className="countdown-container">
        <div className="countdown">
          <div className="countdown-title">
            Mint Opens <br />
            Oct 25, 2025 — 9:00 AM PT
            <br />
          </div>
          <div className="countdown-placeholder">Loading countdown…</div>
          <div className="social-links">
            <Link href="https://x.com/frightclub_nft" className="social-link" target="_blank" rel="noopener noreferrer">
              <Image src="/trick.svg" alt="X (Twitter)" width={200} height={80} />
            </Link>
            <Link href="/FAQ" className="social-link" target="_blank" rel="noopener noreferrer">
              <Image src="/treat.svg" alt="FAQ" width={200} height={80} />
            </Link>
          </div>
        </div>
        <style jsx>{`
          .countdown-container { display:flex; justify-content:center; align-items:center; width:100%; height:100vh; opacity:90%; }
          .countdown-title { font-family:'Montserrat Black',sans-serif; font-size:60px; color:#b31414; text-align:center; }
          .countdown { font-family:'Montserrat Black',sans-serif; font-size:80px; color:white; background-color:#000; text-align:center; padding:40px; border-radius:50px; }
          .countdown-placeholder { font-size:24px; color:#ccc; margin:20px 0; }
          .social-links { margin-top:20px; display:flex; justify-content:center; }
          .social-link { display:flex; flex-direction:column; align-items:center; text-decoration:none; color:white; margin:0 20px; }
          .social-link :global(img) { width:50px; height:50px; }
        `}</style>
      </div>
    );
  }

  // Client-rendered, live countdown (now is defined)
  return (
    <div className="countdown-container">
      <div className="countdown">
        <div className="countdown-title">
          {isLive ? (
            <>
              🎉 Mint is LIVE! <br />
              Oct 25, 2025 — 9:00 AM PT
            </>
          ) : (
            <>
              Mint Opens <br />
              Oct 25, 2025 — 9:00 AM PT
            </>
          )}
          <br />
        </div>

        {!isLive ? (
          <div className="time-row">
            {remaining.d}d : {remaining.h}h : {remaining.m}m : {remaining.s}s
          </div>
        ) : (
          <div className="time-row">00d : 00h : 00m : 00s</div>
        )}

        <div className="social-links">
          <Link href="https://x.com/frightclub_nft" className="social-link" target="_blank" rel="noopener noreferrer">
            <Image src="/trick.svg" alt="X (Twitter)" width={200} height={80} />
          </Link>
          <Link href="/FAQ" className="social-link" target="_blank" rel="noopener noreferrer">
            <Image src="/treat.svg" alt="FAQ" width={200} height={80} />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .countdown-container { display:flex; justify-content:center; align-items:center; width:100%; height:100vh; opacity:90%; }
        .countdown-title { font-family:'Montserrat Black',sans-serif; font-size:60px; color:#b31414; text-align:center; }
        .countdown { font-family:'Montserrat Black',sans-serif; font-size:80px; color:white; background-color:#000; text-align:center; padding:40px; border-radius:50px; }
        .time-row { font-size:56px; margin-top:8px; }
        .social-links { margin-top:20px; display:flex; justify-content:center; }
        .social-link { display:flex; flex-direction:column; align-items:center; text-decoration:none; color:white; margin:0 20px; }
        .social-link :global(img) { width:50px; height:50px; }
      `}</style>
    </div>
  );
};

export default CountdownComponent;
