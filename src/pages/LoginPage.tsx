import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { MailIcon, LockIcon, LogInIcon, UserPlusIcon } from 'lucide-react';

export function LoginPage() {
  const { signIn, signUp, session, isLoading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLoginMode) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        setIsLoginMode(true);
        setError('Conta criada com sucesso. Verifique seu email e faça login.');
      }
    } catch (error: any) {
      setError(error.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Gerenciamento de Itens
          </h1>
          <p className="text-gray-600">
            {isLoginMode ? 'Faça login para continuar' : 'Crie sua conta para começar'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-center text-gray-800">
              {isLoginMode ? 'Login' : 'Cadastro'}
            </h2>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className={`p-3 rounded-md text-sm ${error.includes('sucesso') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {error}
                </div>
              )}
              
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                fullWidth
                leftIcon={<MailIcon className="w-5 h-5 text-gray-400" />}
              />
              
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                fullWidth
                leftIcon={<LockIcon className="w-5 h-5 text-gray-400" />}
              />
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
                leftIcon={isLoginMode ? <LogInIcon className="w-4 h-4" /> : <UserPlusIcon className="w-4 h-4" />}
              >
                {isLoginMode ? 'Entrar' : 'Cadastrar'}
              </Button>
              
              <p className="text-sm text-center text-gray-600">
                {isLoginMode ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                <button
                  type="button"
                  className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
                  onClick={toggleMode}
                >
                  {isLoginMode ? 'Cadastre-se' : 'Faça login'}
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}