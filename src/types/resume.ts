export interface PersonalInfo {
    name: string;
    phone: string;
    email: string;
    linkedinUrl: string;
    githubUrl: string;
    linkedinProfile: string;
    githubProfile: string;
}

export interface Education {
    school: string;
    location: string;
    degree: string;
    date: string;
}

export interface Experience {
    title: string;
    company: string;
    location: string;
    date: string;
    highlights?: string[];
}

export interface Project {
    name: string;
    technologies: string;
    date: string;
    highlights?: string[];
}

export interface TechnicalSkills {
    languages?: string;
    frameworks?: string;
    developerTools?: string;
    libraries?: string;
}

export interface ResumeData {
    personalInfo: PersonalInfo;
    education: Education[];
    experience: Experience[];
    projects: Project[];
    technicalSkills: TechnicalSkills;
    hasEducation?: boolean;
    hasExperience?: boolean;
    hasProjects?: boolean;
    hasSkills?: boolean;
    hasContactInfo?: boolean;
    linkedinProfile?: string;
    githubProfile?: string;
}

export interface FormSectionProps {
    control: any; // You can make this more specific if needed
} 