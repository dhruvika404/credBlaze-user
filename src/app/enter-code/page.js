import { Suspense } from 'react';
import EnterCode from '@/rendering/enterCode';

export default function page() {
  return (
    <Suspense>
      <EnterCode />
    </Suspense>
  );
}
