import './globals.css';
import Providers from './providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-3xl p-4">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
