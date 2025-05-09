import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, fullWidth = false, className = '', onChange, ...props }, ref) => {
    const selectClasses = [
      'px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-gray-400',
      'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none',
      error ? 'border-red-500' : 'border-gray-300',
      fullWidth ? 'w-full' : '',
      className,
    ].join(' ');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className={`flex flex-col space-y-1 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={selectClasses}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';