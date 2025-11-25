import React, { useState } from 'react';
import { CVData, Language } from '../types';
import { translations } from '../translations';
import { Mail, Phone, MapPin, Globe, Linkedin, Twitter, Github, ExternalLink } from 'lucide-react';

interface PreviewProps {
  data: CVData;
  language: Language;
  onChange: (data: CVData) => void;
}

const formatDate = (dateString: string, language: Language): string => {
  if (!dateString) return "";
  
  // Handle ISO YYYY-MM format from type="month" input
  if (/^\d{4}-\d{2}$/.test(dateString)) {
    const [year, month] = dateString.split('-').map(Number);
    // Create date for the first of the month
    const date = new Date(year, month - 1);
    
    // Format: MMM YYYY (e.g., JAN 2023)
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      month: 'short',
      year: 'numeric'
    }).format(date).toUpperCase().replace('.', ''); // Remove trailing dots if any
  }
  
  // Fallback for existing legacy data
  return dateString.toUpperCase();
};

export const Preview: React.FC<PreviewProps> = ({ data, language, onChange }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const t = translations[language];
  const [editingField, setEditingField] = useState<{section: string, id?: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState('');

  // Helper to render contact items
  const ContactItem = ({ icon: Icon, value, link, section, field }: { icon: any, value: string, link?: string, section: string, field: string }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <Icon className="w-4 h-4" />
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            onClick={(e) => {
              if (editingField) e.preventDefault(); // Prevent navigation if editing
            }}
          >
            {value}
          </a>
        ) : (
          <span
            className="cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
            onClick={() => {
              setEditingField({ section, field });
              setEditValue(value);
            }}
          >
            {value}
          </span>
        )}
      </div>
    );
  };

  const startEditing = (section: string, field: string, value: string) => {
    setEditingField({ section, field });
    setEditValue(value);
  };

  const startEditingWithId = (section: string, id: string, field: string, value: string) => {
    setEditingField({ section, id, field });
    setEditValue(value);
  };

  const saveEdit = () => {
    if (!editingField) return;

    const { section, id, field } = editingField;

    if (id) {
      // Handle sections with IDs (experience, education, projects)
      if (section === 'experience') {
        const updated = experience.map(item =>
          item.id === id ? { ...item, [field]: editValue } : item
        );
        onChange({ ...data, experience: updated });
      } else if (section === 'education') {
        const updated = education.map(item =>
          item.id === id ? { ...item, [field]: editValue } : item
        );
        onChange({ ...data, education: updated });
      } else if (section === 'projects') {
        const updated = projects.map(item =>
          item.id === id ? { ...item, [field]: editValue } : item
        );
        onChange({ ...data, projects: updated });
      }
    } else {
      // Handle sections without IDs (personalInfo, summary)
      if (section === 'personalInfo') {
        onChange({ ...data, personalInfo: { ...personalInfo, [field]: editValue } });
      } else if (section === 'summary') {
        onChange({ ...data, summary: editValue });
      } else if (section === 'skills') {
        onChange({ ...data, skills: editValue.split(',').map(s => s.trim()).filter(s => s) });
      }
    }

    setEditingField(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingField(null);
      setEditValue('');
    }
  };

  const renderEditableText = (text: string, section: string, field: string) => {
    if (editingField?.section === section && editingField?.field === field) {
      return (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full px-1 py-0 border-2 border-blue-500 focus:outline-none bg-white"
        />
      );
    }
    return (
      <span
        className="cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
        onClick={() => startEditing(section, field, text)}
      >
        {text}
      </span>
    );
  };

  const renderEditableTextWithId = (text: string, section: string, id: string, field: string) => {
    if (editingField?.section === section && editingField?.id === id && editingField?.field === field) {
      return (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full px-1 py-0 border-2 border-blue-500 focus:outline-none bg-white"
        />
      );
    }
    return (
      <span
        className="cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
        onClick={() => startEditingWithId(section, id, field, text)}
      >
        {text}
      </span>
    );
  };

  const renderEditableTextArea = (text: string, section: string, field: string) => {
    if (editingField?.section === section && editingField?.field === field) {
      return (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full px-1 py-0 border-2 border-blue-500 focus:outline-none bg-white resize-none"
        />
      );
    }
    return (
      <span
        className="cursor-text border-b border-dashed border-gray-400 hover:border-gray-600 whitespace-pre-line"
        onClick={() => startEditing(section, field, text)}
      >
        {text}
      </span>
    );
  };

  const renderEditableTextAreaWithId = (text: string, section: string, id: string, field: string) => {
    if (editingField?.section === section && editingField?.id === id && editingField?.field === field) {
      return (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full px-1 py-0 border-2 border-blue-500 focus:outline-none bg-white resize-none"
        />
      );
    }
    return (
      <span
        className="cursor-text border-b border-dashed border-gray-400 hover:border-gray-600 whitespace-pre-line"
        onClick={() => startEditingWithId(section, id, field, text)}
      >
        {text}
      </span>
    );
  };

  return (
    <div id="cv-preview" className="bg-white w-full min-h-[29.7cm] p-[10mm] sm:p-[15mm] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-gray-900 font-sans relative">
      
      {/* Header */}
      <header className="border-b-4 border-black pb-6 mb-6">
        <h1
          className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-4 font-display break-words cursor-text"
          onClick={() => startEditing('personalInfo', 'fullName', personalInfo.fullName)}
        >
          {renderEditableText(personalInfo.fullName, 'personalInfo', 'fullName') || "YOUR NAME"}
        </h1>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-700">
          <ContactItem icon={Mail} value={personalInfo.email} link={`mailto:${personalInfo.email}`} section="personalInfo" field="email" />
          <ContactItem icon={Phone} value={personalInfo.phone} section="personalInfo" field="phone" />
          <ContactItem icon={MapPin} value={personalInfo.location} section="personalInfo" field="location" />
          <ContactItem icon={Globe} value={personalInfo.website} link={personalInfo.website} section="personalInfo" field="website" />
          <ContactItem icon={Linkedin} value={personalInfo.linkedin} link={personalInfo.linkedin} section="personalInfo" field="linkedin" />
          <ContactItem icon={Twitter} value={personalInfo.twitter} link={personalInfo.twitter} section="personalInfo" field="twitter" />
          <ContactItem icon={Github} value={personalInfo.github} link={personalInfo.github} section="personalInfo" field="github" />
        </div>
      </header>

      <div className="space-y-6">
        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-xl font-black uppercase border-b-2 border-black mb-3 pb-1 tracking-wide font-display break-avoid">
              {t.summary}
            </h2>
            <p
              className="text-sm leading-relaxed text-justify whitespace-pre-line cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
              onClick={() => startEditing('summary', 'summary', summary)}
            >
              {renderEditableTextArea(summary, 'summary', 'summary')}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-xl font-black uppercase border-b-2 border-black mb-4 pb-1 tracking-wide font-display break-avoid">
              {t.experience}
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="break-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-2 mb-1">
                    <h3
                      className="text-lg font-bold uppercase cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                      onClick={() => startEditingWithId('experience', exp.id, 'position', exp.position)}
                    >
                      {renderEditableTextWithId(exp.position, 'experience', exp.id, 'position')}
                    </h3>
                    <span className="text-sm font-bold bg-black text-white px-2 py-0.5 whitespace-nowrap">
                      {exp.startDate && renderEditableTextWithId(formatDate(exp.startDate, language), 'experience', exp.id, 'startDate')} – {exp.current ? t.present.toUpperCase() : exp.endDate && renderEditableTextWithId(formatDate(exp.endDate, language), 'experience', exp.id, 'endDate')}
                    </span>
                  </div>
                  <div
                    className="text-sm font-bold text-gray-600 mb-2 italic cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                    onClick={() => startEditingWithId('experience', exp.id, 'company', exp.company)}
                  >
                    {renderEditableTextWithId(exp.company, 'experience', exp.id, 'company')}
                  </div>
                  <p
                    className="text-sm leading-relaxed whitespace-pre-line text-gray-800 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                    onClick={() => startEditingWithId('experience', exp.id, 'description', exp.description)}
                  >
                    {renderEditableTextAreaWithId(exp.description, 'experience', exp.id, 'description')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
             <h2 className="text-xl font-black uppercase border-b-2 border-black mb-4 pb-1 tracking-wide font-display break-avoid">
              {t.projects}
            </h2>
             <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="break-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-2 mb-1">
                    <div className="flex items-center gap-2">
                        <h3
                          className="text-lg font-bold uppercase cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                          onClick={() => startEditingWithId('projects', proj.id, 'name', proj.name)}
                        >
                          {renderEditableTextWithId(proj.name, 'projects', proj.id, 'name')}
                        </h3>
                        {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black">
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                    {(proj.startDate || proj.current) && (
                        <span className="text-sm font-bold bg-black text-white px-2 py-0.5 whitespace-nowrap">
                        {proj.startDate && renderEditableTextWithId(formatDate(proj.startDate, language), 'projects', proj.id, 'startDate')} – {proj.current ? t.present.toUpperCase() : proj.endDate && renderEditableTextWithId(formatDate(proj.endDate, language), 'projects', proj.id, 'endDate')}
                        </span>
                    )}
                  </div>
                  <p
                    className="text-sm leading-relaxed whitespace-pre-line text-gray-800 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                    onClick={() => startEditingWithId('projects', proj.id, 'description', proj.description)}
                  >
                    {renderEditableTextAreaWithId(proj.description, 'projects', proj.id, 'description')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xl font-black uppercase border-b-2 border-black mb-4 pb-1 tracking-wide font-display break-avoid">
              {t.education}
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="break-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-2 mb-1">
                    <h3
                      className="text-lg font-bold uppercase cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                      onClick={() => startEditingWithId('education', edu.id, 'institution', edu.institution)}
                    >
                      {renderEditableTextWithId(edu.institution, 'education', edu.id, 'institution')}
                    </h3>
                    <span className="text-sm font-bold bg-black text-white px-2 py-0.5 whitespace-nowrap">
                      {edu.startDate && renderEditableTextWithId(formatDate(edu.startDate, language), 'education', edu.id, 'startDate')} – {edu.current ? t.present.toUpperCase() : edu.endDate && renderEditableTextWithId(formatDate(edu.endDate, language), 'education', edu.id, 'endDate')}
                    </span>
                  </div>
                  <div
                    className="text-sm font-bold text-gray-600 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                    onClick={() => startEditingWithId('education', edu.id, 'degree', edu.degree)}
                  >
                    {renderEditableTextWithId(edu.degree, 'education', edu.id, 'degree')}
                  </div>
                   {edu.description && (
                      <p
                        className="text-sm leading-relaxed whitespace-pre-line text-gray-800 mt-1 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                        onClick={() => startEditingWithId('education', edu.id, 'description', edu.description)}
                      >
                        {renderEditableTextAreaWithId(edu.description, 'education', edu.id, 'description')}
                      </p>
                    )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-xl font-black uppercase border-b-2 border-black mb-3 pb-1 tracking-wide font-display break-avoid">
              {t.skills}
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-sm font-bold border-2 border-black px-2 py-1 bg-gray-100 uppercase cursor-text"
                  onClick={() => startEditing('skills', 'skills', skills.join(', '))}
                >
                  {renderEditableText(skills.join(', '), 'skills', 'skills').split(', ')[index]}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};