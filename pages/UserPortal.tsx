import UserPortalComponent from '../components/UserPortal/UserPortalComponent';
import { Suspense } from 'react';
import LoadingSkeleton from '../components/util/LoadingSkeleton';

export default function UserPortal() {
  return (
    <Suspense fallback={<LoadingSkeleton height={400} />}>
      <UserPortalComponent />
    </Suspense>
  );
}