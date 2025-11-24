import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIButtonProps {
  onClick: () => void;
  isLoading: boolean;
  label?: string;
  disabled?: boolean;
  minimal?: boolean;
}

export const AIButton: React.FC<AIButtonProps> = ({ 
  onClick, 
  isLoading, 
  label = "Enhance with AI", 
  disabled = false,
  minimal = false
}) => {
  if (minimal) {
     return (
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading || disabled}
        className="text-black bg-neo-pink hover:bg-pink-300 border-2 border-black disabled:opacity-50 p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
        title={label}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading || disabled}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-black bg-neo-blue hover:bg-blue-300 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5" />
      )}
      {label}
    </button>
  );
};