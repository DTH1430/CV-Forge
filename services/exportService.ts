import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CVData, Language } from '../types';

// Export functions for different formats
export const exportToPDF = async (elementId: string, quality: 'standard' | 'high' = 'standard'): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('CV preview element not found');
  }

  // Calculate scale based on quality
  const scale = quality === 'high' ? 3 : 2;
  
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false
  });
  
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  
  // Calculate dimensions to maintain aspect ratio
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const pdf = new jsPDF({
    orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
    unit: 'pt',
    format: [imgWidth, imgHeight]
  });
  
  pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
  pdf.save('cv.pdf');
};

export const exportToPNG = async (elementId: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('CV preview element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false
  });
  
  const imgData = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = imgData;
  link.download = 'cv.png';
  link.click();
};

export const exportToJPEG = async (elementId: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('CV preview element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false
  });
  
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const link = document.createElement('a');
  link.href = imgData;
  link.download = 'cv.jpg';
  link.click();
};

export const exportToMarkdown = (cvData: CVData, language: Language): void => {
  let markdown = `# ${cvData.personalInfo.fullName}\n\n`;
  
  // Contact info
  const contactInfo = [
    cvData.personalInfo.email,
    cvData.personalInfo.phone,
    cvData.personalInfo.location,
    cvData.personalInfo.website,
    cvData.personalInfo.linkedin,
    cvData.personalInfo.github
  ].filter(info => info).join(' | ');
  
  if (contactInfo) {
    markdown += `**${contactInfo}**\n\n`;
  }
  
  // Summary
  if (cvData.summary) {
    markdown += `## Summary\n\n${cvData.summary}\n\n`;
  }
  
  // Experience
  if (cvData.experience.length > 0) {
    markdown += '## Experience\n\n';
    cvData.experience.forEach(exp => {
      const dates = exp.startDate ? 
        `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate || ''}` : 
        '';
      markdown += `### ${exp.position} at ${exp.company}\n`;
      if (dates) {
        markdown += `*${dates}*\n`;
      }
      if (exp.description) {
        markdown += `${exp.description}\n\n`;
      }
    });
  }
  
  // Education
  if (cvData.education.length > 0) {
    markdown += '## Education\n\n';
    cvData.education.forEach(edu => {
      const dates = edu.startDate ? 
        `${edu.startDate} – ${edu.current ? 'Present' : edu.endDate || ''}` : 
        '';
      markdown += `### ${edu.degree} from ${edu.institution}\n`;
      if (dates) {
        markdown += `*${dates}*\n`;
      }
      if (edu.description) {
        markdown += `${edu.description}\n\n`;
      }
    });
  }
  
  // Skills
  if (cvData.skills.length > 0) {
    markdown += '## Skills\n\n';
    markdown += `- ${cvData.skills.join('\n- ')}\n\n`;
  }
  
  // Projects
  if (cvData.projects.length > 0) {
    markdown += '## Projects\n\n';
    cvData.projects.forEach(proj => {
      const dates = proj.startDate ? 
        `${proj.startDate} – ${proj.current ? 'Present' : proj.endDate || ''}` : 
        '';
      markdown += `### ${proj.name}\n`;
      if (dates) {
        markdown += `*${dates}*\n`;
      }
      if (proj.description) {
        markdown += `${proj.description}\n\n`;
      }
      if (proj.link) {
        markdown += `[${proj.link}](${proj.link})\n\n`;
      }
    });
  }
  
  // Trigger download
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cv.md';
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToLaTeX = (cvData: CVData, language: Language): void => {
  let latex = `\\documentclass[11pt,a4paper]{article}\n`;
  latex += `\\usepackage[margin=0.6in]{geometry}\n`;
  latex += `\\usepackage{enumitem}\n`;
  latex += `\\usepackage{titlesec}\n`;
  latex += `\\usepackage{xcolor}\n`;
  latex += `\\usepackage{hyperref}\n`;
  latex += `\\hypersetup{colorlinks=true, linkcolor=black, urlcolor=blue}\n\n`;
  
  latex += `\\begin{document}\n\n`;
  
  // Header
  latex += `\\begin{center}\n`;
  latex += `\\textbf{\\Huge ${cvData.personalInfo.fullName.replace(/[{}]/g, '')}} \\vspace{0.2cm} \\\\\n`;
  
  const contactInfo = [
    cvData.personalInfo.email,
    cvData.personalInfo.phone,
    cvData.personalInfo.location,
    cvData.personalInfo.website,
    cvData.personalInfo.linkedin,
    cvData.personalInfo.github
  ].filter(info => info);
  
  if (contactInfo.length > 0) {
    latex += `{\\large ${contactInfo.join(' $|$ ')}} \\\\\n`;
  }
  
  latex += `\\end{center}\n\n`;
  
  // Summary
  if (cvData.summary) {
    latex += `\\section*{Summary}\n${cvData.summary}\n\n`;
  }
  
  // Experience
  if (cvData.experience.length > 0) {
    latex += `\\section*{Experience}\n`;
    cvData.experience.forEach(exp => {
      const dates = exp.startDate ? 
        `\\hfill ${exp.startDate} – ${exp.current ? 'Present' : exp.endDate || ''}` : 
        '';
      latex += `\\textbf{${exp.position}} at \\textbf{${exp.company}} ${dates} \\\\\n`;
      if (exp.description) {
        latex += `${exp.description.replace(/\n/g, '\\\\')}\n\n`;
      }
    });
  }
  
  // Education
  if (cvData.education.length > 0) {
    latex += `\\section*{Education}\n`;
    cvData.education.forEach(edu => {
      const dates = edu.startDate ? 
        `\\hfill ${edu.startDate} – ${edu.current ? 'Present' : edu.endDate || ''}` : 
        '';
      latex += `\\textbf{${edu.degree}} from \\textbf{${edu.institution}} ${dates} \\\\\n`;
      if (edu.description) {
        latex += `${edu.description.replace(/\n/g, '\\\\')}\n\n`;
      }
    });
  }
  
  // Skills
  if (cvData.skills.length > 0) {
    latex += `\\section*{Skills}\n`;
    latex += `\\begin{itemize}[leftmargin=*]\n`;
    cvData.skills.forEach(skill => {
      latex += `\\item ${skill}\n`;
    });
    latex += `\\end{itemize}\n\n`;
  }
  
  // Projects
  if (cvData.projects.length > 0) {
    latex += `\\section*{Projects}\n`;
    cvData.projects.forEach(proj => {
      const dates = proj.startDate ? 
        `\\hfill ${proj.startDate} – ${proj.current ? 'Present' : proj.endDate || ''}` : 
        '';
      latex += `\\textbf{${proj.name}} ${dates} \\\\\n`;
      if (proj.description) {
        latex += `${proj.description.replace(/\n/g, '\\\\')}\n`;
      }
      if (proj.link) {
        latex += `\\url{${proj.link}}\n\n`;
      }
    });
  }
  
  latex += `\\end{document}`;
  
  // Trigger download
  const blob = new Blob([latex], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cv.tex';
  link.click();
  URL.revokeObjectURL(url);
};