
'use client';

import { FCABI } from "./abi";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Snackbar, { snackbarClasses } from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Image from "next/image";
import { Box, LinearProgress, Alert } from "@mui/material";
import LoadingSkeleton from "../util/LoadingSkeleton";


import {
  useAccount,
  useAccountEffect,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
  useChainId,
  useSwitchChain,
  useSimulateContract,
} from "wagmi";
import { formatEther } from 'viem';
import { mainnet } from 'viem/chains';

enum MintStage {
  WhitelistOnly,
  Public,
  
}

const StyledCard = styled(Card)({
    maxWidth: 300,
    margin: "0 auto",
    padding: 20,
    textAlign: "center",
    borderRadius: 25,
    marginTop: "50px", 
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
  });
  
const MintNFTComponent = () => {

    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarError, setSnackbarError] = useState<string | null>(null);

    const [totalSupply, setTotalSupply] = useState<number>(0); 
    const [maxMintAmountPerTx] = useState<number>(3); // Contract allows 3 per transaction
    const [_mintAmount, setMintAmount] = useState<number>(1);
    const { isConnected, address, chain } = useAccount();
    // Raw values (may be undefined/unknown in SSR)
    const chainIdRaw = useChainId();
    const { chains } = useSwitchChain();
    
    const { connectModalOpen } = useConnectModal(); 
    const [isWalletConnected, setIsWalletConnected] = useState<boolean>(true); 


    useEffect(() => {
      console.log("connectModalOpen:", connectModalOpen);
      if (connectModalOpen) {
        setIsWalletConnected(true);
      }
    }, [connectModalOpen]);

    const account = useAccount();

    useAccountEffect({
      onConnect({ address, chainId, isReconnected }) {
        console.log("Connected", { address, chainId, isReconnected });
      },
    });
    
    
  const contractConfig = {
    address: "0x46b77a64dCeE752dd4F9e5b26A5273B2e182e57A", // Fright Club contract on Ethereum mainnet
    FCABI,
  } as const;

  const { data: maxMintAmountPerTxData, error: maxMintError } = useReadContract({
    address: contractConfig.address,
    abi: FCABI,
    functionName: "maxMintAmountPerTx",
  });

  const { data: totalSupplyData, error: totalSupplyError } = useReadContract({
    address: contractConfig.address,
    abi: FCABI,
    functionName: "totalSupply",
  });

  const { data: costData, error: costError } = useReadContract({
    address: contractConfig.address,
    abi: FCABI,
    functionName: "cost",
  });

  // Read wallet balance and pause status
  const { data: walletBalance, error: balanceError } = useReadContract({
    address: contractConfig.address,
    abi: FCABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: isPaused, error: pausedError } = useReadContract({
    address: contractConfig.address,
    abi: FCABI,
    functionName: "paused",
  });

  // costData is bigint | undefined; default to 0 if not loaded yet
  const priceWei = (costData ?? BigInt(0)) as bigint;
  const totalWei = priceWei * BigInt(_mintAmount);

  // Pre-validate the mint on-chain before prompting the wallet
  const { data: sim, error: simError, isPending: simPending } = useSimulateContract({
    address: contractConfig.address as `0x${string}`,
    abi: FCABI,
    functionName: 'mint',
    args: [BigInt(_mintAmount)],
    // only include value if price > 0
    ...(totalWei > BigInt(0) ? { value: totalWei } : {}),
    // you can set chainId explicitly if you want to force mainnet
    // chainId: mainnet.id,
  });

  const {
    writeContract,
    data: txHash,              // this is the transaction hash (string | undefined)
    isPending: isMintLoading,  // same semantics
    error: mintError,
  } = useWriteContract();

  const {
    data: txData,
    error: txError,
    isLoading: isTxLoading,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Success state
  const [mintSuccess, setMintSuccess] = useState(false);

  // Normalize everything to safe primitives
  const qty: number = Number(_mintAmount ?? 0);
  const connected: boolean = Boolean(isConnected);
  const chainIdNum: number | undefined =
    typeof chainIdRaw === "number" ? chainIdRaw : undefined;
  
  const currentChain = chainIdNum
    ? chains.find(c => c.id === chainIdNum)
    : undefined;
  
  // This is guaranteed boolean
  const isWrongNetwork: boolean =
    chainIdNum === undefined ? true : chainIdNum !== mainnet.id;
  
  // If you have other flags, normalize them too:
  const pending: boolean = Boolean(isMintLoading || isTxLoading);
  const hasError: boolean = Boolean(mintError);
  
  // Final boolean for the prop
  const isDisabled: boolean =
    qty <= 0 ||
    !connected ||
    isWrongNetwork ||
    pending ||
    hasError ||
    simPending ||
    !sim?.request;

  // Handle successful transaction
  useEffect(() => {
    if (txData && !isTxLoading) {
      setMintSuccess(true);
      setSnackbarError(null);
    }
  }, [txData, isTxLoading]);

  // Reset success state when starting new mint
  useEffect(() => {
    if (isMintLoading) {
      setMintSuccess(false);
    }
  }, [isMintLoading]);

  const calculateCostInEth = (amount: number) => {
    if (priceWei === undefined) return '...';
    const total = priceWei * BigInt(amount);
    return `${formatEther(total)} ETH`;
  };

  // Function to handle incrementing the mint amount
  const incrementMintAmount = () => {
    if (_mintAmount < 3) { // Contract allows max 3 per transaction
      setMintAmount(_mintAmount + 1);
    }
  };

  // Function to handle decrementing the mint amount
  const decrementMintAmount = () => {
    if (_mintAmount > 1) {
      setMintAmount(_mintAmount - 1);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  
const mintNFT = async () => {
    try {
        // Clear any previous errors
        setSnackbarError(null);
        
        // Validation checks
        if (!isConnected) {
            setSnackbarError("Please connect your wallet first");
            return;
        }
        
        if (isWrongNetwork) {
            setSnackbarError(
              `Please switch to Ethereum mainnet. Current network: ${currentChain?.name ?? "Unknown"} (ID: ${chainIdNum ?? "N/A"})`
            );
            return;
        }
        
        if (isPaused === true) {
            setSnackbarError("Minting is currently paused");
            return;
        }
        
        if (!writeContract) {
            setSnackbarError("Mint function not available. Please try again.");
            return;
        }

        if (walletBalance !== undefined && (walletBalance as bigint) >= BigInt(10)) {
            setSnackbarError("You have reached the maximum limit of 10 NFTs per wallet");
            return;
        }
        
        if (!sim?.request) {
          setSnackbarError(`Mint simulation failed: ${simError ? String(simError.message ?? simError) : 'No request'}`);
          return;
        }

        console.log('Attempting to mint...');
        // This sends the EXACT request that the chain validated in simulate
        await writeContract(sim.request);
        console.log('Mint transaction initiated');
    } catch (error) {
        console.error('Error in mintNFT:', error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        setSnackbarError(`Minting failed: ${errorMessage}`);
    }
};
  
  function formatAddress(address?: string) {
    // Define how many characters you want to keep before and after the dots.
    const charactersToKeep = 4;
  
    if (!address) {
      return "Address not available";
    }
  
    // Check if the address is long enough to format.
    if (address.length > 2 * charactersToKeep) {
      const start = address.slice(0, charactersToKeep);
      const end = address.slice(-charactersToKeep);
      return `${start}...${end}`;
    } else {
      return address;
    }
  }

  return (
    <StyledCard>
      <CardContent>
      <Box sx={{
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 1,
          marginBottom: 1,
          maxWidth: "100%",
          borderRadius: "10px"
        }}>
          <Image src="/logo.svg" alt="Logo" width={200} height={80} />
        </Box>
      </CardContent>
      <CardContent>
        <video width="100%" autoPlay loop muted>
          <source src="/PreReveal.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </CardContent>

      <CardContent>
        <Typography variant="h6" component="div" align="center">
          address<br />
        </Typography>
        <Typography variant="h4" component="div" align="center">
          {formatAddress(address)}
        </Typography>
      </CardContent>

      {/* Network Status */}
      <CardContent>
        <Typography variant="body2" align="center" color={!isWrongNetwork ? "green" : "error"}>
          Network: {currentChain?.name ?? 'Unknown'} (ID: {chainIdNum ?? 'N/A'})
          {!isWrongNetwork ? ' ✅' : ' - Please switch to Ethereum mainnet'}
        </Typography>
        <Typography variant="body2" align="center">
          Contract: 0x46b77a64dCeE752dd4F9e5b26A5273B2e182e57A
          {!isWrongNetwork ? ' ✅' : ' - Contract not found on this network'}
        </Typography>
        {isPaused !== undefined && (
          <Typography variant="body2" align="center" color={isPaused ? "error" : "green"}>
            Minting Status: {isPaused ? 'PAUSED' : 'LIVE'}
          </Typography>
        )}
        {walletBalance !== undefined && (
          <Typography variant="body2" align="center">
            Your NFTs: {Number(walletBalance)}/10
          </Typography>
        )}
        {typeof priceWei === 'bigint' && (
          <Typography variant="body2" align="center">
            Price (from contract): {formatEther(priceWei)} ETH
          </Typography>
        )}
        
        {/* Debug Information */}
        <Typography variant="body2" align="center" color="text.secondary">
          Debug: {maxMintError ? `MaxMint Error: ${maxMintError.message}` : 
                  totalSupplyError ? `TotalSupply Error: ${totalSupplyError.message}` :
                  costError ? `Cost Error: ${costError.message}` :
                  balanceError ? `Balance Error: ${balanceError.message}` :
                  pausedError ? `Paused Error: ${pausedError.message}` :
                  'Contract reads working'}
        </Typography>
        {simError && (
          <Typography variant="body2" align="center" color="error">
            Simulation error: {String(simError.message ?? simError)}
          </Typography>
        )}
      </CardContent>

      <CardContent>
        <Grid container alignItems="center" justifyContent="center" spacing={1}>
          <Grid item>
            <Button
              variant="contained"
              onClick={decrementMintAmount}
              disabled={_mintAmount <= 1}
              sx={{
                backgroundColor: "#B31414",
                "&:hover": {
                  // The styles you want when the button is hovered can go here.
                  // This is optional and just an example.
                  backgroundColor: "#9F1111",
                },
                "&:active": {
                  backgroundColor: "black",
                }
              }}
            >
              -
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="h6" component="div" align="center">
              {_mintAmount}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={incrementMintAmount}
              sx={{
                backgroundColor: "#B31414",
                "&:hover": {
                  // The styles you want when the button is hovered can go here.
                  // This is optional and just an example.
                  backgroundColor: "#9F1111",
                },
                "&:active": {
                  backgroundColor: "black",
                }
              }}
              disabled={_mintAmount >=3}
            >
              +
            </Button>
          </Grid>
        </Grid>
      </CardContent>

      <CardContent>
        <Grid container alignItems="center" justifyContent="center" spacing={1}>
          <Grid item>
            <Typography>{calculateCostInEth(_mintAmount)}</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={mintNFT}
              sx={{
                backgroundColor: "#B31414",
                "&:hover": {
                  // The styles you want when the button is hovered can go here.
                  // This is optional and just an example.
                  backgroundColor: "#9F1111",
                },
                "&:active": {
                  backgroundColor: "black",
                }
              }}
              disabled={isDisabled}
            >
              {!isConnected ? 'Connect Wallet' : 
               isWrongNetwork ? 'Switch to Ethereum' :
               isPaused ? 'Minting Paused' :
               walletBalance && Number(walletBalance) >= 10 ? 'Limit Reached' :
               isMintLoading ? 'Minting...' : 'Mint NFT'}
            </Button>
          </Grid>
        </Grid>
      </CardContent>

      {/* Display mint and transaction errors */}
      {mintError && (
        <Typography color="error" align="center">
          Mint Error: {mintError.message}
        </Typography>
      )}

        {snackbarError && (
          <Snackbar open={!!snackbarError} autoHideDuration={6000} onClose={() => setSnackbarError(null)}>
            <MuiAlert onClose={() => setSnackbarError(null)} severity="error">
              {snackbarError}
            </MuiAlert>
          </Snackbar>
        )}

      {txError && (
        <Snackbar open={!!txError} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <MuiAlert onClose={handleSnackbarClose} severity="error">
            {txError.message}
          </MuiAlert>
        </Snackbar>
      )}

      {/* Show loading indicator during minting */}
      {isMintLoading && (
        <CardContent>
          <Typography color="primary" align="center" sx={{ mb: 1 }}>
            🎨 Minting in progress...
          </Typography>
          <LinearProgress />
        </CardContent>
      )}

      {/* Show transaction confirmation */}
      {isTxLoading && (
        <CardContent>
          <Typography color="primary" align="center" sx={{ mb: 1 }}>
            ⏳ Confirming transaction...
          </Typography>
          <LinearProgress />
        </CardContent>
      )}

      {/* Show success message */}
      {mintSuccess && (
        <CardContent>
          <Alert severity="success" sx={{ mb: 1 }}>
            🎉 Successfully minted {_mintAmount} NFT{_mintAmount > 1 ? 's' : ''}!
          </Alert>
          <Typography variant="body2" align="center" color="text.secondary">
            Transaction Hash: {txHash}
          </Typography>
        </CardContent>
      )}

      {/* Show transaction details */}
      {txHash && (
        <CardContent>
          <Typography variant="body2" align="center" color="text.secondary">
            Transaction: {txHash}
          </Typography>
        </CardContent>
      )}
    </StyledCard>
  );
};

export default MintNFTComponent;

