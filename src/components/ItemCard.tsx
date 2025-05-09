import React from 'react';
import { Item } from '../types/supabase';
import { Button } from './ui/Button';
import { Card, CardContent, CardFooter } from './ui/Card';
import { CheckIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface ItemCardProps {
  item: Item;
  onResolve?: (id: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onResolve }) => {
  const { isAdmin } = useAuth();
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'urgent':
        return 'bg-red-500';
      case 'medium':
        return 'bg-sky-300';
      case 'small':
        return 'bg-green-300';
      default:
        return 'bg-gray-300';
    }
  };

  const getCategoryTextColor = (category: string) => {
    switch (category) {
      case 'urgent':
        return 'text-white';
      case 'medium':
        return 'text-gray-800';
      case 'small':
        return 'text-gray-800';
      default:
        return 'text-gray-800';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'urgent':
        return 'Urgente';
      case 'medium':
        return 'Médio';
      case 'small':
        return 'Pequeno';
      default:
        return 'Desconhecido';
    }
  };

  const handleResolve = () => {
    if (onResolve) {
      onResolve(item.id);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(item.created_at), { addSuffix: true });

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-0">
        <div
          className={`${getCategoryColor(item.category)} ${getCategoryTextColor(item.category)} py-2 px-4 font-medium`}
        >
          {getCategoryName(item.category)}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{item.person_name}</h3>
          <p className="text-gray-700 mb-4">{item.description}</p>
          <p className="text-xs text-gray-500">Criado {timeAgo}</p>
        </div>
      </CardContent>
      {isAdmin && !item.resolved && (
        <CardFooter className="bg-gray-50 p-3">
          <Button
            variant="success"
            size="sm"
            onClick={handleResolve}
            leftIcon={<CheckIcon className="w-4 h-4" />}
            fullWidth
          >
            Marcar como Resolvido
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};