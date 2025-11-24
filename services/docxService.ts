
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType,
  TabStopType,
  TabStopPosition,
  ExternalHyperlink,
  BorderStyle
} from "docx";
import FileSaver from "file-saver";
import { CVData, Language } from "../types";
import { translations } from "../translations";

const formatDate = (dateString: string, language: Language, t: any): string => {
  if (!dateString) return "";
  if (/^\d{4}-\d{2}$/.test(dateString)) {
    const [year, month] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1);
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      month: 'short',
      year: 'numeric'
    }).format(date).toUpperCase();
  }
  return dateString.toUpperCase();
};

export const generateDocx = async (data: CVData, language: Language) => {
  const t = translations[language];
  const { personalInfo, summary, experience, education, skills, projects } = data;

  const sections = [];

  // Header Section
  const headerChildren = [
    new Paragraph({
      text: (personalInfo.fullName || t.fullName).toUpperCase(),
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    })
  ];

  // Contact Info Line
  const contactParts: TextRun[] = [];
  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.website,
    personalInfo.linkedin,
    personalInfo.twitter,
    personalInfo.github
  ].filter(Boolean);

  contactItems.forEach((item, index) => {
    contactParts.push(new TextRun({ text: item, size: 20 })); // 10pt
    if (index < contactItems.length - 1) {
      contactParts.push(new TextRun({ text: " | ", size: 20 }));
    }
  });

  headerChildren.push(
    new Paragraph({
      children: contactParts,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );

  sections.push(...headerChildren);

  // Helper for Section Titles
  const createSectionTitle = (title: string) => {
    return new Paragraph({
      text: title.toUpperCase(),
      heading: HeadingLevel.HEADING_2,
      border: {
        bottom: {
          color: "000000",
          space: 1,
          style: BorderStyle.SINGLE,
          size: 12, // Thicker border for Neo-Brutalist vibe
        },
      },
      spacing: { before: 200, after: 200 },
    });
  };

  // Summary
  if (summary) {
    sections.push(createSectionTitle(t.summary));
    sections.push(
      new Paragraph({
        children: [new TextRun(summary)],
        spacing: { after: 300 }
      })
    );
  }

  // Experience
  if (experience.length > 0) {
    sections.push(createSectionTitle(t.experience));
    experience.forEach(exp => {
      const dateStr = `${formatDate(exp.startDate, language, t)} – ${exp.current ? t.present.toUpperCase() : formatDate(exp.endDate, language, t)}`;
      
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.position.toUpperCase(), bold: true, size: 24 }), // 12pt
            new TextRun({ 
              text: `\t${dateStr}`,
              bold: true, // Bold dates in Neo style
              size: 20 // 10pt
            })
          ],
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: 9000, // Roughly right alignment
            },
          ],
          spacing: { before: 100 }
        })
      );
      
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: exp.company, italics: true, size: 22 })],
          spacing: { after: 100 }
        })
      );

      if (exp.description) {
         // Split by newlines to handle paragraphs in description
         const lines = exp.description.split('\n');
         lines.forEach(line => {
             if(line.trim()) {
                 sections.push(
                    new Paragraph({
                        text: line.trim(),
                        bullet: { level: 0 },
                        spacing: { after: 50 }
                    })
                 );
             }
         });
      }
      sections.push(new Paragraph({ text: "", spacing: { after: 200 } })); // Spacer
    });
  }

  // Projects
  if (projects.length > 0) {
    sections.push(createSectionTitle(t.projects));
    projects.forEach(proj => {
      const titleRuns = [new TextRun({ text: proj.name.toUpperCase(), bold: true, size: 24 })];
      if (proj.link) {
          titleRuns.push(new TextRun({ text: ` (${proj.link})`, size: 18, italics: true }));
      }
      
      if (proj.startDate || proj.current) {
        const dateStr = `${formatDate(proj.startDate, language, t)} – ${proj.current ? t.present.toUpperCase() : formatDate(proj.endDate, language, t)}`;
        titleRuns.push(new TextRun({
             text: `\t${dateStr}`,
             bold: true,
             size: 20
        }));
      }

      sections.push(
        new Paragraph({
          children: titleRuns,
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: 9000,
            },
          ],
          spacing: { before: 100 }
        })
      );

      if (proj.description) {
        const lines = proj.description.split('\n');
         lines.forEach(line => {
             if(line.trim()) {
                 sections.push(
                    new Paragraph({
                        text: line.trim(),
                        bullet: { level: 0 },
                        spacing: { after: 50 }
                    })
                 );
             }
         });
      }
      sections.push(new Paragraph({ text: "", spacing: { after: 200 } }));
    });
  }

  // Education
  if (education.length > 0) {
    sections.push(createSectionTitle(t.education));
    education.forEach(edu => {
      const dateStr = `${formatDate(edu.startDate, language, t)} – ${edu.current ? t.present.toUpperCase() : formatDate(edu.endDate, language, t)}`;
      
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution.toUpperCase(), bold: true, size: 24 }),
            new TextRun({ 
              text: `\t${dateStr}`,
              bold: true,
              size: 20
            })
          ],
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: 9000,
            },
          ],
          spacing: { before: 100 }
        })
      );

      sections.push(
        new Paragraph({
          text: edu.degree,
          spacing: { after: 50 }
        })
      );
      
      if (edu.description) {
          sections.push(
            new Paragraph({
              text: edu.description,
              spacing: { after: 50 }
            })
          );
      }
      sections.push(new Paragraph({ text: "", spacing: { after: 200 } }));
    });
  }

  // Skills
  if (skills.length > 0) {
    sections.push(createSectionTitle(t.skills));
    sections.push(
      new Paragraph({
        text: skills.map(s => s.toUpperCase()).join(", "),
        spacing: { after: 200 }
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
             page: {
                 margin: {
                     top: 1000,
                     right: 1000,
                     bottom: 1000,
                     left: 1000,
                 },
             },
        },
        children: sections,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `CV_${(personalInfo.fullName || "Draft").replace(/\s+/g, "_")}.docx`;
  
  // Use robust saveAs detection: either the default export itself is the function, or it has a saveAs property
  const saveAs = (FileSaver as any).saveAs || FileSaver;
  saveAs(blob, fileName);
};
