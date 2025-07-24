import '../globals.css';
import { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Intelectus',
  description: 'Sistema de Automação de Dados Públicos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
