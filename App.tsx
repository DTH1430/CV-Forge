
import React, { useState, useRef, useEffect } from 'react';
import { CVData, getEmptyCVData, Language } from './types';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { translations } from './translations';
import { generateDocx } from './services/docxService';
import { Download, FileText, Printer, Eye, EyeOff, Languages, FileDown, RefreshCcw, Layout, Moon, Sun, FileImage, FileText as FileTextIcon, Camera, MoreHorizontal } from 'lucide-react';
import { TemplateProvider, useTemplate } from './contexts/TemplateContext';

// TemplateWrapper Component to handle template context
const TemplateWrapper: React.FC = () => {
  const { template, setTemplate } = useTemplate();
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem('cv_data');
      return saved ? JSON.parse(saved) : getEmptyCVData();
    } catch (e) {
      console.error("Error loading CV data", e);
      return getEmptyCVData();
    }
  });

  const [language, setLanguage] = useState<Language>('en');
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  // Key to force re-render of Editor on reset
  const [editorKey, setEditorKey] = useState(0);

  const t = translations[language];

  useEffect(() => {
    localStorage.setItem('cv_data', JSON.stringify(cvData));
  }, [cvData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setIsExportDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    try {
        await generateDocx(cvData, language);
    } catch (error) {
        console.error("Failed to generate DOCX", error);
        alert("Failed to generate DOCX. Please try again.");
    } finally {
        setIsExportingDocx(false);
    }
  };

  const handleExportPDF = async (quality: 'standard' | 'high' = 'standard') => {
    try {
      const { exportToPDF } = await import('./services/exportService');
      await exportToPDF('cv-preview', quality);
    } catch (error) {
      console.error("Failed to export PDF", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

  const handleExportPNG = async () => {
    try {
      const { exportToPNG } = await import('./services/exportService');
      await exportToPNG('cv-preview');
    } catch (error) {
      console.error("Failed to export PNG", error);
      alert("Failed to export PNG. Please try again.");
    }
  };

  const handleExportJPEG = async () => {
    try {
      const { exportToJPEG } = await import('./services/exportService');
      await exportToJPEG('cv-preview');
    } catch (error) {
      console.error("Failed to export JPEG", error);
      alert("Failed to export JPEG. Please try again.");
    }
  };

  const handleExportMarkdown = async () => {
    try {
      const { exportToMarkdown } = await import('./services/exportService');
      exportToMarkdown(cvData, language);
    } catch (error) {
      console.error("Failed to export Markdown", error);
      alert("Failed to export Markdown. Please try again.");
    }
  };

  const handleExportLaTeX = async () => {
    try {
      const { exportToLaTeX } = await import('./services/exportService');
      exportToLaTeX(cvData, language);
    } catch (error) {
      console.error("Failed to export LaTeX", error);
      alert("Failed to export LaTeX. Please try again.");
    }
  };

  const handleReset = () => {
    if (window.confirm(t.resetConfirm)) {
        // Generate a fresh empty object using the factory function
        const newData = getEmptyCVData();

        // Clear local storage
        localStorage.removeItem('cv_data');

        // Update state to trigger re-render with empty data
        setCvData(newData);

        // Force Editor remount to ensure clean state
        setEditorKey(prev => prev + 1);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'vi' ? 'en' : 'vi');
  };

  const handleTemplateChange = (newTemplate: 'modern' | 'classic' | 'minimal') => {
    setTemplate(newTemplate);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans ${darkMode ? 'dark bg-gray-900 text-gray-200' : ''}`}>
      {/* Navbar */}
      <nav className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-neo-white border-b-4 border-black'} sticky top-0 z-50 no-print`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">

            {/* Logo Area */}
            <div className="flex items-center gap-3">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-neo-black'} text-white p-2 border-2 border-transparent ${darkMode ? 'shadow-[4px_4px_0px_0px_#333]' : 'shadow-[4px_4px_0px_0px_#888]'}`}>
                <FileText className="w-6 h-6" />
              </div>
              <span className={`text-2xl font-black ${darkMode ? 'text-gray-200' : 'text-neo-black'} tracking-tighter uppercase font-display hidden sm:inline`}>
                CV Forge <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>AI</span>
              </span>
              <span className={`text-xl font-black ${darkMode ? 'text-gray-200' : 'text-neo-black'} tracking-tighter uppercase font-display sm:hidden`}>
                CV <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>AI</span>
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
               {/* Mobile Preview Toggle */}
               <button
                onClick={() => setShowPreviewMobile(!showPreviewMobile)}
                className={`${darkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200' : 'bg-neo-yellow border-black'} md:hidden p-2 border-2 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all`}
              >
                {showPreviewMobile ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>

              {/* Template Selector */}
              <div
                className="relative"
                ref={dropdownRef}
              >
                <button
                  className={`${darkMode ? 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700' : 'bg-white text-black border-black'} flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-bold border-2 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <Layout className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.template}</span>
                </button>
                {isDropdownOpen && (
                  <div
                    className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-black'} absolute right-0 mt-1 w-48 border-2 shadow-neo z-50`}
                  >
                    <button
                      onClick={() => { handleTemplateChange('modern'); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm font-bold ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-neo-blue text-black'} ${template === 'modern' ? (darkMode ? 'bg-gray-700' : 'bg-neo-blue') : ''}`}
                    >
                      {t.modernTemplate}
                    </button>
                    <button
                      onClick={() => { handleTemplateChange('classic'); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm font-bold ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-neo-blue text-black'} ${template === 'classic' ? (darkMode ? 'bg-gray-700' : 'bg-neo-blue') : ''}`}
                    >
                      {t.classicTemplate}
                    </button>
                    <button
                      onClick={() => { handleTemplateChange('minimal'); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm font-bold ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-neo-blue text-black'} ${template === 'minimal' ? (darkMode ? 'bg-gray-700' : 'bg-neo-blue') : ''}`}
                    >
                      {t.minimalTemplate}
                    </button>
                  </div>
                )}
              </div>

              {/* Language Switch */}
               <button
                onClick={toggleLanguage}
                className={`${darkMode ? 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700' : 'bg-white text-black border-black'} flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-bold border-2 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all`}
               >
                 <Languages className="w-4 h-4" />
                 <span>{language === 'vi' ? 'EN' : 'VI'}</span>
               </button>

              {/* Reset - Now visible on mobile */}
              <button
                onClick={handleReset}
                className={`${darkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200' : 'bg-neo-pink border-black'} flex px-3 py-2 text-sm font-bold border-2 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all items-center gap-2`}
                title={t.reset}
              >
                <RefreshCcw className="w-4 h-4" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`${darkMode ? 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700' : 'bg-white text-black border-black'} flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-bold border-2 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="hidden sm:inline">{darkMode ? t.lightMode : t.darkMode}</span>
              </button>

              {/* Export Group */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleExportDocx}
                  disabled={isExportingDocx}
                  className={`${darkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200' : 'bg-neo-green border-black'} hidden sm:flex items-center gap-2 px-4 py-2 border-2 shadow-neo text-sm font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FileDown className="w-4 h-4" />
                  <span>DOCX</span>
                </button>

                <button
                  onClick={handleExportDocx}
                  disabled={isExportingDocx}
                  className={`${darkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200' : 'bg-neo-green border-black'} sm:hidden flex items-center justify-center w-10 h-10 border-2 shadow-neo text-sm font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  title="Export DOCX"
                >
                  <FileDown className="w-5 h-5" />
                </button>

                {/* Export Dropdown */}
                <div
                  className="relative"
                  ref={exportDropdownRef}
                >
                  <button
                    onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                    className={`${darkMode ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200' : 'bg-neo-blue border-black'} flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-bold border-2 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all`}
                    aria-expanded={isExportDropdownOpen}
                    aria-haspopup="true"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.export}</span>
                  </button>
                  {isExportDropdownOpen && (
                    <div
                      className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-black'} absolute right-0 mt-1 w-56 border-2 shadow-neo z-50`}
                    >
                      <button
                        onClick={async (e) => { e.stopPropagation(); await handleExportPDF('standard'); setIsExportDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-bold ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-neo-blue'}`}
                      >
                        {t.pdfStandard}
                      </button>
                      <button
                        onClick={async (e) => { e.stopPropagation(); await handleExportPDF('high'); setIsExportDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-bold ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-neo-blue'}`}
                      >
                        {t.pdfHighRes}
                      </button>
                      <button
                        onClick={async (e) => { e.stopPropagation(); await handleExportPNG(); setIsExportDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-bold ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-neo-blue'}`}
                      >
                        {t.pngExport}
                      </button>
                      <button
                        onClick={async (e) => { e.stopPropagation(); await handleExportJPEG(); setIsExportDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-bold ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-neo-blue'}`}
                      >
                        {t.jpegExport}
                      </button>
                      <button
                        onClick={async (e) => { e.stopPropagation(); await handleExportMarkdown(); setIsExportDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-bold ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-neo-blue'}`}
                      >
                        {t.markdownExport}
                      </button>
                      <button
                        onClick={async (e) => { e.stopPropagation(); await handleExportLaTeX(); setIsExportDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-bold ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-neo-blue'}`}
                      >
                        {t.latexExport}
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8 py-8 flex gap-8">

        {/* Editor Column */}
        <div className={`w-full md:w-5/12 lg:w-1/3 flex-col gap-6 no-print ${showPreviewMobile ? 'hidden md:flex' : 'flex'} ${darkMode ? 'bg-gray-900' : ''}`}>
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-neo-blue border-2 border-black'} shadow-neo p-4 mb-4`}>
            <h3 className={`text-lg font-black uppercase font-display ${darkMode ? 'text-gray-200 border-gray-600' : 'border-b-2 border-black'} pb-2 mb-2`}>{t.aiPowered}</h3>
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-800'}`}>
              {t.aiDescription}
            </p>
          </div>
          <Editor key={editorKey} data={cvData} onChange={setCvData} language={language} darkMode={darkMode} />
        </div>

        {/* Preview Column */}
        <div className={`w-full md:w-7/12 lg:w-2/3 print-area ${showPreviewMobile ? 'block' : 'hidden md:block'}`}>
           <div className="sticky top-24">
              <div className="mb-4 flex justify-between items-center md:hidden">
                 <h2 className={`text-xl font-black uppercase font-display ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-white text-black border-black'} border-2 px-2 py-1 shadow-neo`}>{t.preview}</h2>
              </div>

              <div className={`print-area ${darkMode ? 'bg-gray-900' : 'bg-white'} text-black`}>
                <Preview data={cvData} language={language} onChange={setCvData} />
              </div>

              <p className={`text-center text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500 bg-gray-800/50' : 'text-gray-500 bg-white/50'} mt-8 no-print inline-block px-2 mx-auto w-full`}>
                {t.printTip}
              </p>
           </div>
        </div>

      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TemplateProvider>
      <TemplateWrapper />
    </TemplateProvider>
  );
};

export default App;
