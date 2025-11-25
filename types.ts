
export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    twitter: string;
    github: string;
    profilePicture?: string; // URL or base64 image data
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
}

export const getEmptyCVData = (): CVData => ({
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    twitter: '',
    github: '',
    profilePicture: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
});

export type Language = 'en' | 'vi';
