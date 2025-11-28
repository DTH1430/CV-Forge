import React, { useState } from 'react';
import { CVData, Language } from '../types';
import { translations } from '../translations';
import { Mail, Phone, MapPin, Globe, Linkedin, Twitter, Github, ExternalLink, Award, Users, Code, Building, DollarSign, Calendar } from 'lucide-react';

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

export const CorporateTemplate: React.FC<PreviewProps> = ({ data, language, onChange }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const t = translations[language];
  const [editingField, setEditingField] = useState<{section: string, id?: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState('');

  // Helper to render contact items
  const ContactItem = ({ icon: Icon, value, link, section, field }: { icon: any, value: string, link?: string, section: string, field: string }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-2 text-sm">
        <Icon className="w-4 h-4 text-gray-700" />
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
    <div id="cv-preview" className="bg-white w-full min-h-[29.7cm] p-8 text-gray-900 font-sans relative">
      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-col items-center text-center border-b-2 border-gray-800 pb-6">
          {/* Profile Picture */}
          {personalInfo.profilePicture && (
            <div className="mb-4">
              <img
                src={personalInfo.profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded object-cover border-4 border-gray-300 shadow-md"
              />
            </div>
          )}

          <h1
            className="text-4xl font-bold mb-2 font-serif cursor-text"
            onClick={() => startEditing('personalInfo', 'fullName', personalInfo.fullName)}
          >
            {renderEditableText(personalInfo.fullName, 'personalInfo', 'fullName') || "YOUR NAME"}
          </h1>

          <div
            className="text-xl text-gray-700 font-semibold mb-4 cursor-text"
            onClick={() => startEditing('personalInfo', 'jobTitle', personalInfo.jobTitle)}
          >
            {renderEditableText(personalInfo.jobTitle || "CORPORATE TITLE", 'personalInfo', 'jobTitle') || "CORPORATE TITLE"}
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-700">
            <ContactItem icon={Mail} value={personalInfo.email} link={`mailto:${personalInfo.email}`} section="personalInfo" field="email" />
            <ContactItem icon={Phone} value={personalInfo.phone} section="personalInfo" field="phone" />
            <ContactItem icon={MapPin} value={personalInfo.location} section="personalInfo" field="location" />
            <ContactItem icon={Globe} value={personalInfo.website} link={personalInfo.website} section="personalInfo" field="website" />
            <ContactItem icon={Linkedin} value={personalInfo.linkedin} link={personalInfo.linkedin} section="personalInfo" field="linkedin" />
          </div>
        </div>
      </header>

      <div className="space-y-10">
        {/* Summary */}
        {summary && (
          <section>
            <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-800">
              <div className="w-3 h-3 bg-gray-800"></div>
              <h2 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-800">
                {t.summary}
              </h2>
            </div>
            <div className="prose max-w-none">
              <p
                className="text-justify leading-relaxed whitespace-pre-line cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                onClick={() => startEditing('summary', 'summary', summary)}
              >
                {renderEditableTextArea(summary, 'summary', 'summary')}
              </p>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column - Experience */}
          <div className="space-y-8">
            {/* Experience */}
            {experience.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-800">
                  <Users className="w-5 h-5 text-gray-800" />
                  <h2 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-800">
                    {t.experience}
                  </h2>
                </div>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id} className="relative pl-6 border-l-4 border-gray-300">
                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gray-800"></div>
                      
                      <div className="flex justify-between items-baseline">
                        <div
                          className="font-bold text-lg text-gray-900 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                          onClick={() => startEditingWithId('experience', exp.id, 'position', exp.position)}
                        >
                          {renderEditableTextWithId(exp.position, 'experience', exp.id, 'position')}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1">
                          {exp.startDate && renderEditableTextWithId(formatDate(exp.startDate, language), 'experience', exp.id, 'startDate')} – {exp.current ? t.present : exp.endDate && renderEditableTextWithId(formatDate(exp.endDate, language), 'experience', exp.id, 'endDate')}
                        </span>
                      </div>
                      <div
                        className="text-sm font-bold text-gray-700 mb-2 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                        onClick={() => startEditingWithId('experience', exp.id, 'company', exp.company)}
                      >
                        {renderEditableTextWithId(exp.company, 'experience', exp.id, 'company')}
                      </div>
                      <p
                        className="text-sm text-gray-700 whitespace-pre-line cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
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
                <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-800">
                  <Award className="w-5 h-5 text-gray-800" />
                  <h2 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-800">
                    {t.projects}
                  </h2>
                </div>
                <div className="space-y-6">
                  {projects.map((proj) => (
                    <div key={proj.id} className="relative pl-6 border-l-4 border-gray-300">
                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gray-800"></div>
                      
                      <div className="flex justify-between items-baseline">
                        <div className="flex items-center gap-2">
                          <div
                            className="font-bold text-gray-900 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                            onClick={() => startEditingWithId('projects', proj.id, 'name', proj.name)}
                          >
                            {renderEditableTextWithId(proj.name, 'projects', proj.id, 'name')}
                          </div>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        {(proj.startDate || proj.current) && (
                          <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1">
                            {proj.startDate && renderEditableTextWithId(formatDate(proj.startDate, language), 'projects', proj.id, 'startDate')} – {proj.current ? t.present : proj.endDate && renderEditableTextWithId(formatDate(proj.endDate, language), 'projects', proj.id, 'endDate')}
                          </span>
                        )}
                      </div>
                      <p
                        className="text-sm text-gray-700 mt-1 whitespace-pre-line cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
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

          {/* Right Column - Education and Skills */}
          <div className="space-y-8">
            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-800">
                  <Code className="w-5 h-5 text-gray-800" />
                  <h2 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-800">
                    {t.skills}
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 bg-gray-100 text-gray-800 font-medium rounded cursor-text"
                      onClick={() => startEditing('skills', 'skills', skills.join(', '))}
                    >
                      {renderEditableText(skills.join(', '), 'skills', 'skills').split(', ')[index]}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-800">
                  <Building className="w-5 h-5 text-gray-800" />
                  <h2 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-800">
                    {t.education}
                  </h2>
                </div>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id} className="relative pl-6 border-l-4 border-gray-300">
                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gray-800"></div>
                      
                      <div
                        className="font-bold text-gray-900 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                        onClick={() => startEditingWithId('education', edu.id, 'degree', edu.degree)}
                      >
                        {renderEditableTextWithId(edu.degree, 'education', edu.id, 'degree')}
                      </div>
                      <div
                        className="text-sm font-bold text-gray-700 mb-1 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
                        onClick={() => startEditingWithId('education', edu.id, 'institution', edu.institution)}
                      >
                        {renderEditableTextWithId(edu.institution, 'education', edu.id, 'institution')}
                      </div>
                      <div className="text-xs text-gray-600">
                        {edu.startDate && renderEditableTextWithId(formatDate(edu.startDate, language), 'education', edu.id, 'startDate')} – {edu.current ? t.present : edu.endDate && renderEditableTextWithId(formatDate(edu.endDate, language), 'education', edu.id, 'endDate')}
                      </div>
                      {edu.description && (
                        <p
                          className="text-sm text-gray-700 mt-1 cursor-text border-b border-dashed border-gray-400 hover:border-gray-600"
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

            {/* Achievements */}
            <section>
              <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-800">
                <Award className="w-5 h-5 text-gray-800" />
                <h2 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-800">
                  {language === 'en' ? 'Achievements' : 'Thành tựu'}
                </h2>
              </div>
              <div className="text-sm text-gray-700">
                <p>{language === 'en' ? 'Add key professional achievements, certifications, or awards.' : 'Thêm các thành tựu chuyên môn chính, bằng cấp hoặc giải thưởng.'}</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-6 border-t border-gray-300 text-center text-sm text-gray-600">
        <p>{new Date().getFullYear()} {language === 'en' ? 'Corporate CV' : 'Hồ sơ doanh nghiệp'}</p>
      </div>
    </div>
  );
};