import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Item } from '../types/supabase';
import { ItemCard } from '../components/ItemCard';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Navigate, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export function ResolvedItemsPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [resolvedItems, setResolvedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin or not logged in
  if ((!isAdmin || !user) && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    if (user && isAdmin) {
      fetchResolvedItems();
    }
  }, [user, isAdmin]);

  const fetchResolvedItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('resolved', true)
        .order('resolved_at', { ascending: false });

      if (error) throw error;
      setResolvedItems(data || []);
    } catch (error) {
      console.error('Error fetching resolved items:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Itens Resolvidos</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
          >
            Voltar
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando itens resolvidos...</p>
          </div>
        ) : resolvedItems.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm text-center">
            <p className="text-gray-500">Nenhum item resolvido encontrado</p>
            <Button
              className="mt-4"
              variant="primary"
              onClick={() => navigate('/dashboard')}
              leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
            >
              Voltar para o Dashboard
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-6">
              Itens resolvidos são automaticamente removidos após uma semana.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resolvedItems.map((item) => (
                <div key={item.id} className="relative">
                  <ItemCard item={item} />
                  {item.resolved_at && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-md">
                      Resolvido {formatDistanceToNow(new Date(item.resolved_at), { addSuffix: true })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}