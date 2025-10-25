import MintingComponent from '../components/Mint/MintingComponent';
import { Suspense } from 'react';
import LoadingSkeleton from '../components/util/LoadingSkeleton';

export default function Mint() {
  return (
    <Suspense fallback={<LoadingSkeleton height={400} />}>
      <MintingComponent />
    </Suspense>
  );
}