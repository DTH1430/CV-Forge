import React from 'react';
import { CVData, Language } from '../types';
import { translations } from '../translations';
import { Mail, Phone, MapPin, Globe, Linkedin, Twitter, Github, ExternalLink } from 'lucide-react';

interface PreviewProps {
  data: CVData;
  language: Language;
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

export const Preview: React.FC<PreviewProps> = ({ data, language }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const t = translations[language];

  // Helper to render contact items
  const ContactItem = ({ icon: Icon, value, link }: { icon: any, value: string, link?: string }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <Icon className="w-4 h-4" />
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {value}
          </a>
        ) : (
          <span>{value}</span>
        )}
      </div>
    );
  };

  return (
    <div id="cv-preview" className="bg-white w-full min-h-[29.7cm] p-[10mm] sm:p-[15mm] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-gray-900 font-sans relative">
      
      {/* Header */}
      <header className="border-b-4 border-black pb-6 mb-6">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-4 font-display break-words">
          {personalInfo.fullName || "YOUR NAME"}
        </h1>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-700">
          <ContactItem icon={Mail} value={personalInfo.email} link={`mailto:${personalInfo.email}`} />
          <ContactItem icon={Phone} value={personalInfo.phone} />
          <ContactItem icon={MapPin} value={personalInfo.location} />
          <ContactItem icon={Globe} value={personalInfo.website} link={personalInfo.website} />
          <ContactItem icon={Linkedin} value={personalInfo.linkedin} link={personalInfo.linkedin} />
          <ContactItem icon={Twitter} value={personalInfo.twitter} link={personalInfo.twitter} />
          <ContactItem icon={Github} value={personalInfo.github} link={personalInfo.github} />
        </div>
      </header>

      <div className="space-y-6">
        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-xl font-black uppercase border-b-2 border-black mb-3 pb-1 tracking-wide font-display break-avoid">
              {t.summary}
            </h2>
            <p className="text-sm leading-relaxed text-justify whitespace-pre-line">
              {summary}
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
                    <h3 className="text-lg font-bold uppercase">{exp.position}</h3>
                    <span className="text-sm font-bold bg-black text-white px-2 py-0.5 whitespace-nowrap">
                      {formatDate(exp.startDate, language)} – {exp.current ? t.present.toUpperCase() : formatDate(exp.endDate, language)}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-gray-600 mb-2 italic">
                    {exp.company}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line text-gray-800">
                    {exp.description}
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
                        <h3 className="text-lg font-bold uppercase">{proj.name}</h3>
                        {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black">
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                    {(proj.startDate || proj.current) && (
                        <span className="text-sm font-bold bg-black text-white px-2 py-0.5 whitespace-nowrap">
                        {formatDate(proj.startDate, language)} – {proj.current ? t.present.toUpperCase() : formatDate(proj.endDate, language)}
                        </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line text-gray-800">
                    {proj.description}
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
                    <h3 className="text-lg font-bold uppercase">{edu.institution}</h3>
                    <span className="text-sm font-bold bg-black text-white px-2 py-0.5 whitespace-nowrap">
                      {formatDate(edu.startDate, language)} – {edu.current ? t.present.toUpperCase() : formatDate(edu.endDate, language)}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-gray-600">
                    {edu.degree}
                  </div>
                   {edu.description && (
                      <p className="text-sm leading-relaxed whitespace-pre-line text-gray-800 mt-1">
                        {edu.description}
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
                <span key={index} className="text-sm font-bold border-2 border-black px-2 py-1 bg-gray-100 uppercase">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};