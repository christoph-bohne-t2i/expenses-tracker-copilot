import NavBarClient from '../NavBarClient';
import Protected from './Protected';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Protected>
      <section className="space-y-4">
        <NavBarClient />
        {children}
      </section>
    </Protected>
  );
}
