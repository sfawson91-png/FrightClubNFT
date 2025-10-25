import dynamic from "next/dynamic";

const ConnectButton = dynamic(
  () => import("@rainbow-me/rainbowkit").then(m => m.ConnectButton),
  { ssr: false }
);

export default ConnectButton;
