'use client';

import React, { Suspense } from 'react';
import LoadingSkeleton from '../util/LoadingSkeleton';

export default function UserPortalComponent() {
  return (
    <div className="user-portal">
      <Suspense fallback={<LoadingSkeleton height={400} />}>
        <h1>User Portal</h1>
        {/* TODO: build out the portal UI */}
      </Suspense>
    </div>
  );
}


