'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function NavBarClient() {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="flex items-center justify-between">
      <a href="/app/expenses" className="font-semibold">
        Expenses
      </a>
      <a href="/app/categories" className="text-sm underline">
        Categories
      </a>

      <Button variant="ghost" className="h-8 px-2 text-sm" onClick={logout}>
        Logout
      </Button>
    </nav>
  );
}
