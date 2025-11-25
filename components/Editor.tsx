
import React, { useState, useCallback } from 'react';
import { CVData, Experience, Education, Project, Language } from '../types';
import { translations } from '../translations';
import { AIButton } from './AIButton';
import { generateSummary, enhanceDescription, suggestSkills } from '../services/geminiService';
import { Plus, Trash2, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface EditorProps {
  data: CVData;
  onChange: (data: CVData) => void;
  language: Language;
  darkMode?: boolean;
}

const EditorComponent: React.FC<EditorProps> = ({ data, onChange, language, darkMode = false }) => {
  const [activeSections, setActiveSections] = useState<string[]>(['personal']);
  const [loadingAI, setLoadingAI] = useState<Record<string, boolean>>({});
  const t = translations[language];

  const updateField = useCallback((section: keyof CVData, field: string, value: any) => {
    onChange({
      ...data,
      [section]: {
        ...data[section] as any,
        [field]: value
      }
    });
  }, [data, onChange]);

  const handleGenerateSummary = useCallback(async () => {
    setLoadingAI(prev => ({ ...prev, summary: true }));
    try {
      const context = {
        jobTitle: data.experience[0]?.position,
        skills: data.skills,
        experienceCount: data.experience.length
      };
      const summary = await generateSummary(context, language);
      onChange({ ...data, summary });
    } finally {
      setLoadingAI(prev => ({ ...prev, summary: false }));
    }
  }, [data, language, onChange]);

  const handleSuggestSkills = useCallback(async () => {
    setLoadingAI(prev => ({ ...prev, skills: true }));
    try {
      const jobTitle = data.experience[0]?.position || 'professional';
      const suggestions = await suggestSkills(jobTitle, language);
      const uniqueSkills = Array.from(new Set([...data.skills, ...suggestions]));
      onChange({ ...data, skills: uniqueSkills });
    } finally {
      setLoadingAI(prev => ({ ...prev, skills: false }));
    }
  }, [data, language, onChange]);

  const handleEnhanceExp = useCallback(async (id: string, text: string) => {
    setLoadingAI(prev => ({ ...prev, [`exp-${id}`]: true }));
    try {
      const enhanced = await enhanceDescription(text, language, 'experience');
      const newExp = data.experience.map(e => e.id === id ? { ...e, description: enhanced } : e);
      onChange({ ...data, experience: newExp });
    } finally {
      setLoadingAI(prev => ({ ...prev, [`exp-${id}`]: false }));
    }
  }, [data, language, onChange]);

  const addExperience = useCallback(() => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onChange({ ...data, experience: [newExp, ...data.experience] });
  }, [data, onChange]);

  const removeExperience = useCallback((id: string) => {
    onChange({ ...data, experience: data.experience.filter(e => e.id !== id) });
  }, [data, onChange]);

  const updateExperience = useCallback((id: string, field: keyof Experience, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  }, [data, onChange]);

  const addEducation = useCallback(() => {
      const newEdu: Education = {
        id: crypto.randomUUID(),
        institution: '',
        degree: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      };
      onChange({ ...data, education: [newEdu, ...data.education] });
  }, [data, onChange]);

  const removeEducation = useCallback((id: string) => {
      onChange({ ...data, education: data.education.filter(e => e.id !== id) });
  }, [data, onChange]);

  const updateEducation = useCallback((id: string, field: keyof Education, value: any) => {
      onChange({
        ...data,
        education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e)
      });
  }, [data, onChange]);

  const addProject = useCallback(() => {
    const newProj: Project = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      link: '',
      startDate: '',
      endDate: '',
      current: false
    };
    onChange({ ...data, projects: [newProj, ...data.projects] });
  }, [data, onChange]);

  const removeProject = useCallback((id: string) => {
    onChange({ ...data, projects: data.projects.filter(p => p.id !== id) });
  }, [data, onChange]);

  const updateProject = useCallback((id: string, field: keyof Project, value: any) => {
    onChange({
      ...data,
      projects: data.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  }, [data, onChange]);

  const handleEnhanceProject = useCallback(async (id: string, text: string) => {
    setLoadingAI(prev => ({ ...prev, [`proj-${id}`]: true }));
    try {
      const enhanced = await enhanceDescription(text, language, 'project');
      const newProjs = data.projects.map(p => p.id === id ? { ...p, description: enhanced } : p);
      onChange({ ...data, projects: newProjs });
    } finally {
      setLoadingAI(prev => ({ ...prev, [`proj-${id}`]: false }));
    }
  }, [data, language, onChange]);

  const toggleSection = useCallback((section: string) => {
    setActiveSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  }, []);

  // Neo-Brutal Component Helpers
  const SectionHeader = useCallback(({ title, isOpen, onClick }: { title: string, isOpen: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 border-b-2 border-black transition-colors ${darkMode ? 'bg-gray-800 text-gray-200' : isOpen ? 'bg-neo-yellow' : 'bg-white hover:bg-gray-50'}`}
    >
      <span className={`font-bold uppercase tracking-wider ${darkMode ? 'text-gray-200' : 'text-black'} font-display`}>{title}</span>
      <div className={`border-2 border-black p-1 ${darkMode ? 'bg-gray-700' : 'bg-white'} ${isOpen ? 'rotate-180' : ''} transition-transform`}>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>
    </button>
  ), [darkMode]);

  const InputLabel = useCallback(({ label, tooltip }: { label: string, tooltip?: string }) => (
    <div className="flex items-center gap-2 mb-1.5">
      <label className={`block text-xs font-bold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>{label}</label>
      {tooltip && (
        <div className="group relative">
          <HelpCircle className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-black'} cursor-help transition-colors`} />
          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-black text-white'} text-xs font-medium normal-case shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hidden group-hover:block z-50 pointer-events-none text-center border-2 border-white`}>
            {tooltip}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] ${darkMode ? 'border-t-gray-800' : 'border-t-black'}`}></div>
          </div>
        </div>
      )}
    </div>
  ), [darkMode]);

  const NeoInput = useCallback((props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      className={`w-full px-3 py-2 border-2 border-black font-medium focus:outline-none focus:${darkMode ? 'bg-gray-700' : 'bg-neo-blue/20'} focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : ''} ${props.className || ''}`}
    />
  ), [darkMode]);

  const NeoTextArea = useCallback((props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
      {...props}
      className={`w-full px-3 py-2 border-2 border-black font-medium focus:outline-none focus:${darkMode ? 'bg-gray-700' : 'bg-neo-blue/20'} focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : ''} ${props.className || ''}`}
    />
  ), [darkMode]);

  return (
    <div className="space-y-6">
      
      {/* Personal Info Section */}
      <div className="border-2 border-black bg-white shadow-neo">
        <SectionHeader title={t.personalDetails} isOpen={activeSections.includes('personal')} onClick={() => toggleSection('personal')} />
        
        {activeSections.includes('personal') && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 animate-in slide-in-from-top-2 duration-200">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-start">
              <div className="flex-shrink-0">
                {data.personalInfo.profilePicture ? (
                  <img
                    src={data.personalInfo.profilePicture}
                    alt="Profile"
                    className="w-24 h-24 rounded object-cover border-2 border-black shadow-neo-sm"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 border-2 border-dashed border-gray-400 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-xs text-center">No image</span>
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <InputLabel label={t.profilePicture} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          updateField('personalInfo', 'profilePicture', event.target.result as string);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className={`w-full px-3 py-2 border-2 border-black font-medium focus:outline-none focus:${darkMode ? 'bg-gray-700' : 'bg-neo-blue/20'} focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : ''}`}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <InputLabel label={t.fullName} tooltip={t.tipFullName} />
              <NeoInput
                value={data.personalInfo.fullName}
                onChange={(e) => updateField('personalInfo', 'fullName', e.target.value)}
                placeholder={t.phFullname}
              />
            </div>
            <div>
              <InputLabel label={t.email} tooltip={t.tipEmail} />
              <NeoInput
                type="email"
                value={data.personalInfo.email}
                onChange={(e) => updateField('personalInfo', 'email', e.target.value)}
                placeholder={t.phEmail}
              />
            </div>
            <div>
              <InputLabel label={t.phone} tooltip={t.tipPhone} />
              <NeoInput
                value={data.personalInfo.phone}
                onChange={(e) => updateField('personalInfo', 'phone', e.target.value)}
                placeholder={t.phPhone}
              />
            </div>
            <div>
              <InputLabel label={t.location} tooltip={t.tipLocation} />
              <NeoInput
                value={data.personalInfo.location}
                onChange={(e) => updateField('personalInfo', 'location', e.target.value)}
                placeholder={t.phLocation}
              />
            </div>
            <div>
              <InputLabel label={t.website} tooltip={t.tipWebsite} />
              <NeoInput
                value={data.personalInfo.website}
                onChange={(e) => updateField('personalInfo', 'website', e.target.value)}
                placeholder={t.phWebsite}
              />
            </div>
             <div>
              <InputLabel label={t.linkedin} tooltip={t.tipLinkedin} />
              <NeoInput
                value={data.personalInfo.linkedin}
                onChange={(e) => updateField('personalInfo', 'linkedin', e.target.value)}
                placeholder={t.phLinkedin}
              />
            </div>
             <div>
              <InputLabel label={t.twitter} tooltip={t.tipTwitter} />
              <NeoInput
                value={data.personalInfo.twitter}
                onChange={(e) => updateField('personalInfo', 'twitter', e.target.value)}
                placeholder={t.phTwitter}
              />
            </div>
             <div>
              <InputLabel label={t.github} tooltip={t.tipGithub} />
              <NeoInput
                value={data.personalInfo.github}
                onChange={(e) => updateField('personalInfo', 'github', e.target.value)}
                placeholder={t.phGithub}
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="border-2 border-black bg-white shadow-neo">
        <SectionHeader title={t.summary} isOpen={activeSections.includes('summary')} onClick={() => toggleSection('summary')} />
        
        {activeSections.includes('summary') && (
          <div className="p-5 animate-in slide-in-from-top-2 duration-200">
            <div className="flex justify-between items-center mb-3">
               <span className="text-xs font-bold text-gray-500 uppercase">{t.brieflyDescribe}</span>
               <AIButton onClick={handleGenerateSummary} isLoading={loadingAI.summary} label={t.generate} darkMode={darkMode} />
            </div>
            <NeoTextArea
              value={data.summary}
              onChange={(e) => onChange({ ...data, summary: e.target.value })}
              rows={4}
              placeholder={t.phSummary}
            />
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="border-2 border-black bg-white shadow-neo">
        <SectionHeader title={t.experience} isOpen={activeSections.includes('experience')} onClick={() => toggleSection('experience')} />
        
        {activeSections.includes('experience') && (
          <div className="p-5 space-y-6 animate-in slide-in-from-top-2 duration-200">
             {data.experience.map((exp) => (
                <div key={exp.id} className="relative p-4 border-2 border-black bg-neo-white shadow-neo-sm group">
                    <button
                        onClick={() => removeExperience(exp.id)}
                        className={`absolute top-0 right-0 p-2 border-l-2 border-b-2 ${darkMode ? 'border-gray-500 bg-pink-700 hover:bg-pink-600 text-white' : 'border-black bg-neo-pink hover:bg-red-400 text-black'} transition-colors`}
                        title={t.removeExperience}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8 mt-2">
                        <div>
                            <InputLabel label={t.position} />
                            <NeoInput 
                                value={exp.position} 
                                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                placeholder={t.phJobTitle}
                            />
                        </div>
                        <div>
                            <InputLabel label={t.company} />
                            <NeoInput 
                                value={exp.company} 
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                placeholder={t.phCompany}
                            />
                        </div>
                        
                        {/* Start Date */}
                        <div className="flex flex-col justify-end">
                            <InputLabel label={t.startDate} />
                            <NeoInput 
                                type="month"
                                value={exp.startDate} 
                                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            />
                        </div>

                        {/* End Date - Fixed alignment */}
                        <div className="flex flex-col justify-end min-w-0">
                            <InputLabel label={t.endDate} />
                            <NeoInput 
                                type="month"
                                value={exp.endDate} 
                                disabled={exp.current}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                className="disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-400 w-full"
                            />
                        </div>

                        {/* Current Checkbox - New Row */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer select-none w-max">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={exp.current}
                                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className={`${darkMode ? 'bg-gray-800 border-gray-600 peer-checked:bg-gray-600' : 'bg-white border-black peer-checked:bg-neo-green'} w-5 h-5 border-2 transition-colors`}></div>
                                    {exp.current && <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${darkMode ? 'bg-gray-200' : ''}`}>
                                        <div className={`w-2 h-2 ${darkMode ? 'bg-gray-800' : 'bg-black'}`}></div>
                                    </div>}
                                </div>
                                <span className={`text-xs font-bold uppercase whitespace-nowrap ${darkMode ? 'text-gray-200' : ''}`}>{t.current}</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <InputLabel label={t.description} />
                             <AIButton
                                onClick={() => handleEnhanceExp(exp.id, exp.description)}
                                isLoading={loadingAI[`exp-${exp.id}`]}
                                label={t.enhance}
                                minimal
                                darkMode={darkMode}
                            />
                        </div>
                        <NeoTextArea
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            rows={3}
                            placeholder={t.phDescription}
                        />
                    </div>
                </div>
             ))}
             <button
                onClick={addExperience}
                className={`${darkMode ? 'border-gray-500 bg-gray-700 hover:bg-green-600/50 text-white' : 'border-black bg-gray-50 hover:bg-neo-green/50'} w-full py-3 border-2 border-dashed transition-colors flex items-center justify-center gap-2 font-bold uppercase tracking-wide text-sm`}
            >
                <Plus className="w-5 h-5" /> {t.addExperience}
            </button>
          </div>
        )}
      </div>

       {/* Education Section */}
       <div className="border-2 border-black bg-white shadow-neo">
        <SectionHeader title={t.education} isOpen={activeSections.includes('education')} onClick={() => toggleSection('education')} />
        
        {activeSections.includes('education') && (
          <div className="p-5 space-y-6 animate-in slide-in-from-top-2 duration-200">
             {data.education.map((edu) => (
                <div key={edu.id} className="relative p-4 border-2 border-black bg-neo-white shadow-neo-sm">
                     <button
                        onClick={() => removeEducation(edu.id)}
                        className={`absolute top-0 right-0 p-2 border-l-2 border-b-2 ${darkMode ? 'border-gray-500 bg-pink-700 hover:bg-pink-600 text-white' : 'border-black bg-neo-pink hover:bg-red-400 text-black'} transition-colors`}
                        title={t.removeEducation}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8 mt-2">
                         <div>
                            <InputLabel label={t.institution} />
                            <NeoInput 
                                value={edu.institution} 
                                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                placeholder={t.phSchool}
                            />
                        </div>
                        <div>
                            <InputLabel label={t.degree} />
                            <NeoInput 
                                value={edu.degree} 
                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                placeholder={t.phDegree}
                            />
                        </div>
                         <div>
                            <InputLabel label={t.startDate} />
                            <NeoInput 
                                type="month"
                                value={edu.startDate} 
                                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            />
                        </div>
                         <div>
                            <InputLabel label={t.endDate} />
                            <NeoInput 
                                type="month"
                                value={edu.endDate} 
                                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
             ))}
              <button
                onClick={addEducation}
                className={`${darkMode ? 'border-gray-500 bg-gray-700 hover:bg-green-600/50 text-white' : 'border-black bg-gray-50 hover:bg-neo-green/50'} w-full py-3 border-2 border-dashed transition-colors flex items-center justify-center gap-2 font-bold uppercase tracking-wide text-sm`}
            >
                <Plus className="w-5 h-5" /> {t.addEducation}
            </button>
          </div>
        )}
       </div>

      {/* Projects Section */}
      <div className="border-2 border-black bg-white shadow-neo">
        <SectionHeader title={t.projects} isOpen={activeSections.includes('projects')} onClick={() => toggleSection('projects')} />
        
        {activeSections.includes('projects') && (
          <div className="p-5 space-y-6 animate-in slide-in-from-top-2 duration-200">
              {data.projects.map((proj) => (
                <div key={proj.id} className="relative p-4 border-2 border-black bg-neo-white shadow-neo-sm">
                    <button
                        onClick={() => removeProject(proj.id)}
                        className={`absolute top-0 right-0 p-2 border-l-2 border-b-2 ${darkMode ? 'border-gray-500 bg-pink-700 hover:bg-pink-600 text-white' : 'border-black bg-neo-pink hover:bg-red-400 text-black'} transition-colors`}
                        title={t.removeProject}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8 mt-2">
                        <div>
                            <InputLabel label={t.projectName} />
                            <NeoInput 
                                value={proj.name} 
                                onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                                placeholder={t.phProjectName}
                            />
                        </div>
                        <div>
                            <InputLabel label={t.projectLink} />
                            <NeoInput 
                                value={proj.link} 
                                onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>

                         {/* Start Date */}
                         <div className="flex flex-col justify-end">
                            <InputLabel label={t.startDate} />
                            <NeoInput 
                                type="month"
                                value={proj.startDate} 
                                onChange={(e) => updateProject(proj.id, 'startDate', e.target.value)}
                            />
                        </div>

                        {/* End Date - Fixed alignment */}
                        <div className="flex flex-col justify-end min-w-0">
                            <InputLabel label={t.endDate} />
                            <NeoInput 
                                type="month"
                                value={proj.endDate} 
                                disabled={proj.current}
                                onChange={(e) => updateProject(proj.id, 'endDate', e.target.value)}
                                className="disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-400 w-full"
                            />
                        </div>

                        {/* Current Checkbox - New Row */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer select-none w-max">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={proj.current}
                                        onChange={(e) => updateProject(proj.id, 'current', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className={`${darkMode ? 'bg-gray-800 border-gray-600 peer-checked:bg-gray-600' : 'bg-white border-black peer-checked:bg-neo-green'} w-5 h-5 border-2 transition-colors`}></div>
                                    {proj.current && <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${darkMode ? 'bg-gray-200' : ''}`}>
                                        <div className={`w-2 h-2 ${darkMode ? 'bg-gray-800' : 'bg-black'}`}></div>
                                    </div>}
                                </div>
                                <span className={`text-xs font-bold uppercase whitespace-nowrap ${darkMode ? 'text-gray-200' : ''}`}>{t.current}</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <InputLabel label={t.description} />
                              <AIButton
                                onClick={() => handleEnhanceProject(proj.id, proj.description)}
                                isLoading={loadingAI[`proj-${proj.id}`]}
                                label={t.enhance}
                                minimal
                                darkMode={darkMode}
                            />
                        </div>
                        <NeoTextArea
                            value={proj.description}
                            onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                            rows={3}
                            placeholder={t.phDescription}
                        />
                    </div>
                </div>
              ))}
              <button
                onClick={addProject}
                className={`${darkMode ? 'border-gray-500 bg-gray-700 hover:bg-green-600/50 text-white' : 'border-black bg-gray-50 hover:bg-neo-green/50'} w-full py-3 border-2 border-dashed transition-colors flex items-center justify-center gap-2 font-bold uppercase tracking-wide text-sm`}
            >
                <Plus className="w-5 h-5" /> {t.addProject}
            </button>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="border-2 border-black bg-white shadow-neo">
         <SectionHeader title={t.skills} isOpen={activeSections.includes('skills')} onClick={() => toggleSection('skills')} />
        
        {activeSections.includes('skills') && (
            <div className="p-5 animate-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase">{t.separateSkills}</span>
                    <AIButton onClick={handleSuggestSkills} isLoading={loadingAI.skills} label={t.suggest} darkMode={darkMode} />
                </div>
                <NeoTextArea
                    value={data.skills.join(', ')}
                    onChange={(e) => onChange({ ...data, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                    rows={3}
                    placeholder={t.phSkills}
                />
            </div>
        )}
      </div>

    </div>
  );
};

export const Editor = React.memo(EditorComponent);
