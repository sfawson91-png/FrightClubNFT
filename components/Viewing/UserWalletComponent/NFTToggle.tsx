import React, { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import Image from "next/image";
import { useAccount, useWriteContract, useReadContract, useChainId } from "wagmi";
import { Alchemy, Network } from "alchemy-sdk";
import type { Abi, Address } from "viem";
import { mainnet } from "viem/chains";
import { FCABI } from "../../Mint/abi";

// strongly type ABI & address
const ABI: Abi = FCABI as unknown as Abi;

const CONTRACT_ADDRESS = "0x46b77a64dCeE752dd4F9e5b26A5273B2e182e57A" as Address;

interface Nft {
  metadata?: {
    image: string;
  };
}

const StyledCard = styled(Card)({
  maxWidth: 440,
  margin: "0 auto",
  padding: 20,
  textAlign: "center",
  borderRadius: 25,
  marginTop: "130px",
  backgroundColor: "rgba(255, 255, 255, 0.4)",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
});

const SquareImage = styled("div")({
  width: "20%",
  paddingTop: "40%",
  position: "relative",
  "& .logo": {
    position: "absolute",
    objectFit: "cover",
    width: "100%",
    height: "100%",
    top: "-40px",
  },
});


const NFTComponent = () => {
  const [currentNFT, setCurrentNFT] = useState<string>("");
  const [imgSrc, setImgSrc] = useState<string>("");
  const [selectedFaceState, setSelectedFaceState] = useState<string>("1");

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const tokenIdStr = currentNFT;

  // Alchemy setup - aligned with mainnet
  const alchemy = new Alchemy({
    apiKey: "ztH6HxLPsi8Bc444sZ3TmXl-OMetnT_o",
    network: Network.ETH_MAINNET,
  });

  useEffect(() => {
    const getNftMetadata = async () => {
      try {
        if (!tokenIdStr) return;
        const res = await alchemy.nft.getNftMetadata(CONTRACT_ADDRESS, tokenIdStr, {});
        const uri =
          (res?.rawMetadata as any)?.metadata?.image ??
          (res?.rawMetadata as any)?.image ??
          (res as any)?.metadata?.image ??
          "";
        if (uri) setImgSrc(uri);
      } catch (err) {
        console.error("Failed to fetch NFT metadata:", err);
      }
    };
      getNftMetadata();
  }, [tokenIdStr]);

  // ========= READ (wagmi v2) =========
  // Guard: only query when we have an address
  const {
    data: userTokenIDs,
    isPending: readPending,
    isError: readError,
    error: readErrObj,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "tokensOfOwner",
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: Boolean(address),
    },
  });

  // ========= WRITE (wagmi v2) =========
  const { writeContract, isPending: isWritePending, error: writeError } = useWriteContract();

  const handleSubmit = () => {
    // Validate inputs before the call
    const tidOk = tokenIdStr !== "" && !Number.isNaN(Number(tokenIdStr));
    const face = Number(selectedFaceState);
    const faceOk = Number.isInteger(face) && face >= 0 && face <= 255;
    
    if (!address || !tidOk || !faceOk) return;

    // setFaceState(uint256 _tokenId, uint8 _state)
    // tokenId must be bigint for viem/wagmi
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "setFaceState",
      account: address as Address,          // <— provide the account
      chain: mainnet,                      // <— use mainnet chain object
      args: [BigInt(tokenIdStr), Number(selectedFaceState)],      // uint256, uint8
    });
  };

  function formatAddress(addr?: string) {
    const n = 4;
    if (!addr) return "Address not available";
    return addr.length > n * 2 ? `${addr.slice(0, n)}...${addr.slice(-n)}` : addr;
  }

  const onPickToken = (id: number | bigint | string) => {
    // Normalize to string for state, but ensure later we BigInt() it
    setCurrentNFT(String(id));
  };

  const disabledChange =
    !isConnected ||
    !address ||
    !tokenIdStr ||
    Number.isNaN(Number(tokenIdStr)) ||
    isWritePending;
  
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h3" component="div" align="center">
          User Portal
        </Typography>
        <SquareImage>
          {imgSrc && (
              <CardContent>
                <Typography variant="h6" component="div" align="center">
                  NFT Media
                </Typography>
                <Grid container alignItems="center" justifyContent="center" spacing={1}>
                  <Grid item>
                  {/* Next/Image needs width/height OR fill */}
                  <Image src={imgSrc} alt="NFT Media" width={100} height={100} />
                </Grid>
                </Grid>
              </CardContent>
          )}
        </SquareImage>
      </CardContent>

      <CardContent>
        <Typography variant="h6" component="div" align="center">
          User Wallet:
          </Typography>
          <Typography variant="h5" component="div" align="center">
          {formatAddress(address)}
        </Typography>

        <Grid container justifyContent="center" spacing={1}>
          {!address ? (
            <Typography>Connect a wallet to load your tokens.</Typography>
          ) : readPending ? (
            <Typography>Loading token IDs...</Typography>
          ) : readError ? (
            <Typography>Error loading tokens: {String(readErrObj?.message ?? "Unknown error")}</Typography>
          ) : Array.isArray(userTokenIDs) && userTokenIDs.length > 0 ? (
            (userTokenIDs as Array<number | bigint>).map((tokenID) => (
              <Grid item key={String(tokenID)}>
                <Button onClick={() => onPickToken(tokenID)}>Token ID #{String(tokenID)}</Button>
              </Grid>
            ))
          ) : (
            <Typography>No tokens found for this address.</Typography>
          )}
        </Grid>
      </CardContent>

      <CardContent>
        <Typography variant="h6" component="div" align="center">
            Facial Expression
        </Typography>
        <Grid container alignItems="center" justifyContent="center" spacing={1}>
          <Grid item>
            <Button
              variant={selectedFaceState === "0" ? "contained" : "outlined"}
              onClick={() => setSelectedFaceState("0")}
            >
              Joking
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant={selectedFaceState === "1" ? "contained" : "outlined"}
              onClick={() => setSelectedFaceState("1")}
            >
              Scary
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant={selectedFaceState === "2" ? "contained" : "outlined"}
              onClick={() => setSelectedFaceState("2")}
            >
              Serious
            </Button>
          </Grid>
        </Grid>
      </CardContent>

      <CardContent>
        <Button disabled={disabledChange} onClick={handleSubmit}>
          {isWritePending ? "Changing…" : "CHANGE EXPRESSION"}
        </Button>
        {writeError && (
          <Typography sx={{ mt: 1 }} color="error">
            {String(writeError.message ?? writeError)}
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default NFTComponent;