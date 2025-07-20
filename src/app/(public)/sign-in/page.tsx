'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/brands');
  };

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <Card className="w-[400px]">
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl font-bold">Intelectus</span>
          <span className="text-zinc-400">
            Sistema de Leitura de Revista do INPI
          </span>
        </div>

        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-6">
            <Input type="email" placeholder="Email" />

            <div className="flex flex-col items-start gap-2">
              <Input type="password" placeholder="Senha" />

              <button
                type="button"
                onClick={() => {}}
                className="cursor-pointer text-sm hover:underline"
              >
                Esqueceu sua senha?
              </button>
            </div>

            <Button onClick={handleLogin}>Entrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
