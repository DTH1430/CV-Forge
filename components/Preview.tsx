import React from 'react';
import { useTemplate } from '../contexts/TemplateContext';
import { ModernTemplate } from './ModernTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { CVData, Language } from '../types';

interface PreviewProps {
  data: CVData;
  language: Language;
  onChange: (data: CVData) => void;
}

export const Preview: React.FC<PreviewProps> = ({ data, language, onChange }) => {
  const { template } = useTemplate();

  // Render the appropriate template based on the selected template
  switch (template) {
    case 'classic':
      return <ClassicTemplate data={data} language={language} onChange={onChange} />;
    case 'minimal':
      return <MinimalTemplate data={data} language={language} onChange={onChange} />;
    case 'modern':
    default:
      return <ModernTemplate data={data} language={language} onChange={onChange} />;
  }
};