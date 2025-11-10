import '../globals.css';
import { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Admin - Intelectus',
  description: 'Área administrativa do sistema Intelectus',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

