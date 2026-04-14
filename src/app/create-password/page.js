import { Suspense } from 'react';
import CreatePassword from '@/rendering/createPassword';

export default function page() {
  return (
    <Suspense>
      <CreatePassword />
    </Suspense>
  );
}
