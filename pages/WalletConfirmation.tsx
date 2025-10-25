import dynamic from 'next/dynamic';

type WalletConfirmationProps = {
  onUpdateSignatureStatus: (status: boolean) => void;
};

// Tell TS what props the dynamically imported component expects
const WalletConfirmationClient = dynamic<WalletConfirmationProps>(
  () => import('../components/Wallet/WalletConfirmationComponent'),
  { ssr: false }
);

export default function WalletConfirmation({
  onUpdateSignatureStatus,
}: WalletConfirmationProps) {
  return <WalletConfirmationClient onUpdateSignatureStatus={onUpdateSignatureStatus} />;
}