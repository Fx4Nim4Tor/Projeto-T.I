import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { TextArea } from './ui/TextArea';
import { Select } from './ui/Select';
import { Card, CardContent, CardFooter, CardHeader } from './ui/Card';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface ItemFormProps {
  onSuccess?: () => void;
}

export const ItemForm: React.FC<ItemFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    personName: '',
    description: '',
    category: 'medium',
  });

  const categoryOptions = [
    { value: 'urgent', label: 'Urgente' },
    { value: 'medium', label: 'Médio' },
    { value: 'small', label: 'Pequeno' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Você precisa estar logado para criar um item.');
      return;
    }

    if (!formData.personName.trim()) {
      setError('Nome da pessoa é obrigatório.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Descrição do item é obrigatória.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('items').insert({
        person_name: formData.personName,
        description: formData.description,
        category: formData.category as 'urgent' | 'medium' | 'small',
        created_by: user.id,
        resolved: false,
      });

      if (error) throw error;

      // Reset form
      setFormData({
        personName: '',
        description: '',
        category: 'medium',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setError(error.message || 'Ocorreu um erro ao criar o item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-800">Criar Novo Item</h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <Input
            label="Nome da Pessoa"
            name="personName"
            value={formData.personName}
            onChange={handleChange}
            placeholder="Digite o nome da pessoa"
            fullWidth
            required
          />
          <TextArea
            label="Descrição do Item"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Digite a descrição do item"
            rows={4}
            fullWidth
            required
          />
          <Select
            label="Categoria"
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            options={categoryOptions}
            fullWidth
          />
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            fullWidth
            isLoading={loading}
          >
            Criar Item
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};