import { Suspense, lazy } from 'react';
import { useHashRoute, isProposalRoute } from '@/lib/useHashRoute';

const GuestExperienceApp = lazy(() => import('./GuestExperienceApp'));
const ProposalApp = lazy(() => import('./phase2/ProposalApp'));

function Loading() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui' }} aria-live="polite">
      Зареждане…
    </div>
  );
}

export default function App() {
  const route = useHashRoute();

  if (isProposalRoute(route)) {
    return (
      <Suspense fallback={<Loading />}>
        <ProposalApp />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <GuestExperienceApp />
    </Suspense>
  );
}
