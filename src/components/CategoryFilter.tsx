import React from 'react';

interface CategoryOption {
  id: string;
  label: string;
  color: string;
  textColor: string;
}

interface CategoryFilterProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  onChange,
}) => {
  const categories: CategoryOption[] = [
    {
      id: 'urgent',
      label: 'Urgente',
      color: 'bg-red-500',
      textColor: 'text-white',
    },
    {
      id: 'medium',
      label: 'Médio',
      color: 'bg-sky-300',
      textColor: 'text-gray-800',
    },
    {
      id: 'small',
      label: 'Pequeno',
      color: 'bg-green-300',
      textColor: 'text-gray-800',
    },
  ];

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter((id) => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isSelected = selectedCategories.includes(category.id);
        return (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`
              ${category.color} ${category.textColor}
              px-3 py-1 rounded-md text-sm font-medium
              transition-all duration-200
              ${isSelected ? 'ring-2 ring-offset-2 ring-gray-500' : 'opacity-70 hover:opacity-100'}
            `}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
};