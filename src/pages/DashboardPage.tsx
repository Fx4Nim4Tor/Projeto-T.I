import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Item } from '../types/supabase';
import { ItemForm } from '../components/ItemForm';
import { ItemCard } from '../components/ItemCard';
import { Input } from '../components/ui/Input';
import { CategoryFilter } from '../components/CategoryFilter';
import { LogOutIcon, CheckCircleIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Navigate, useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const { user, signOut, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'urgent',
    'medium',
    'small',
  ]);
  const [showForm, setShowForm] = useState(false);

  // Redirect if not logged in
  if (!user && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('resolved', false)
        .order('category', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', itemId);

      if (error) throw error;
      
      // Refresh the items list
      fetchItems();
    } catch (error) {
      console.error('Error resolving item:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const filteredItems = items
    .filter((item) => {
      const matchesSearch = item.person_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.includes(item.category);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const priority = { urgent: 3, medium: 2, small: 1 };
      return (
        (priority[b.category as keyof typeof priority] || 0) -
        (priority[a.category as keyof typeof priority] || 0)
      );
    });

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
          <h1 className="text-2xl font-bold text-gray-900">
            Gerenciamento de Itens
          </h1>
          <div className="flex space-x-2">
            {isAdmin && (
              <Button
                variant="secondary"
                leftIcon={<CheckCircleIcon className="w-4 h-4" />}
                onClick={() => navigate('/resolved')}
              >
                Resolvidos
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleLogout}
              leftIcon={<LogOutIcon className="w-4 h-4" />}
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {showForm ? (
                <>
                  <ItemForm onSuccess={() => {
                    fetchItems();
                    setShowForm(false);
                  }} />
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  fullWidth
                  onClick={() => setShowForm(true)}
                  leftIcon={<PlusIcon className="w-4 h-4" />}
                >
                  Criar Novo Item
                </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-full sm:w-auto flex-grow">
                  <Input
                    placeholder="Buscar por nome..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    className="bg-gray-50"
                    leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                  />
                </div>
                <CategoryFilter
                  selectedCategories={selectedCategories}
                  onChange={setSelectedCategories}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando itens...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow-sm text-center">
                <p className="text-gray-500 mb-4">Nenhum item encontrado</p>
                <Button
                  variant="primary"
                  onClick={() => setShowForm(true)}
                  leftIcon={<PlusIcon className="w-4 h-4" />}
                >
                  Criar Primeiro Item
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onResolve={handleResolveItem}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}