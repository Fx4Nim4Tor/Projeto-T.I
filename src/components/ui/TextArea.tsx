import React, { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    const textareaClasses = [
      'px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-gray-400',
      'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none',
      error ? 'border-red-500' : 'border-gray-300',
      fullWidth ? 'w-full' : '',
      className,
    ].join(' ');

    return (
      <div className={`flex flex-col space-y-1 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea ref={ref} className={textareaClasses} {...props} />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';