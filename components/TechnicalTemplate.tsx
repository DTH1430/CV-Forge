import React, { useState } from 'react';
import { CVData, Language } from '../types';
import { translations } from '../translations';
import { Mail, Phone, MapPin, Globe, Linkedin, Twitter, Github, ExternalLink, Code, Server, Database, GitBranch, Wrench, Calendar, Users } from 'lucide-react';

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

    // Format: YYYY-MM (e.g., 2023-01)
    return `${year}-${String(month).padStart(2, '0')}`;
  }

  // Fallback for existing legacy data
  return dateString;
};

export const TechnicalTemplate: React.FC<PreviewProps> = ({ data, language, onChange }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const t = translations[language];
  const [editingField, setEditingField] = useState<{section: string, id?: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState('');

  // Helper to render contact items
  const ContactItem = ({ icon: Icon, value, link, section, field }: { icon: any, value: string, link?: string, section: string, field: string }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-2 text-sm">
        <Icon className="w-4 h-4 text-blue-600" />
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-blue-700"
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
    <div id="cv-preview" className="bg-gray-50 w-full min-h-[29.7cm] p-6 text-gray-900 font-mono font-medium relative">
      {/* Header */}
      <header className="mb-8 border-b-2 border-gray-800 pb-6">
        <div className="flex flex-col items-center text-center">
          {/* Profile Picture */}
          {personalInfo.profilePicture && (
            <div className="mb-4">
              <img
                src={personalInfo.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded object-cover border-2 border-gray-700"
              />
            </div>
          )}

          <h1
            className="text-3xl font-black mb-2 tracking-wide cursor-text"
            onClick={() => startEditing('personalInfo', 'fullName', personalInfo.fullName)}
          >
            {renderEditableText(personalInfo.fullName, 'personalInfo', 'fullName') || "YOUR NAME"}
          </h1>

          <div
            className="text-lg text-gray-700 font-bold mb-4 cursor-text"
            onClick={() => startEditing('personalInfo', 'jobTitle', personalInfo.jobTitle)}
          >
            {renderEditableText(personalInfo.jobTitle || "SOFTWARE ENGINEER", 'personalInfo', 'jobTitle') || "SOFTWARE ENGINEER"}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center max-w-4xl">
            <ContactItem icon={Mail} value={personalInfo.email} link={`mailto:${personalInfo.email}`} section="personalInfo" field="email" />
            <ContactItem icon={Phone} value={personalInfo.phone} section="personalInfo" field="phone" />
            <ContactItem icon={MapPin} value={personalInfo.location} section="personalInfo" field="location" />
            <ContactItem icon={Globe} value={personalInfo.website} link={personalInfo.website} section="personalInfo" field="website" />
          </div>

          <div className="flex justify-center gap-6 mt-2">
            <ContactItem icon={Linkedin} value={personalInfo.linkedin} link={personalInfo.linkedin} section="personalInfo" field="linkedin" />
            <ContactItem icon={Github} value={personalInfo.github} link={personalInfo.github} section="personalInfo" field="github" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Summary, Skills */}
        <div className="lg:col-span-1 space-y-8">
          {/* Summary */}
          {summary && (
            <section className="bg-white p-5 border border-gray-300 shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-300">
                <Code className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800">
                  {t.summary}
                </h2>
              </div>
              <p
                className="text-sm leading-relaxed whitespace-pre-line cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                onClick={() => startEditing('summary', 'summary', summary)}
              >
                {renderEditableTextArea(summary, 'summary', 'summary')}
              </p>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="bg-white p-5 border border-gray-300 shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-300">
                <Wrench className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800">
                  {t.skills}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 text-gray-800 text-sm rounded cursor-text font-mono"
                    onClick={() => startEditing('skills', 'skills', skills.join(', '))}
                  >
                    {renderEditableText(skills.join(', '), 'skills', 'skills').split(', ')[index]}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Experience, Projects, Education */}
        <div className="lg:col-span-2 space-y-8">
          {/* Experience */}
          {experience.length > 0 && (
            <section className="bg-white p-5 border border-gray-300 shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-300">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800">
                  {t.experience}
                </h2>
              </div>
              <div className="space-y-5">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-5 border-l-2 border-blue-500">
                    <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-blue-600"></div>
                    
                    <div className="flex justify-between items-baseline mb-1">
                      <div
                        className="font-bold text-gray-900 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                        onClick={() => startEditingWithId('experience', exp.id, 'position', exp.position)}
                      >
                        {renderEditableTextWithId(exp.position, 'experience', exp.id, 'position')}
                      </div>
                      <span className="text-sm font-mono text-gray-600">
                        {exp.startDate && renderEditableTextWithId(formatDate(exp.startDate, language), 'experience', exp.id, 'startDate')} – {exp.current ? t.present : exp.endDate && renderEditableTextWithId(formatDate(exp.endDate, language), 'experience', exp.id, 'endDate')}
                      </span>
                    </div>
                    
                    <div
                      className="text-sm font-semibold text-blue-700 mb-2 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                      onClick={() => startEditingWithId('experience', exp.id, 'company', exp.company)}
                    >
                      {renderEditableTextWithId(exp.company, 'experience', exp.id, 'company')}
                    </div>
                    
                    <div
                      className="text-sm text-gray-700 whitespace-pre-line cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                      onClick={() => startEditingWithId('experience', exp.id, 'description', exp.description)}
                    >
                      {renderEditableTextAreaWithId(exp.description, 'experience', exp.id, 'description')}
                    </div>
                    
                    {exp.skills && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {exp.skills.split(',').map((skill, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="bg-white p-5 border border-gray-300 shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-300">
                <GitBranch className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800">
                  {t.projects}
                </h2>
              </div>
              <div className="space-y-5">
                {projects.map((proj) => (
                  <div key={proj.id} className="relative pl-5 border-l-2 border-purple-500">
                    <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-purple-600"></div>
                    
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="font-bold text-gray-900 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                          onClick={() => startEditingWithId('projects', proj.id, 'name', proj.name)}
                        >
                          {renderEditableTextWithId(proj.name, 'projects', proj.id, 'name')}
                        </div>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {(proj.startDate || proj.current) && (
                        <span className="text-sm font-mono text-gray-600">
                          {proj.startDate && renderEditableTextWithId(formatDate(proj.startDate, language), 'projects', proj.id, 'startDate')} – {proj.current ? t.present : proj.endDate && renderEditableTextWithId(formatDate(proj.endDate, language), 'projects', proj.id, 'endDate')}
                        </span>
                      )}
                    </div>
                    
                    <div
                      className="text-sm text-gray-700 whitespace-pre-line cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                      onClick={() => startEditingWithId('projects', proj.id, 'description', proj.description)}
                    >
                      {renderEditableTextAreaWithId(proj.description, 'projects', proj.id, 'description')}
                    </div>
                    
                    {proj.technologies && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {proj.technologies.split(',').map((tech, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="bg-white p-5 border border-gray-300 shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-300">
                <Server className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800">
                  {t.education}
                </h2>
              </div>
              <div className="space-y-5">
                {education.map((edu) => (
                  <div key={edu.id} className="relative pl-5 border-l-2 border-green-500">
                    <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-green-600"></div>
                    
                    <div className="flex justify-between items-baseline mb-1">
                      <div
                        className="font-bold text-gray-900 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                        onClick={() => startEditingWithId('education', edu.id, 'degree', edu.degree)}
                      >
                        {renderEditableTextWithId(edu.degree, 'education', edu.id, 'degree')}
                      </div>
                      <span className="text-sm font-mono text-gray-600">
                        {edu.startDate && renderEditableTextWithId(formatDate(edu.startDate, language), 'education', edu.id, 'startDate')} – {edu.current ? t.present : edu.endDate && renderEditableTextWithId(formatDate(edu.endDate, language), 'education', edu.id, 'endDate')}
                      </span>
                    </div>
                    
                    <div
                      className="text-sm font-semibold text-green-700 mb-1 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                      onClick={() => startEditingWithId('education', edu.id, 'institution', edu.institution)}
                    >
                      {renderEditableTextWithId(edu.institution, 'education', edu.id, 'institution')}
                    </div>
                    
                    {edu.description && (
                      <div
                        className="text-sm text-gray-700 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                        onClick={() => startEditingWithId('education', edu.id, 'description', edu.description)}
                      >
                        {renderEditableTextAreaWithId(edu.description, 'education', edu.id, 'description')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-4 border-t border-gray-300 text-center text-xs text-gray-600">
        <p className="font-mono">{new Date().getFullYear()} {language === 'en' ? 'Technical Resume' : 'Hồ sơ kỹ thuật'}</p>
      </div>
    </div>
  );
};