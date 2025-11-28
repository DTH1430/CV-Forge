import React, { useState } from 'react';
import { CVData, Language } from '../types';
import { translations } from '../translations';
import { Mail, Phone, MapPin, Globe, Linkedin, Twitter, Github, ExternalLink, Award, Users, Code, Palette, Camera, Music } from 'lucide-react';

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

    // Format: MMM YYYY (e.g., Jan 2023)
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  // Fallback for existing legacy data
  return dateString;
};

export const CreativeTemplate: React.FC<PreviewProps> = ({ data, language, onChange }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const t = translations[language];
  const [editingField, setEditingField] = useState<{section: string, id?: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState('');

  // Helper to render contact items
  const ContactItem = ({ icon: Icon, value, link, section, field }: { icon: any, value: string, link?: string, section: string, field: string }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-2 text-sm">
        <Icon className="w-4 h-4" />
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-gray-800"
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
    <div id="cv-preview" className="bg-gradient-to-br from-indigo-50 to-purple-50 w-full min-h-[29.7cm] p-8 text-gray-900 font-sans relative">
      {/* Header */}
      <header className="border-b-4 border-purple-500 pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          {/* Profile Picture */}
          {personalInfo.profilePicture && (
            <div className="flex-shrink-0 flex justify-center">
              <div className="relative">
                <img
                  src={personalInfo.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-2 shadow-lg">
                  <Palette className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          )}

          <div className="flex-grow text-center md:text-left">
            <h1
              className="text-4xl md:text-5xl font-black mb-2 font-display cursor-text"
              onClick={() => startEditing('personalInfo', 'fullName', personalInfo.fullName)}
            >
              {renderEditableText(personalInfo.fullName, 'personalInfo', 'fullName') || "YOUR NAME"}
            </h1>

            <div
              className="text-xl md:text-2xl text-purple-600 font-bold mb-4 cursor-text"
              onClick={() => startEditing('personalInfo', 'jobTitle', personalInfo.jobTitle)}
            >
              {renderEditableText(personalInfo.jobTitle || "CREATIVE PROFESSIONAL", 'personalInfo', 'jobTitle') || "CREATIVE PROFESSIONAL"}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto md:mx-0">
              <div className="space-y-2">
                <ContactItem icon={Mail} value={personalInfo.email} link={`mailto:${personalInfo.email}`} section="personalInfo" field="email" />
                <ContactItem icon={Phone} value={personalInfo.phone} section="personalInfo" field="phone" />
                <ContactItem icon={MapPin} value={personalInfo.location} section="personalInfo" field="location" />
              </div>
              <div className="space-y-2">
                <ContactItem icon={Globe} value={personalInfo.website} link={personalInfo.website} section="personalInfo" field="website" />
                <ContactItem icon={Linkedin} value={personalInfo.linkedin} link={personalInfo.linkedin} section="personalInfo" field="linkedin" />
                <ContactItem icon={Github} value={personalInfo.github} link={personalInfo.github} section="personalInfo" field="github" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Skills and Education */}
        <div className="lg:col-span-1 space-y-8">
          {/* Skills */}
          {skills.length > 0 && (
            <section className="bg-white p-6 rounded-xl shadow-md border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold uppercase tracking-wide text-purple-700">
                  {t.skills}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm rounded-full shadow-sm cursor-text"
                    onClick={() => startEditing('skills', 'skills', skills.join(', '))}
                  >
                    {renderEditableText(skills.join(', '), 'skills', 'skills').split(', ')[index]}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="bg-white p-6 rounded-xl shadow-md border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold uppercase tracking-wide text-purple-700">
                  {t.education}
                </h2>
              </div>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-4 border-purple-300 pl-4">
                    <div
                      className="font-bold text-gray-900 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                      onClick={() => startEditingWithId('education', edu.id, 'degree', edu.degree)}
                    >
                      {renderEditableTextWithId(edu.degree, 'education', edu.id, 'degree')}
                    </div>
                    <div
                      className="text-sm font-semibold text-purple-700 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                      onClick={() => startEditingWithId('education', edu.id, 'institution', edu.institution)}
                    >
                      {renderEditableTextWithId(edu.institution, 'education', edu.id, 'institution')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {edu.startDate && renderEditableTextWithId(formatDate(edu.startDate, language), 'education', edu.id, 'startDate')} – {edu.current ? t.present : edu.endDate && renderEditableTextWithId(formatDate(edu.endDate, language), 'education', edu.id, 'endDate')}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Summary, Experience, Projects */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary */}
          {summary && (
            <section className="bg-white p-6 rounded-xl shadow-md border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold uppercase tracking-wide text-purple-700">
                  {t.summary}
                </h2>
              </div>
              <p
                className="text-justify whitespace-pre-line cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                onClick={() => startEditing('summary', 'summary', summary)}
              >
                {renderEditableTextArea(summary, 'summary', 'summary')}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="bg-white p-6 rounded-xl shadow-md border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold uppercase tracking-wide text-purple-700">
                  {t.experience}
                </h2>
              </div>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="border-l-4 border-purple-300 pl-4 py-1">
                    <div className="flex justify-between items-baseline">
                      <div
                        className="font-bold text-gray-900 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                        onClick={() => startEditingWithId('experience', exp.id, 'position', exp.position)}
                      >
                        {renderEditableTextWithId(exp.position, 'experience', exp.id, 'position')}
                      </div>
                      <span className="text-sm text-gray-600">
                        {exp.startDate && renderEditableTextWithId(formatDate(exp.startDate, language), 'experience', exp.id, 'startDate')} – {exp.current ? t.present : exp.endDate && renderEditableTextWithId(formatDate(exp.endDate, language), 'experience', exp.id, 'endDate')}
                      </span>
                    </div>
                    <div
                      className="text-sm font-semibold text-purple-700 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                      onClick={() => startEditingWithId('experience', exp.id, 'company', exp.company)}
                    >
                      {renderEditableTextWithId(exp.company, 'experience', exp.id, 'company')}
                    </div>
                    <p
                      className="text-sm mt-1 whitespace-pre-line cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
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
            <section className="bg-white p-6 rounded-xl shadow-md border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold uppercase tracking-wide text-purple-700">
                  {t.projects}
                </h2>
              </div>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="border-l-4 border-purple-300 pl-4 py-1">
                    <div className="flex justify-between items-baseline">
                      <div className="flex items-center gap-2">
                        <div
                          className="font-bold text-gray-900 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                          onClick={() => startEditingWithId('projects', proj.id, 'name', proj.name)}
                        >
                          {renderEditableTextWithId(proj.name, 'projects', proj.id, 'name')}
                        </div>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {(proj.startDate || proj.current) && (
                        <span className="text-sm text-gray-600">
                          {proj.startDate && renderEditableTextWithId(formatDate(proj.startDate, language), 'projects', proj.id, 'startDate')} – {proj.current ? t.present : proj.endDate && renderEditableTextWithId(formatDate(proj.endDate, language), 'projects', proj.id, 'endDate')}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-sm mt-1 whitespace-pre-line cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                      onClick={() => startEditingWithId('projects', proj.id, 'description', proj.description)}
                    >
                      {renderEditableTextAreaWithId(proj.description, 'projects', proj.id, 'description')}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-purple-200 text-center text-sm text-gray-600">
        <p className="text-purple-700 font-bold">{language === 'en' ? 'Creative Portfolio' : 'Hồ sơ sáng tạo'} - {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};