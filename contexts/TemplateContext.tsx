import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CVData, Language } from '../types';

export type TemplateType = 'modern' | 'classic' | 'minimal';

interface TemplateContextType {
  template: TemplateType;
  setTemplate: (template: TemplateType) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const TemplateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [template, setTemplate] = useState<TemplateType>('modern');

  return (
    <TemplateContext.Provider value={{ template, setTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = (): TemplateContextType => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};