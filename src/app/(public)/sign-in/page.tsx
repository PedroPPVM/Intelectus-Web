'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutateAsync: onSignIn, isPending: isLoadingSignIn } = useMutation({
    mutationKey: ['sign-in'],
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => await signIn(email, password),
    onError: (errorMessage: string) => {
      if (errorMessage === 'Credenciais inválidas')
        setErrorMessage(errorMessage);
      else toast.error(errorMessage);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSignIn({ email, password });
  };

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <Card className="w-[400px]">
        <div className="flex flex-col items-center gap-2 pt-4">
          <span className="text-2xl font-bold">Intelectus</span>
          <span className="text-sm text-zinc-400">
            Sistema de Leitura de Revista do INPI
          </span>
        </div>

        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setErrorMessage(null);
                setEmail(e.target.value);
              }}
            />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                className="pr-10"
                onChange={(e) => {
                  setErrorMessage(null);
                  setPassword(e.target.value);
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-muted-foreground absolute top-2 right-3 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              {errorMessage && (
                <span className="mb-[-20px] flex pt-1 text-xs text-red-500">
                  {errorMessage}
                </span>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoadingSignIn}
              className="disabled:bg-gray-400"
            >
              {isLoadingSignIn && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              <span>Entrar</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
