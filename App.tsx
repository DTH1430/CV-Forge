
import React, { useState, useRef, useEffect } from 'react';
import { CVData, getEmptyCVData, Language } from './types';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { translations } from './translations';
import { generateDocx } from './services/docxService';
import { Download, FileText, Printer, Eye, EyeOff, Languages, FileDown, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
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
  // Key to force re-render of Editor on reset
  const [editorKey, setEditorKey] = useState(0);

  const t = translations[language];

  useEffect(() => {
    localStorage.setItem('cv_data', JSON.stringify(cvData));
  }, [cvData]);

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

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-neo-white border-b-4 border-black sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">

            {/* Logo Area */}
            <div className="flex items-center gap-3">
              <div className="bg-neo-black text-white p-2 border-2 border-transparent shadow-[4px_4px_0px_0px_#888]">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-neo-black tracking-tighter uppercase font-display hidden sm:inline">
                CV Forge <span className="text-blue-600">AI</span>
              </span>
              <span className="text-xl font-black text-neo-black tracking-tighter uppercase font-display sm:hidden">
                CV <span className="text-blue-600">AI</span>
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
               {/* Mobile Preview Toggle */}
               <button
                onClick={() => setShowPreviewMobile(!showPreviewMobile)}
                className="md:hidden p-2 border-2 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-neo-yellow"
              >
                {showPreviewMobile ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>

              {/* Language Switch */}
               <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-bold border-2 border-black shadow-neo bg-white hover:bg-neo-blue hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
               >
                 <Languages className="w-4 h-4" />
                 <span>{language === 'vi' ? 'EN' : 'VI'}</span>
               </button>

              {/* Reset - Now visible on mobile */}
              <button
                onClick={handleReset}
                className="flex px-3 py-2 text-sm font-bold border-2 border-black shadow-neo bg-neo-pink hover:bg-red-300 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all items-center gap-2"
                title={t.reset}
              >
                <RefreshCcw className="w-4 h-4" />
              </button>

              {/* Export Group */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleExportDocx}
                  disabled={isExportingDocx}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-neo-green border-2 border-black shadow-neo text-sm font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileDown className="w-4 h-4" />
                  <span>DOCX</span>
                </button>

                <button
                  onClick={handleExportDocx}
                  disabled={isExportingDocx}
                  className="sm:hidden flex items-center justify-center w-10 h-10 bg-neo-green border-2 border-black shadow-neo text-sm font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Export DOCX"
                >
                  <FileDown className="w-5 h-5" />
                </button>

                <button
                  onClick={handlePrint}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-neo-yellow border-2 border-black shadow-neo text-sm font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>PDF</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="sm:hidden flex items-center justify-center w-10 h-10 bg-neo-yellow border-2 border-black shadow-neo text-sm font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  title="Print / PDF"
                >
                  <Printer className="w-5 h-5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8 py-8 flex gap-8">

        {/* Editor Column */}
        <div className={`w-full md:w-5/12 lg:w-1/3 flex-col gap-6 no-print ${showPreviewMobile ? 'hidden md:flex' : 'flex'}`}>
          <div className="bg-neo-blue border-2 border-black shadow-neo p-4 mb-4">
            <h3 className="text-lg font-black uppercase font-display border-b-2 border-black pb-2 mb-2">{t.aiPowered}</h3>
            <p className="text-sm font-medium">
              {t.aiDescription}
            </p>
          </div>
          <Editor key={editorKey} data={cvData} onChange={setCvData} language={language} />
        </div>

        {/* Preview Column */}
        <div className={`w-full md:w-7/12 lg:w-2/3 print-area ${showPreviewMobile ? 'block' : 'hidden md:block'}`}>
           <div className="sticky top-24">
              <div className="mb-4 flex justify-between items-center md:hidden">
                 <h2 className="text-xl font-black uppercase font-display bg-white border-2 border-black px-2 py-1 shadow-neo">{t.preview}</h2>
              </div>

              <div className="print-area">
                <Preview data={cvData} language={language} onChange={setCvData} />
              </div>

              <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-500 mt-8 no-print bg-white/50 inline-block px-2 mx-auto w-full">
                {t.printTip}
              </p>
           </div>
        </div>

      </main>
    </div>
  );
};

export default App;
