import { useRouter } from "next/router";
import { Button, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import { useSignMessage, useAccount, useAccountEffect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import type { Address } from "viem";
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const ConfirmationBackdrop = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  backgroundSize: "cover",
  zIndex: 1200,        // header is 1500 — stays above this
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledBox = styled(Box)({
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  padding: "2rem",
  borderRadius: "8px",
  textAlign: "center",
  zIndex: 2,
  position: "relative",
});

export default function WalletConfirmationComponent({ 
  onUpdateSignatureStatus 
}: { 
  onUpdateSignatureStatus: (status: boolean) => void 
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const didNavigate = useRef(false);
  
  const { signMessageAsync, isPending: signing } = useSignMessage();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  useAccountEffect({
    onConnect({ address, chainId, isReconnected }) {
      console.log("Wallet connected", { address, chainId, isReconnected });
    },
    onDisconnect() {
      console.log("Wallet disconnected");
    },
  });

  const handleSignMessage = async () => {
    if (!address) {
      setError("No wallet connected");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const message = `Welcome to Fright Club! Please sign this message to confirm your wallet connection.`;
      
      // Provide either `account` or `connector` (account is simplest)
      await signMessageAsync({
        account: address as Address,   // <-- required in wagmi v2
        message,                      // string is fine for SignableMessage
      });
      
      // Notify parent (monotonic setter recommended)
      onUpdateSignatureStatus(true);

      // Idempotent navigation: avoid repeated pushes (handles Strict Mode double-invoke)
      try {
        if (!didNavigate.current) {
          didNavigate.current = true;
          // Robust same-route check using asPath (ignores query/hash differences)
          const sameRoute = (currentAsPath: string, target: string) => {
            try {
              const cur = new URL(currentAsPath, 'http://x');
              const tgt = new URL(target, 'http://x');
              return cur.pathname.replace(/\/+$/, '') === tgt.pathname.replace(/\/+$/, '');
            } catch {
              return currentAsPath.split('?')[0].split('#')[0].replace(/\/+$/, '') === target.replace(/\/+$/, '');
            }
          };

          if (!sameRoute(router.asPath, '/')) {
            // replace + shallow to avoid extra history entries and refetch loops
            router.replace('/', undefined, { shallow: true }).catch(() => {});
          }
        }
      } catch (e) {
        console.warn('Navigation error after signing:', e);
      }
    } catch (err) {
      console.error("Signature failed:", err);
      setError("Signature failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfirmationBackdrop role="dialog" aria-modal="true" aria-label="Wallet confirmation">
      <StyledBox>
        <Typography variant="h4" color="white" gutterBottom>
          Wallet Confirmation
        </Typography>
        <Typography variant="body1" color="white" paragraph>
          Please connect your wallet using the button in the top-right corner, then sign a message to confirm your connection.
        </Typography>
        
        {error && (
          <Typography variant="body2" color="error" paragraph>
            {error}
          </Typography>
        )}
        
        {!isConnected ? (
          <Button
            variant="contained"
            color="primary"
            onClick={openConnectModal ?? undefined}
            sx={{ mt: 2 }}
          >
            Open Wallet Modal
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSignMessage}
            disabled={!isConnected || !address || signing}
            sx={{ mt: 2 }}
          >
            {signing ? "Signing…" : "Sign to continue"}
          </Button>
        )}
      </StyledBox>
    </ConfirmationBackdrop>
  );
}
