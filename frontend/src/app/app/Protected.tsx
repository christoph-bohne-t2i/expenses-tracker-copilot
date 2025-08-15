'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api('/expenses') //ToDo: use another endpoint when implemented like auth/me
      .then(() => setReady(true))
      .catch(() => router.replace('/login'));
  }, [router]);

  if (!ready)
    return (
      <div className="p-6 text-sm text-muted-foreground">Checking session…</div>
    );
  return <>{children}</>;
}
